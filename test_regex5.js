const storyText3 = `# Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

const storyText4 = `
# Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

function getAudioVersionText(chapter, storyText) {
  const chapterTitleMatch = storyText.match(/#{1,2}\s*(Chapter\s+\d+)(?:\s*[:\-]\s*|\s+)(.*?)(?:\n|$)/i);
  
  let storyContent = storyText;
  let chapterTitle = `Chapter ${chapter.chapterNumber}`;
  
  if (chapterTitleMatch) {
    const chapterPrefix = chapterTitleMatch[1];
    const storyTitle = chapterTitleMatch[2];
    chapterTitle = `${chapterPrefix} - ${storyTitle}`;
    const splitIndex = storyText.indexOf(chapterTitleMatch[0]) + chapterTitleMatch[0].length;
    storyContent = storyText.substring(splitIndex).trim();
  } else {
    storyContent = storyText.replace(/\*\*Examples:\*\*.*?\n+/i, '').replace(/\*\*Description:\*\*.*?\n+/i, '').trim();
  }

  const descriptionMatch = storyText.match(/\*\*Description:\*\*\s*(.*?)(?:\n\n|\n#|$)/is);
  const description = descriptionMatch ? descriptionMatch[1].trim() : (chapter.logline || '');

  const cleanGrammarFocus = chapter.grammarFocus.replace(/^\d+\.\d+\s*-\s*/, '').replace(/^\d+\.\d+\s*/, '').toLowerCase();

  let episodeTitle = chapter.title;
  const firstLineMatch = storyText.trim().match(/^#\s+(.*?)(?:\n|$)/);
  if (firstLineMatch && (!chapterTitleMatch || firstLineMatch[0].trim() !== chapterTitleMatch[0].trim())) {
    episodeTitle = firstLineMatch[1].trim();
  }

  return `The following story focuses on ${cleanGrammarFocus}.

# ${episodeTitle}

${description}

## ${chapterTitle}

${storyContent}`;
}

console.log("=== TEXT 3 ===");
console.log(getAudioVersionText({title: 'Un nuovo vicino?', chapterNumber: 1, grammarFocus: '1.1 Vocabulary: Greetings & Introductions'}, storyText3));

console.log("=== TEXT 4 ===");
console.log(getAudioVersionText({title: 'Un nuovo vicino?', chapterNumber: 1, grammarFocus: '1.1 Vocabulary: Greetings & Introductions'}, storyText4));
