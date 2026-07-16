import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import OpenAI from 'openai';
import { GoogleGenAI, Type } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import { useWakeLock } from './useWakeLock';

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  // Find the first '{' or '[' and the last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  
  let start = -1;
  let end = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = lastBrace;
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = lastBracket;
  }
  
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }
  
  return cleaned.trim();
}

export function useGenerationQueue() {
  const {
    generationQueue,
    isProcessingQueue,
    setIsProcessingQueue,
    removeFromQueue,
    chapters,
    updateChapter,
    openRouterApiKey,
    googleGeminiApiKey,
    aiProvider,
    baseUrl,
    selectedModel,
    addToQueueCompleted,
    addToQueueFailed
  } = useStore();

  // useWakeLock handled globally in Layout.tsx

  useEffect(() => {
    if (generationQueue.length > 0 && !isProcessingQueue) {
      processNextTask();
    }
  }, [generationQueue, isProcessingQueue]);

  const processNextTask = async () => {
    if (useStore.getState().generationQueue.length === 0) return;
    if (useStore.getState().isProcessingQueue) return;
    
    setIsProcessingQueue(true);
    const task = useStore.getState().generationQueue[0];
    
    // Sync single chapter status from Firestore to get any other generated parts
    const syncedChapter = await useStore.getState().syncChapterFromFirestore(task.chapterId);
    const chapter = syncedChapter || useStore.getState().chapters.find(c => c.id === task.chapterId);

    if (!chapter || !chapter.storyText) {
      // Skip if chapter not found or no story text
      removeFromQueue(task.id);
      setIsProcessingQueue(false);
      return;
    }

    try {
      let openai: OpenAI | null = null;
      let googleAi: GoogleGenAI | null = null;

      if (aiProvider === 'openrouter') {
        openai = new OpenAI({
          baseURL: baseUrl,
          apiKey: openRouterApiKey || 'dummy-key',
          dangerouslyAllowBrowser: true,
          defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Content Studio",
          }
        });
      } else {
        googleAi = new GoogleGenAI({ apiKey: googleGeminiApiKey || 'dummy-key' });
      }

      const modelId = aiProvider === 'google' ? selectedModel.trim().replace(/^google\//, '') : selectedModel.trim();

      if (task.type === 'wordbank') {
        await updateChapter(chapter.id, { isGeneratingWordBank: true });
        
        const wordBankPrompt = `Based on the following story, generate a Word Bank.
The Word Bank should include exactly 100 words that align with the grammar focus (${chapter.grammarFocus}).
You must return ONLY a valid JSON object with a single key "wordBank" containing an array of objects.
Each object in the array must have exactly these five keys:
- "italian": The Italian word or phrase
- "partOfSpeech": Full part of speech (e.g., noun, verb, adjective) - DO NOT abbreviate
- "english": English translation
- "example": An example sentence in Italian using the word
- "exampleTranslation": English translation of the example sentence

Story:
${chapter.storyText}`;

        let wordBankJson: any[] = [];
        
        try {
          let rawContent = "{}";
          if (aiProvider === 'openrouter' && openai) {
            const wordBankCompletion = await openai.chat.completions.create({
              model: modelId,
              messages: [
                { role: "system", content: "You are an expert Italian language teacher. You must respond with valid JSON ONLY. Do not include any explanation or markdown formatting outside the JSON block." },
                { role: "user", content: wordBankPrompt }
              ],
              response_format: { type: "json_object" },
              max_tokens: 8000,
            });
            rawContent = wordBankCompletion.choices[0]?.message?.content || "{}";
          } else if (aiProvider === 'google' && googleAi) {
            const response = await googleAi.models.generateContent({
              model: modelId,
              contents: wordBankPrompt,
              config: {
                systemInstruction: "You are an expert Italian language teacher. You must respond with valid JSON ONLY. Do not include any explanation or markdown formatting outside the JSON block.",
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    wordBank: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          italian: { type: Type.STRING },
                          partOfSpeech: { type: Type.STRING },
                          english: { type: Type.STRING },
                          example: { type: Type.STRING },
                          exampleTranslation: { type: Type.STRING }
                        },
                        required: ["italian", "partOfSpeech", "english", "example", "exampleTranslation"]
                      }
                    }
                  },
                  required: ["wordBank"]
                }
              }
            });
            rawContent = response.text || "{}";
          }

          const cleanedContent = cleanJsonResponse(rawContent);
          let parsed;
          try {
            parsed = JSON.parse(cleanedContent);
          } catch (e) {
            console.warn("Standard JSON parse failed, attempting repair...", e);
            parsed = JSON.parse(jsonrepair(cleanedContent));
          }
          
          if (parsed.wordBank && Array.isArray(parsed.wordBank)) {
            wordBankJson = parsed.wordBank;
          } else if (parsed.word_bank && Array.isArray(parsed.word_bank)) {
            wordBankJson = parsed.word_bank;
          } else if (parsed.words && Array.isArray(parsed.words)) {
            wordBankJson = parsed.words;
          } else if (Array.isArray(parsed)) {
            wordBankJson = parsed;
          } else {
            const arrayValue = Object.values(parsed).find(val => Array.isArray(val));
            if (arrayValue) {
              wordBankJson = arrayValue as any[];
            }
          }
        } catch (e) {
          console.error("Failed to parse word bank response", e);
        }

        if (Array.isArray(wordBankJson) && wordBankJson.length > 0) {
          const validWordBank = wordBankJson.filter(word => 
            word && 
            typeof word === 'object' && 
            word.italian && 
            (word.partOfSpeech || word.pos) && 
            word.english && 
            word.example
          );

          const normalizedWordBank = validWordBank.map(word => ({
            ...word,
            partOfSpeech: word.partOfSpeech || word.pos
          }));

          if (normalizedWordBank.length > 0) {
            await updateChapter(chapter.id, {
              wordBankJson: normalizedWordBank,
              isGeneratingWordBank: false
            });
          } else {
            throw new Error("Failed to generate valid word bank");
          }
        } else {
          throw new Error("Failed to generate valid word bank");
        }

      } else if (task.type === 'grammar') {
        await updateChapter(chapter.id, { isGeneratingGrammar: true });
        
        const grammarPrompt = `Based on the following story, generate a Grammar Lesson.
The Grammar Lesson should explain the grammar focus (${chapter.grammarFocus}) using examples from the story. Use tables or lists for readability if appropriate. The lesson should be appropriate for a CEFR level of ${chapter.cefrLevel}.

Story:
${chapter.storyText}`;

        let grammarLessonText = "";
        
        if (aiProvider === 'openrouter' && openai) {
          const grammarCompletion = await openai.chat.completions.create({
            model: modelId,
            messages: [
              { role: "system", content: "You are an expert Italian language teacher. Output ONLY the markdown formatted grammar lesson." },
              { role: "user", content: grammarPrompt }
            ],
            max_tokens: 4000,
          });
          grammarLessonText = grammarCompletion.choices[0]?.message?.content || "";
        } else if (aiProvider === 'google' && googleAi) {
          const response = await googleAi.models.generateContent({
            model: modelId,
            contents: grammarPrompt,
            config: {
              systemInstruction: "You are an expert Italian language teacher. Output ONLY the markdown formatted grammar lesson.",
            }
          });
          grammarLessonText = response.text || "";
        }
        
        // Strip markdown code block wrappers if present
        if (grammarLessonText.startsWith('```markdown')) {
          grammarLessonText = grammarLessonText.replace(/^```markdown\n/, '').replace(/\n```$/, '');
        } else if (grammarLessonText.startsWith('```')) {
          grammarLessonText = grammarLessonText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        // Remove em dashes
        grammarLessonText = grammarLessonText.replace(/—/g, '');

        if (grammarLessonText && grammarLessonText.trim().length > 0) {
          await updateChapter(chapter.id, {
            grammarLessonText: grammarLessonText.trim(),
            isGeneratingGrammar: false
          });
        } else {
          throw new Error("Failed to generate valid grammar lesson");
        }
      } else if (task.type === 'sidebyside') {
        await updateChapter(chapter.id, { isGeneratingSideBySide: true });
        
        // Split the story into chunks by "## Capitolo " to avoid context limits
        const storyChunks = chapter.storyText.split(/(?=## Capitolo )/g).filter(chunk => chunk.trim().length > 0);
        
        let fullSideBySideText = "";
        
        for (let i = 0; i < storyChunks.length; i++) {
          const chunkText = storyChunks[i];
          
          const sideBySidePrompt = `You are an expert Italian language translator. Your ONLY task is to translate the provided Italian text into English and format it as a side-by-side bilingual table.

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. DO NOT write a new story. DO NOT summarize. DO NOT invent dialogue.
2. You MUST use the EXACT text provided below under "ORIGINAL ITALIAN TEXT". You are NOT allowed to change, rewrite, or continue the story. 
3. Break the provided text down STRICTLY sentence by sentence. Every single row in the table MUST be exactly one sentence. Do not group multiple sentences into a single row.
4. Format the output as a Markdown table with exactly two columns: "Italian" and "English". DO NOT OUTPUT ANYTHING ELSE.
5. The left column ("Italian") MUST contain the exact sentences from the provided text, untouched and unchanged.
6. The right column ("English") MUST contain your English translation of that exact sentence.
7. Keep all the bolding from the original Italian text in the left column. In the English translation, bold the words that correspond to the bolded Italian words.
8. TRANSLATE THE ENTIRE TEXT PROVIDED. You must process every single paragraph from the beginning to the very end of the provided text. Do not stop early, do not truncate, and do not omit any parts.

Example format:
| Italian | English |
|---|---|
| **Il sole** di Roma splende. | **The sun** of Rome shines. |
| Buongiorno a tutti. | Good morning everyone. |

--- ORIGINAL ITALIAN TEXT ---
${chunkText}
-----------------------------`;

          let chunkSideBySideText = "";
          
          let retries = 0;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
            try {
              if (aiProvider === 'openrouter' && openai) {
                const completion = await openai.chat.completions.create({
                  model: modelId,
                  messages: [
                    { role: "system", content: "You are an expert Italian language teacher. Output ONLY the markdown formatted table." },
                    { role: "user", content: sideBySidePrompt }
                  ],
                  max_tokens: 8000,
                });
                chunkSideBySideText = completion.choices[0]?.message?.content || "";
              } else if (aiProvider === 'google' && googleAi) {
                const response = await googleAi.models.generateContent({
                  model: modelId,
                  contents: sideBySidePrompt,
                  config: {
                    systemInstruction: "You are an expert Italian language teacher. Output ONLY the markdown formatted table.",
                  }
                });
                chunkSideBySideText = response.text || "";
              }
              break; // Success
            } catch (err: any) {
              retries++;
              if (retries >= maxRetries) throw err;
              console.log(`Side-by-side chunk ${i} failed, retrying (${retries}/${maxRetries})...`, err);
              await new Promise(resolve => setTimeout(resolve, 2000 * retries));
            }
          }
          
          // Strip markdown code block wrappers if present
          if (chunkSideBySideText.startsWith('```markdown')) {
            chunkSideBySideText = chunkSideBySideText.replace(/^```markdown\n/, '').replace(/\n```$/, '');
          } else if (chunkSideBySideText.startsWith('```')) {
            chunkSideBySideText = chunkSideBySideText.replace(/^```\n/, '').replace(/\n```$/, '');
          }
          
          // If it's not the first chunk, strip the markdown table header to make it one continuous table
          if (i > 0) {
            const lines = chunkSideBySideText.split('\n');
            // Find the header separator line (e.g., |---|---|)
            const separatorIndex = lines.findIndex(line => line.replace(/\s/g, '').includes('|---|---|') || line.replace(/\s/g, '').includes('|:---|:---|'));
            if (separatorIndex !== -1) {
              chunkSideBySideText = lines.slice(separatorIndex + 1).join('\n');
            }
          }

          fullSideBySideText += (i > 0 ? "\n" : "") + chunkSideBySideText.trim();
          
          // Remove em dashes
          fullSideBySideText = fullSideBySideText.replace(/—/g, '');

          // Update incrementally so user sees progress
          await updateChapter(chapter.id, { sideBySideText: fullSideBySideText });
        }

        if (fullSideBySideText && fullSideBySideText.trim().length > 0) {
          await updateChapter(chapter.id, {
            sideBySideText: fullSideBySideText.trim(),
            isGeneratingSideBySide: false
          });
        } else {
          throw new Error("Failed to generate valid side-by-side text");
        }
      } else if (task.type === 'epub') {
        await updateChapter(chapter.id, { isGeneratingEpub: true });
        
        // Split the story into chunks by "## Capitolo " to avoid context limits
        const storyChunks = chapter.storyText.split(/(?=## Capitolo )/g).filter(chunk => chunk.trim().length > 0);
        
        let fullEpubText = "";
        
        for (let i = 0; i < storyChunks.length; i++) {
          const chunkText = storyChunks[i];
          
          const epubPrompt = `You are an expert Italian language translator. Your task is to translate the provided Italian text into English and format it as a side-by-side bilingual Markdown table for an EPUB file.

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. DO NOT summarize. DO NOT invent dialogue.
2. You MUST use the EXACT text provided below under "ORIGINAL ITALIAN TEXT".
3. Break the provided text down STRICTLY sentence by sentence. Every single row in the table MUST be exactly one sentence.
4. Format the output as a Markdown table with exactly two columns: "Italian" and "English".
5. The left column ("Italian") MUST contain the exact sentences from the provided text, untouched and unchanged.
6. The right column ("English") MUST contain your English translation of that exact sentence.
7. Keep all the bolding from the original Italian text in the left column. In the English translation, bold the words that correspond to the bolded Italian words.
8. TRANSLATE THE ENTIRE TEXT PROVIDED. 

Example format:
| Italian | English |
|---|---|
| **Il sole** di Roma splende. | **The sun** of Rome shines. |
| Buongiorno a tutti. | Good morning everyone. |

--- ORIGINAL ITALIAN TEXT ---
${chunkText}
-----------------------------`;

          let chunkEpubText = "";
          
          let retries = 0;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
            try {
              if (aiProvider === 'openrouter' && openai) {
                const completion = await openai.chat.completions.create({
                  model: modelId,
                  messages: [
                    { role: "system", content: "You are an expert Italian language teacher. Output ONLY the markdown formatted table." },
                    { role: "user", content: epubPrompt }
                  ],
                  max_tokens: 8000,
                });
                chunkEpubText = completion.choices[0]?.message?.content || "";
              } else if (aiProvider === 'google' && googleAi) {
                const response = await googleAi.models.generateContent({
                  model: modelId,
                  contents: epubPrompt,
                  config: {
                    systemInstruction: "You are an expert Italian language teacher. Output ONLY the markdown formatted table.",
                  }
                });
                chunkEpubText = response.text || "";
              }
              break; // Success
            } catch (err: any) {
              retries++;
              if (retries >= maxRetries) throw err;
              console.log(`EPUB chunk ${i} failed, retrying (${retries}/${maxRetries})...`, err);
              await new Promise(resolve => setTimeout(resolve, 2000 * retries));
            }
          }
          
          // Strip markdown code block wrappers if present
          if (chunkEpubText.startsWith('```markdown')) {
            chunkEpubText = chunkEpubText.replace(/^```markdown\n/, '').replace(/\n```$/, '');
          } else if (chunkEpubText.startsWith('```')) {
            chunkEpubText = chunkEpubText.replace(/^```\n/, '').replace(/\n```$/, '');
          }
          
          // If it's not the first chunk, strip the markdown table header to make it one continuous table
          if (i > 0) {
            const lines = chunkEpubText.split('\n');
            const separatorIndex = lines.findIndex(line => line.replace(/\s/g, '').includes('|---|---|') || line.replace(/\s/g, '').includes('|:---|:---|'));
            if (separatorIndex !== -1) {
              chunkEpubText = lines.slice(separatorIndex + 1).join('\n');
            }
          }

          fullEpubText += (i > 0 ? "\n" : "") + chunkEpubText.trim();
          
          // Remove em dashes
          fullEpubText = fullEpubText.replace(/—/g, '');

          // Update incrementally so user sees progress
          await updateChapter(chapter.id, { epubText: fullEpubText });
        }

        if (fullEpubText && fullEpubText.trim().length > 0) {
          await updateChapter(chapter.id, {
            epubText: fullEpubText.trim(),
            isGeneratingEpub: false
          });
        } else {
          throw new Error("Failed to generate valid EPUB text");
        }
      }

      // Success!
      addToQueueCompleted(task);
    } catch (error) {
      console.error(`Failed to process ${task.type} for chapter ${task.chapterId}:`, error);
      
      let errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('403') || errorMessage.toLowerCase().includes('limit exceeded') || errorMessage.toLowerCase().includes('api key')) {
        errorMessage = `AI Provider Error: ${errorMessage}. Please check your API key status, balance, or limits. You can switch providers in the Settings menu.`;
      }

      // Determine if we should retry (e.g., network error)
      const isNetworkError = error instanceof Error && 
        (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout') || errorMessage.includes('Failed to fetch'));
      
      if (isNetworkError) {
        console.log("Network error detected, keeping task in queue for retry...");
        // Don't remove from queue, it will be retried on next effect trigger
        // But we must reset processing flag
        setIsProcessingQueue(false);
        return; // Exit without removing from queue
      }

      // Reset the generating flag on failure
      if (task.type === 'wordbank') {
        await updateChapter(chapter.id, { isGeneratingWordBank: false });
      } else if (task.type === 'grammar') {
        await updateChapter(chapter.id, { isGeneratingGrammar: false });
      } else if (task.type === 'sidebyside') {
        await updateChapter(chapter.id, { isGeneratingSideBySide: false });
      } else if (task.type === 'epub') {
        await updateChapter(chapter.id, { isGeneratingEpub: false });
      }

      addToQueueFailed(task, errorMessage);
    } finally {
      // Only remove if we didn't return early (retry case)
      if (useStore.getState().isProcessingQueue) {
        removeFromQueue(task.id);
        setIsProcessingQueue(false);
      }
    }
  };
}
