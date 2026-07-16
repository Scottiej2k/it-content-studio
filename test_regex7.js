const storyTextOld = `# Un nuovo vicino? / A new neighbor?

**CEFR Level Target:** A1

**Grammar/Vocabulary focus:** 1.1 Vocabulary: Greetings & Introductions
**Examples:** ciao, buongiorno, buonasera, arrivederci, mi chiamo, io sono, lui e, lei e, piacere, scusa, scusi, puoi ripetere, non ho capito
**Description:** Matteo helps a young student named Luca navigate the busy streets of Rome to find his new home. As Luca struggles with the complex doorbell systems and the rapid pace of the Rinaldi family, he wonders if he will ever truly feel like a local. Will Luca successfully navigate the confusing neighborhood and meet his new neighbors?

## Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

const storyTextNew = `# Vocabulary: Greetings & Introductions

**CEFR Level Target:** A1

**Grammar/Vocabulary focus:** 1.1 Vocabulary: Greetings & Introductions
**Examples:** ciao, buongiorno, buonasera, arrivederci, mi chiamo, io sono, lui e, lei e, piacere, scusa, scusi, puoi ripetere, non ho capito
**Title:** Un nuovo vicino? / A new neighbor?
**Description:** Matteo helps a young student named Luca navigate the busy streets of Rome to find his new home. As Luca struggles with the complex doorbell systems and the rapid pace of the Rinaldi family, he wonders if he will ever truly feel like a local. Will Luca successfully navigate the confusing neighborhood and meet his new neighbors?

## Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

function extractTitle(storyText, chapterTitleMatch) {
  let episodeTitle = "Fallback Title";
  const titleMatch = storyText.match(/\*\*Title:\*\*\s*(.*?)(?:\n|$)/i);
  if (titleMatch) {
    episodeTitle = titleMatch[1].trim();
  } else {
    const firstLineMatch = storyText.trim().match(/^#\s+(.*?)(?:\n|$)/);
    if (firstLineMatch && (!chapterTitleMatch || firstLineMatch[0].trim() !== chapterTitleMatch[0].trim())) {
      episodeTitle = firstLineMatch[1].trim();
    }
  }
  return episodeTitle;
}

const chapterTitleMatch = storyTextOld.match(/#{1,2}\s*(Chapter\s+\d+)(?:\s*[:\-]\s*|\s+)(.*?)(?:\n|$)/i);
console.log("Old:", extractTitle(storyTextOld, chapterTitleMatch));
console.log("New:", extractTitle(storyTextNew, chapterTitleMatch));
