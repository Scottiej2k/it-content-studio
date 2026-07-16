import { useState, useRef, useEffect } from 'react';
import { useStore, GenerationStep } from '../store/useStore';
import { Play, Loader2, CheckCircle2, AlertCircle, Clock, BookOpen, Square, X } from 'lucide-react';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useWakeLock } from '../hooks/useWakeLock';

function GenerationChecklist({ currentStep }: { currentStep?: GenerationStep }) {
  const steps: { id: GenerationStep, label: string }[] = [
    { id: 'title', label: 'Title section' },
    { id: 'chapter1', label: 'Chapter 1' },
    { id: 'chapter2', label: 'Chapter 2' },
    { id: 'chapter3', label: 'Chapter 3' },
    { id: 'chapter4', label: 'Chapter 4' },
    { id: 'chapter5', label: 'Chapter 5' },
  ];

  const currentIndex = currentStep ? steps.findIndex(s => s.id === currentStep) : -1;

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
      <h2 className="font-semibold text-stone-800 mb-4">Generation Progress</h2>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isComplete = currentStep === 'complete' || (currentIndex > -1 && index < currentIndex);
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-stone-200" />
              )}
              <span className={`text-sm ${isComplete ? 'text-stone-600' : isCurrent ? 'text-indigo-700 font-medium' : 'text-stone-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cleanMarkdownBolding = (text: string) => {
  let cleaned = text;
  // Remove em dashes (often used for dialogue in Italian, but requested to be removed)
  cleaned = cleaned.replace(/—/g, '');
  // Fix **l'** **parola** -> **l'parola**
  cleaned = cleaned.replace(/\*\*([\p{L}]+['’‘])\*\*\s*\*\*([\p{L}]+)\*\*/giu, "**$1$2**");
  // Fix **l'**parola** -> **l'parola**
  cleaned = cleaned.replace(/\*\*([\p{L}]+['’‘])\*\*\s*([\p{L}]+)\*\*/giu, "**$1$2**");
  // Fix **l'**parola -> **l'parola**
  cleaned = cleaned.replace(/\*\*([\p{L}]+['’‘])\*\*\s*([\p{L}]+)/giu, "**$1$2**");
  // Fix l'**parola** -> **l'parola**
  cleaned = cleaned.replace(/([\p{L}]+['’‘])\s*\*\*([\p{L}]+)\*\*/giu, "**$1$2**");
  return cleaned;
};

export function Generate() {
  const chapters = useStore(state => state.chapters);
  const updateChapter = useStore(state => state.updateChapter);
  const addChapter = useStore(state => state.addChapter);
  const openRouterApiKey = useStore(state => state.openRouterApiKey);
  const googleGeminiApiKey = useStore(state => state.googleGeminiApiKey);
  const aiProvider = useStore(state => state.aiProvider);
  const selectedModel = useStore(state => state.selectedModel);
  const baseUrl = useStore(state => state.baseUrl);
  const maxTokens = useStore(state => state.maxTokens);
  const targetWordCount = useStore(state => state.targetWordCount);
  const worldBible = useStore(state => state.worldBible);
  const episodeOutlines = useStore(state => state.episodeOutlines);

  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | string>(
    chapters[0]?.chapterNumber || episodeOutlines[0]?.chapterNumber || ''
  );
  const [error, setError] = useState<string | null>(null);
  
  const isGenerating = useStore(state => state.isGenerating);
  const setIsGenerating = useStore(state => state.setIsGenerating);
  const generationProgress = useStore(state => state.generationProgress);
  const setGenerationProgress = useStore(state => state.setGenerationProgress);
  const abortController = useStore(state => state.abortController);
  const setAbortController = useStore(state => state.setAbortController);

  const batchQueue = useStore(state => state.batchQueue);
  const setBatchQueue = useStore(state => state.setBatchQueue);
  const batchCompleted = useStore(state => state.batchCompleted);
  const setBatchCompleted = useStore(state => state.setBatchCompleted);
  const batchFailed = useStore(state => state.batchFailed);
  const setBatchFailed = useStore(state => state.setBatchFailed);
  const isBatchRunning = useStore(state => state.isBatchRunning);
  const setIsBatchRunning = useStore(state => state.setIsBatchRunning);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchSelection, setBatchSelection] = useState<number[]>([]);

  // useWakeLock handled globally in Layout.tsx

  // Update selected chapter when outlines load
  useEffect(() => {
    if (!selectedChapterNumber && episodeOutlines.length > 0) {
      setSelectedChapterNumber(episodeOutlines[0].chapterNumber);
    }
  }, [episodeOutlines, selectedChapterNumber]);

  const selectedOutline = episodeOutlines.find(o => o.chapterNumber === Number(selectedChapterNumber));
  const selectedChapter = chapters.find(c => c.chapterNumber === Number(selectedChapterNumber));

  // Process batch queue
  useEffect(() => {
    if (isBatchRunning && !isGenerating) {
      if (batchQueue.length > 0) {
        const nextChapterNum = batchQueue[0];
        setSelectedChapterNumber(nextChapterNum);
        
        // Use a small timeout to allow state to settle
        setTimeout(() => {
          handleGenerate(false, nextChapterNum).then((success) => {
            setBatchQueue(useStore.getState().batchQueue.slice(1));
            if (success) {
              setBatchCompleted([...useStore.getState().batchCompleted, nextChapterNum]);
            } else {
              setBatchFailed([...useStore.getState().batchFailed, nextChapterNum]);
            }
          });
        }, 500);
      } else {
        setIsBatchRunning(false);
      }
    }
  }, [isBatchRunning, isGenerating, batchQueue]);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsGenerating(false);
    setGenerationProgress(null);
    if (selectedChapter) {
      updateChapter(selectedChapter.id, { status: 'failed' });
      setError("Generation stopped by user.");
    }
  };

  const handleGenerate = async (isTest: boolean = false, chapterNum?: number): Promise<boolean> => {
    const targetChapterNum = chapterNum ?? Number(selectedChapterNumber);
    const targetOutline = episodeOutlines.find(o => o.chapterNumber === targetChapterNum);
    const targetChapter = chapters.find(c => c.chapterNumber === targetChapterNum);

    let currentChapter = targetChapter;
    if (targetChapter) {
      const synced = await useStore.getState().syncChapterFromFirestore(targetChapter.id);
      if (synced) {
        currentChapter = synced;
      }
    }

    if (isTest && targetOutline) {
      const testId = crypto.randomUUID();
      const newChapter = {
        id: testId,
        chapterNumber: Number((targetOutline.chapterNumber + (Math.random() * 0.9)).toFixed(2)), // Add a random decimal to avoid collisions and keep it near the original
        title: `[TEST] ${targetOutline.title}`,
        cefrLevel: targetOutline.cefrLevel,
        grammarFocus: targetOutline.grammarFocus,
        episodeJob: targetOutline.episodeJob,
        logline: targetOutline.logline,
        aStory: targetOutline.aStory,
        bStory: targetOutline.bStory,
        cStory: targetOutline.cStory,
        coreLanguageTarget: targetOutline.coreLanguageTarget,
        storyBeats: targetOutline.storyBeats,
        emotionalMovement: targetOutline.emotionalMovement,
        writerNotes: targetOutline.writerNotes,
        wordCount: 0,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        await addChapter(newChapter);
        currentChapter = newChapter;
      } catch (e) {
        console.error("Failed to create test chapter:", e);
        setError("Failed to create test chapter in database.");
        return false;
      }
    } else if (!currentChapter && targetOutline) {
      const newChapter = {
        id: crypto.randomUUID(),
        chapterNumber: targetOutline.chapterNumber,
        title: targetOutline.title,
        cefrLevel: targetOutline.cefrLevel,
        grammarFocus: targetOutline.grammarFocus,
        episodeJob: targetOutline.episodeJob,
        logline: targetOutline.logline,
        aStory: targetOutline.aStory,
        bStory: targetOutline.bStory,
        cStory: targetOutline.cStory,
        coreLanguageTarget: targetOutline.coreLanguageTarget,
        storyBeats: targetOutline.storyBeats,
        emotionalMovement: targetOutline.emotionalMovement,
        writerNotes: targetOutline.writerNotes,
        wordCount: 0,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        await addChapter(newChapter);
        currentChapter = newChapter;
      } catch (e) {
        console.error("Failed to create chapter:", e);
        setError("Failed to create chapter in database.");
        return false;
      }
    }

    if (!currentChapter) return false;
    
    if (aiProvider === 'openrouter' && !baseUrl) {
      setError("Please configure your API Base URL in Settings first.");
      return false;
    }
    if (aiProvider === 'openrouter' && !openRouterApiKey) {
      setError("Please configure your OpenRouter API key in Settings first.");
      return false;
    }
    if (aiProvider === 'google' && !googleGeminiApiKey) {
      setError("Please configure your Google Gemini API key in Settings first.");
      return false;
    }

    setIsGenerating(true);
    setError(null);
    try {
      await updateChapter(currentChapter.id, { status: 'generating' });
    } catch (e) {
      console.error("Failed to update chapter status:", e);
      setError("Failed to update chapter status in database.");
      setIsGenerating(false);
      return false;
    }
    
    const totalSections = isTest ? 1 : 5;

    setGenerationProgress({ 
      currentSection: 1, 
      totalSections, 
      statusText: "Initializing generation...",
      currentStep: 'title'
    });

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    try {
      let openai: OpenAI | null = null;
      let googleAi: GoogleGenAI | null = null;

      if (aiProvider === 'openrouter') {
        openai = new OpenAI({
          baseURL: baseUrl.trim(),
          apiKey: openRouterApiKey.trim() || "sk-dummy", // Fallback for local endpoints that don't require keys
          dangerouslyAllowBrowser: true,
          defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "Italian Content Studio",
          }
        });
      } else {
        googleAi = new GoogleGenAI({ apiKey: googleGeminiApiKey.trim() });
      }

      const outline = episodeOutlines.find(o => o.chapterNumber === currentChapter!.chapterNumber);
      
      const modelId = aiProvider === 'google' ? selectedModel.trim().replace(/^google\//, '') : selectedModel.trim();

      const baseSystemPrompt = `You are an expert Italian language curriculum author.
You are writing a story for a language learning app.
The series is called "${worldBible.seriesTitle}".
Setting: ${worldBible.setting}
Genre: ${worldBible.genre}
Tone: ${worldBible.tone}

Characters:
${worldBible.characters.map(c => `- ${c.name} (${c.age}): ${c.role}. ${c.profile}`).join('\n')}

This episode is Episode ${currentChapter.chapterNumber}: "${currentChapter.title}".
CEFR Level: ${currentChapter.cefrLevel}.
Grammar Focus: ${currentChapter.grammarFocus}.

Episode Outline:
Episode Job: ${outline?.episodeJob}
Logline: ${outline?.logline}
A-Story: ${outline?.aStory}
B-Story: ${outline?.bStory}
C-Story: ${outline?.cStory}
Core Language Target: ${outline?.coreLanguageTarget?.join(', ')}
Story Beats:
${outline?.storyBeats?.map(beat => `- ${beat}`).join('\n')}
Emotional Movement: ${outline?.emotionalMovement}
Writer Notes:
${outline?.writerNotes?.map(note => `- ${note}`).join('\n')}

Write the story ENTIRELY in Italian. Do not include any English words, translations, or explanations in the final output. Keep it engaging and appropriate for the CEFR level.
Do not use grammar structures above the target CEFR level.
The output should be formatted in Markdown.

CRITICAL INSTRUCTION: You are generating one chapter of a ${isTest ? 1 : 5}-chapter episode. This specific chapter MUST be strictly between ${Math.floor(targetWordCount / (isTest ? 1 : 5)) - 100} and ${Math.floor(targetWordCount / (isTest ? 1 : 5)) + 100} words long. Pace the story perfectly to fit this exact length. Do not over-generate or under-generate.

IMPORTANT: Words related to the grammar or vocabulary focus MUST be shown in **bold** letters (e.g., **parola**, do not add spaces inside the asterisks). If the word includes an apostrophe (like l'ascensore), bold the entire word including the article and apostrophe (e.g., **l'ascensore**, NOT **l'**ascensore or l'**ascensore**).
DO NOT use em dashes (—) for dialogue or any other purpose. Use standard quotation marks for speech.
DO NOT include a vocabulary list, word bank, or grammar explanation. Only write the story text in Italian.
Ensure the text is broken up into well-paced paragraphs with blank lines between them. Do not generate a single wall of text.`;

      let fullStoryText = "";
      let runningSummary = "";
      let lastParagraphs = "";

      for (let section = 1; section <= totalSections; section++) {
        setGenerationProgress({ 
          currentSection: section, 
          totalSections, 
          statusText: `Writing chapter ${section} of ${totalSections}...`,
          currentStep: `chapter${section}` as any
        });

        // 1. Generate the section with retry logic
        const wordsPerSection = Math.floor(targetWordCount / totalSections);
        const isA1 = currentChapter.cefrLevel.toUpperCase().includes('A1');

        let sectionPrompt = isTest 
          ? `Write a very short abbreviated test episode. This should be approximately 100-200 words. DO NOT include a vocabulary list, word bank, or grammar explanation. Only write the story text ENTIRELY in Italian. Break the text into readable paragraphs.`
          : `Write Chapter ${section} of ${totalSections} for this episode. 
          
CRITICAL INSTRUCTION: You are ONLY writing Chapter ${section} right now. This specific chapter MUST be strictly between ${wordsPerSection - 100} and ${wordsPerSection + 100} words long. Do not fall short, and do not exceed this limit. Pace the story appropriately to conclude the chapter within this exact word count range.

STYLE & TONE INSTRUCTIONS:
1. ${isA1 ? '70% DIALOGUE RULE: For this A1 level content, at least 70% of this chapter MUST be direct dialogue between characters.' : '50% DIALOGUE RULE: At least half of this chapter MUST be direct dialogue between characters.'} Show, don't tell. Let characters argue, joke, or question each other rather than relying on narrator explanation.
2. CHARACTER-DRIVEN CONFLICT: Conflicts should be grounded in the characters' quirks, differences of opinion, competing priorities, and natural misunderstandings. Keep the tone grounded but dynamic. Any soap opera, exaggerated drama, or supernatural elements should be kept minor and secondary to genuine character interactions.
${isA1 ? '3. SHORT PARAGRAPHS: For A1 learners, keep paragraphs short (2-6 sentences). Avoid long blocks of descriptive text.' : ''}

DO NOT include a vocabulary list, word bank, or grammar explanation. Only write the story text ENTIRELY in Italian. Break the text into readable paragraphs.`;
        
        const cleanGrammarFocus = currentChapter.grammarFocus.replace(/^\d+\.\d+\s*-\s*/, '').replace(/^\d+\.\d+\s*/, '');

        if (section === 1) {
          sectionPrompt += `\n\nThe story MUST start with the following headers. You MUST include a double line break (two newlines) between each of these header lines so they do not run together:

# ${cleanGrammarFocus}

**CEFR Level Target:** ${currentChapter.cefrLevel}

**Grammar/Vocabulary focus:** ${currentChapter.grammarFocus}
${currentChapter.coreLanguageTarget && currentChapter.coreLanguageTarget.length > 0 ? `\n**Examples:** [Extract ONLY the Italian words/phrases from these targets: ${currentChapter.coreLanguageTarget.join(', ')}. DO NOT include any English explanations or categories. Format the examples as plain unbolded text.]\n` : ''}
**Title:** ${currentChapter.title} / [English Translation of Episode Title]
**Description:** [English description of the story, ending with a question that the reader will find out by the end of the story based on the chapter description from the world setup. E.G. "What will <character> discover about their neighbors arrangement?"]

## Capitolo 1: [Italian Title] / [English Title]

[Chapter 1 story content begins here in Italian...]

${isTest ? "Introduce the conflict, set the scene, and resolve it quickly since this is a short test." : "Introduce the conflict and set the scene. End the chapter on a mini-cliffhanger, a shocking statement, or a comedic misunderstanding."}`;
        } else if (section === totalSections) {
          sectionPrompt += `\n\nThe story MUST start with the following header:
## Capitolo ${section}: [Italian Title] / [English Title]

[Chapter ${section} story content begins here in Italian...]

This is the final chapter of the episode. Resolve the conflict and conclude the episode with a satisfying, dramatic, or comedic ending.`;
        } else {
          sectionPrompt += `\n\nThe story MUST start with the following header:
## Capitolo ${section}: [Italian Title] / [English Title]

[Chapter ${section} story content begins here in Italian...]

Continue the story, building the narrative arc. End the chapter on a mini-cliffhanger, a shocking statement, or a comedic misunderstanding.`;
        }

        if (runningSummary) {
          sectionPrompt += `\n\nHere is the summary of the episode so far:\n${runningSummary}\n\nHere are the last few paragraphs of the previous chapter:\n...\n${lastParagraphs}\n\nContinue seamlessly from where the story left off.`;
        }

        let sectionCompletion;
        let newSectionText = "";
        let retries = 0;
        const maxRetries = 3;
        
        while (retries < maxRetries) {
          try {
            if (aiProvider === 'openrouter' && openai) {
              sectionCompletion = await openai.chat.completions.create({
                model: modelId,
                messages: [
                  { role: "system", content: baseSystemPrompt },
                  { role: "user", content: sectionPrompt }
                ],
                max_tokens: isTest ? 500 : Math.min(maxTokens, Math.floor(wordsPerSection * 3.5)),
              }, { signal: newAbortController.signal });
              newSectionText = sectionCompletion.choices[0]?.message?.content || "";
            } else if (aiProvider === 'google' && googleAi) {
              const response = await googleAi.models.generateContent({
                model: modelId,
                contents: sectionPrompt,
                config: {
                  systemInstruction: baseSystemPrompt,
                  maxOutputTokens: isTest ? 500 : Math.min(maxTokens, Math.floor(wordsPerSection * 3.5)),
                }
              });
              newSectionText = response.text || "";
            }
            break; // Success!
          } catch (err: any) {
            if (err.name === 'AbortError') throw err;
            retries++;
            if (retries >= maxRetries) throw err;
            console.log(`Section ${section} failed, retrying (${retries}/${maxRetries})...`, err);
            await new Promise(resolve => setTimeout(resolve, 2000 * retries)); // Exponential backoff
          }
        }

        newSectionText = cleanMarkdownBolding(newSectionText);
        fullStoryText += (section === 1 ? "" : "\n\n") + newSectionText;
        updateChapter(currentChapter.id, { storyText: fullStoryText });
        
        // Extract the last few paragraphs for seamless continuation
        const paragraphs = newSectionText.split('\n\n').filter(p => p.trim().length > 0);
        lastParagraphs = paragraphs.slice(-2).join('\n\n');

        // 2. Summarize if not the last section
        if (section < totalSections) {
          setGenerationProgress({ 
            currentSection: section, 
            totalSections, 
            statusText: `Summarizing section ${section} for context...`,
            currentStep: `chapter${section}` as any
          });

          const summaryPrompt = `Summarize the following story text in Italian. Focus on the main plot points, character locations, and current state of the narrative so that the next part of the chapter can be written seamlessly. Keep it concise but detailed enough for continuity.\n\nStory text:\n${fullStoryText}`;

          let newSummary = "";
          if (aiProvider === 'openrouter' && openai) {
            const summaryCompletion = await openai.chat.completions.create({
              model: modelId,
              messages: [
                { role: "user", content: summaryPrompt }
              ],
              max_tokens: 1000,
            }, { signal: newAbortController.signal });
            newSummary = summaryCompletion.choices[0]?.message?.content || "";
          } else if (aiProvider === 'google' && googleAi) {
            const summaryResponse = await googleAi.models.generateContent({
              model: modelId,
              contents: summaryPrompt,
            });
            newSummary = summaryResponse.text || "";
          }

          runningSummary = newSummary || runningSummary;
        }
      }

      // --- Finalize Chapter ---
      setGenerationProgress({ 
        currentSection: totalSections, 
        totalSections, 
        statusText: `Finalizing...`,
        currentStep: 'complete'
      });

      await updateChapter(currentChapter.id, {
        status: 'complete',
        storyText: fullStoryText,
        wordCount: fullStoryText.split(/\s+/).length,
        continuitySummary: runningSummary || `(Continuity summary generated based on the story...)`,
      });

      // Wait a moment so the user can see the final checkmarks
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear the main generation state so the UI shows it's done
      setIsGenerating(false);
      setGenerationProgress(null);
      setAbortController(null);
      
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted');
        return false;
      }
      console.error(err);

      let msg = err.message || "An error occurred during generation.";
      if (msg.includes('403') || msg.toLowerCase().includes('limit exceeded') || msg.toLowerCase().includes('api key')) {
        msg = `AI Provider Error: ${msg}. Please check your API key status, balance, or limits. You can switch providers in the Settings menu.`;
      }
      setError(msg);
      try {
        await updateChapter(currentChapter.id, { status: 'failed' });
      } catch (e) {
        console.error("Failed to update chapter status to failed:", e);
      }
      return false;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
      setAbortController(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Generate Content</h1>
        <p className="text-stone-500 mt-2">Generate individual episodes or queue a batch run.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="font-semibold text-stone-800 mb-4">Single Episode</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Select Episode</label>
                <select 
                  className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={selectedChapterNumber}
                  onChange={(e) => setSelectedChapterNumber(e.target.value)}
                  disabled={isGenerating || episodeOutlines.length === 0}
                >
                  {episodeOutlines.length === 0 ? (
                    <option value="">No episodes available</option>
                  ) : (
                    episodeOutlines.map(o => (
                      <option key={o.chapterNumber} value={o.chapterNumber}>
                        Episode {o.chapterNumber}: {o.title} ({o.cefrLevel})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerate(false)}
                    disabled={isGenerating || !selectedOutline || isBatchRunning}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating Episode...</>
                    ) : (
                      <><Play className="w-4 h-4" /> Generate Episode</>
                    )}
                  </button>
                  {isGenerating && (
                    <button
                      onClick={handleStop}
                      className="flex justify-center items-center gap-2 py-2.5 px-4 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Square className="w-4 h-4 fill-current" /> Stop
                    </button>
                  )}
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => handleGenerate(true)}
                    disabled={isGenerating || !selectedOutline || isBatchRunning}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-indigo-200 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-3 h-3" /> Test Episode (Short)
                  </button>
                )}
              </div>

              {isGenerating && generationProgress && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex justify-between text-xs font-medium text-indigo-800 mb-2">
                    <span>Chapter {generationProgress.currentSection} of {generationProgress.totalSections}</span>
                    <span>{Math.round((generationProgress.currentSection / generationProgress.totalSections) * 100)}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${(generationProgress.currentSection / generationProgress.totalSections) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-indigo-700 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {generationProgress.statusText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="font-semibold text-stone-800 mb-4">Batch Generation</h2>
            
            {isBatchRunning ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Batch Progress</span>
                  <span className="text-sm text-stone-500">
                    {batchCompleted.length + batchFailed.length} / {batchCompleted.length + batchFailed.length + batchQueue.length}
                  </span>
                </div>
                
                <div className="w-full bg-stone-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((batchCompleted.length + batchFailed.length) / Math.max(1, batchCompleted.length + batchFailed.length + batchQueue.length)) * 100}%` 
                    }}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  {batchQueue.length > 0 && (
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Episode {batchQueue[0]}...</span>
                    </div>
                  )}
                  {batchCompleted.length > 0 && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{batchCompleted.length} completed</span>
                    </div>
                  )}
                  {batchFailed.length > 0 && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{batchFailed.length} failed</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsBatchRunning(false)}
                  className="w-full py-2 px-4 border border-red-200 text-red-700 rounded-md shadow-sm text-sm font-medium bg-red-50 hover:bg-red-100"
                >
                  Stop Batch Run
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-stone-500 mb-4">Queue multiple episodes to generate sequentially.</p>
                <button 
                  onClick={() => {
                    setBatchSelection(episodeOutlines.map(o => o.chapterNumber));
                    setIsBatchModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 border border-stone-300 rounded-md shadow-sm text-sm font-medium text-stone-700 bg-white hover:bg-stone-50"
                >
                  Configure Batch Run
                </button>
                
                {(batchCompleted.length > 0 || batchFailed.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-sm">
                    <p className="font-medium text-stone-700">Previous Run:</p>
                    {batchCompleted.length > 0 && (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{batchCompleted.length} completed</span>
                      </div>
                    )}
                    {batchFailed.length > 0 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{batchFailed.length} failed</span>
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setBatchCompleted([]);
                        setBatchFailed([]);
                      }}
                      className="text-stone-500 hover:text-stone-700 text-xs underline"
                    >
                      Clear History
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {isGenerating && (
            <GenerationChecklist currentStep={generationProgress?.currentStep} />
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedOutline ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
                <h2 className="font-semibold text-stone-800">Episode Preview</h2>
                <div className="flex items-center gap-2">
                  {selectedChapter?.status === 'complete' && <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Complete</span>}
                  {selectedChapter?.status === 'generating' && <span className="flex items-center gap-1 text-blue-600 text-sm font-medium"><Loader2 className="w-4 h-4 animate-spin" /> Generating</span>}
                  {selectedChapter?.status === 'pending' && <span className="flex items-center gap-1 text-stone-500 text-sm font-medium"><Clock className="w-4 h-4" /> Pending</span>}
                  {selectedChapter?.status === 'failed' && <span className="flex items-center gap-1 text-red-600 text-sm font-medium"><AlertCircle className="w-4 h-4" /> Failed</span>}
                  {!selectedChapter && <span className="flex items-center gap-1 text-stone-400 text-sm font-medium"><Clock className="w-4 h-4" /> Not in library</span>}
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">{selectedOutline.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">{selectedOutline.cefrLevel}</span>
                    <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-800 text-xs font-medium">{selectedOutline.grammarFocus}</span>
                  </div>
                </div>

                {selectedChapter && (selectedChapter.status === 'complete' || selectedChapter.status === 'final' || (selectedChapter.status === 'generating' && selectedChapter.storyText)) ? (
                  <div className="prose prose-stone max-w-none">
                    <div className="markdown-body">
                      <Markdown remarkPlugins={[remarkGfm]}>{selectedChapter.storyText}</Markdown>
                    </div>
                    {selectedChapter.status === 'generating' && (
                      <div className="mt-4 flex items-center gap-2 text-stone-400 italic">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Writing next chapter...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                    {selectedChapter?.status === 'generating' && isGenerating ? (
                      <>
                        <Loader2 className="w-12 h-12 mb-4 opacity-20 animate-spin" />
                        <p>Generating content...</p>
                        <p className="text-sm mt-2">This may take a few minutes.</p>
                      </>
                    ) : selectedChapter?.status === 'generating' && !isGenerating ? (
                      <>
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20 text-amber-500" />
                        <p>Generation was interrupted.</p>
                        <p className="text-sm mt-2">Click "Generate Episode" to restart.</p>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                        <p>Content not generated yet.</p>
                        <p className="text-sm mt-2">Click "Generate Episode" to begin.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-xl border border-stone-200 border-dashed flex flex-col items-center justify-center h-full min-h-[400px]">
              <BookOpen className="w-12 h-12 mb-4 text-stone-300" />
              <p className="text-stone-500">{episodeOutlines.length === 0 ? 'Sign in to view and generate episodes' : 'Select an episode to generate'}</p>
            </div>
          )}
        </div>
      </div>

      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
              <h3 className="font-semibold text-stone-800">Configure Batch Run</h3>
              <button 
                onClick={() => setIsBatchModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-stone-600 mb-4">
                Select the episodes you want to generate. They will be processed sequentially.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="text-sm font-medium text-stone-700">Select All</span>
                  <input 
                    type="checkbox" 
                    checked={batchSelection.length === episodeOutlines.length && episodeOutlines.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBatchSelection(episodeOutlines.map(o => o.chapterNumber));
                      } else {
                        setBatchSelection([]);
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
                  />
                </div>
                
                {episodeOutlines.map((outline) => {
                  const chapter = chapters.find(c => c.chapterNumber === outline.chapterNumber);
                  const isCompleted = chapter?.status === 'complete';
                  
                  return (
                    <label 
                      key={outline.chapterNumber} 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        batchSelection.includes(outline.chapterNumber) 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={batchSelection.includes(outline.chapterNumber)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBatchSelection([...batchSelection, outline.chapterNumber].sort((a, b) => a - b));
                          } else {
                            setBatchSelection(batchSelection.filter(n => n !== outline.chapterNumber));
                          }
                        }}
                        className="mt-1 w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-stone-800 text-sm">Episode {outline.chapterNumber}</span>
                          {isCompleted && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1">{outline.title}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800"
              >
                Cancel
              </button>
              <button 
                disabled={batchSelection.length === 0}
                onClick={() => {
                  setBatchQueue(batchSelection);
                  setBatchCompleted([]);
                  setBatchFailed([]);
                  setIsBatchRunning(true);
                  setIsBatchModalOpen(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Batch ({batchSelection.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
