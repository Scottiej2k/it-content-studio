const storyText = "# Chapter 1: The First Step / Il primo passo\n\nIl sole di Roma...";
const match = storyText.match(/#\s*(Chapter\s+\d+)(?:\s*[:\-]\s*|\s+)(.*?)(?:\n|$)/i);
console.log(match);
