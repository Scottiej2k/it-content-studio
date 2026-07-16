const storyText = `# Un nuovo vicino? / A new neighbor?

**CEFR Level Target:** A1

**Grammar/Vocabulary focus:** 1.1 Vocabulary: Greetings & Introductions
**Examples:** ciao, buongiorno, buonasera, arrivederci, mi chiamo, io sono, lui e, lei e, piacere, scusa, scusi, puoi ripetere, non ho capito
**Description:** Matteo helps a young student named Luca navigate the busy streets of Rome to find his new home. As Luca struggles with the complex doorbell systems and the rapid pace of the Rinaldi family, he wonders if he will ever truly feel like a local. Will Luca successfully navigate the confusing neighborhood and meet his new neighbors?

## Chapter 1: The First Step / Il primo passo

Il sole di Roma...`;

const episodeTitleMatch = storyText.match(/^#\s+(.*?)(?:\n|$)/);
console.log(episodeTitleMatch ? episodeTitleMatch[1] : 'Not found');

const chapterTitleMatch = storyText.match(/##\s*(Chapter\s+\d+)(?:\s*[:\-]\s*|\s+)(.*?)(?:\n|$)/i);
console.log(chapterTitleMatch ? chapterTitleMatch : 'Not found');
