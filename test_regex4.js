const storyText1 = `# Un nuovo vicino? / A new neighbor?

**CEFR Level Target:** A1

**Grammar/Vocabulary focus:** 1.1 Vocabulary: Greetings & Introductions
**Examples:** ciao, buongiorno, buonasera, arrivederci, mi chiamo, io sono, lui e, lei e, piacere, scusa, scusi, puoi ripetere, non ho capito
**Description:** Matteo helps a young student named Luca navigate the busy streets of Rome to find his new home. As Luca struggles with the complex doorbell systems and the rapid pace of the Rinaldi family, he wonders if he will ever truly feel like a local. Will Luca successfully navigate the confusing neighborhood and meet his new neighbors?

## Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

const storyText2 = `**Examples:** ciao, buongiorno, buonasera, arrivederci, mi chiamo, io sono, lui e, lei e, piacere, scusa, scusi, puoi ripetere, non ho capito
**Description:** Matteo helps a young student named Luca navigate the busy streets of Rome to find his new home. As Luca struggles with the complex doorbell systems and the rapid pace of the Rinaldi family, he wonders if he will ever truly feel like a local. Will Luca successfully navigate the confusing neighborhood and meet his new neighbors?

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

  // Try to extract episode title from the first line if it's a single # header (and not the chapter header)
  let episodeTitle = chapter.title;
  const firstLineMatch = storyText.trim().match(/^#\s+(.*?)(?:\n|$)/);
  if (firstLineMatch && (!chapterTitleMatch || firstLineMatch[0] !== chapterTitleMatch[0])) {
    episodeTitle = firstLineMatch[1].trim();
  }

  return `The following story focuses on ${cleanGrammarFocus}.

# ${episodeTitle}

${description}

## ${chapterTitle}

${storyContent}`;
}

console.log("=== TEXT 1 ===");
console.log(getAudioVersionText({title: 'Un nuovo vicino?', chapterNumber: 1, grammarFocus: '1.1 Vocabulary: Greetings & Introductions'}, storyText1));

console.log("=== TEXT 2 ===");
console.log(getAudioVersionText({title: 'Un nuovo vicino?', chapterNumber: 1, grammarFocus: '1.1 Vocabulary: Greetings & Introductions'}, storyText2));
