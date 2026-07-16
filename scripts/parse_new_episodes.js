import fs from 'fs';
import path from 'path';

function parseText(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Split by EPISODE
  const parts = content.split('EPISODE ').map(s => s.trim()).filter(Boolean);
  
  const episodes = [];
  
  for (const part of parts) {
    const lines = part.split('\n').map(l => l.trim()).filter(Boolean);
    const chapterNumberStr = lines[0];
    const chapterNumber = parseFloat(chapterNumberStr);
    
    let titleStr = lines[1];
    if (titleStr.startsWith('“') || titleStr.startsWith('"')) {
      titleStr = titleStr.replace(/^["“](.*)["”]$/, '$1');
    }
    
    const epObj = {
      chapterNumber,
      title: titleStr,
      cefrLevel: "",
      grammarFocus: "",
      episodeJob: "",
      logline: "",
      aStory: "",
      bStory: "",
      cStory: "",
      coreLanguageTarget: [],
      storyBeats: [],
      emotionalMovement: "",
      writerNotes: []
    };

    let currentSection = "";
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("Grammar Focus:")) {
        epObj.grammarFocus = line.replace("Grammar Focus:", "").trim();
      } else if (line.startsWith("CEFR:")) {
        epObj.cefrLevel = line.replace("CEFR:", "").trim();
      } else if (line.match(/^Episode job/i)) {
        currentSection = "episodeJob";
      } else if (line.match(/^Logline/i)) {
        currentSection = "logline";
      } else if (line.match(/^A-Story/i)) {
        currentSection = "aStory";
      } else if (line.match(/^B-Story/i)) {
        currentSection = "bStory";
      } else if (line.match(/^C-Story/i)) {
        currentSection = "cStory";
      } else if (line.match(/^Core language target/i)) {
        currentSection = "coreLanguageTarget";
      } else if (line.match(/^Story beats/i)) {
        currentSection = "storyBeats";
      } else if (line.match(/^Emotional movement/i)) {
        currentSection = "emotionalMovement";
      } else if (line.match(/^Writer notes/i)) {
        currentSection = "writerNotes";
      } else {
        if (currentSection === 'episodeJob') epObj.episodeJob += (epObj.episodeJob ? " " : "") + line;
        if (currentSection === 'logline') epObj.logline += (epObj.logline ? " " : "") + line;
        if (currentSection === 'aStory') epObj.aStory += (epObj.aStory ? " " : "") + line;
        if (currentSection === 'bStory') epObj.bStory += (epObj.bStory ? " " : "") + line;
        if (currentSection === 'cStory') epObj.cStory += (epObj.cStory ? " " : "") + line;
        if (currentSection === 'emotionalMovement') epObj.emotionalMovement += (epObj.emotionalMovement ? " " : "") + line;
        
        if (currentSection === 'coreLanguageTarget' && line.startsWith('●')) {
          epObj.coreLanguageTarget.push(line.replace('●', '').trim());
        }
        if (currentSection === 'storyBeats' && line.startsWith('●')) {
          epObj.storyBeats.push(line.replace('●', '').trim());
        }
        if (currentSection === 'writerNotes' && line.startsWith('●')) {
          epObj.writerNotes.push(line.replace('●', '').trim());
        }
      }
    }
    episodes.push(epObj);
  }
  return episodes;
}

const eps1 = parseText(path.join(process.cwd(), 'scripts', 'data_113_145.txt'));
const eps2 = parseText(path.join(process.cwd(), 'scripts', 'data_146_177.txt'));
const allEps = [...eps1, ...eps2];

// Update the episodeOutlines file
const outlineFile = path.join(process.cwd(), 'src/data/episodeOutlines.ts');
let outlineContent = fs.readFileSync(outlineFile, 'utf-8');

// Find the last closing bracket of the initialEpisodeOutlines array
const arrayEndIndex = outlineContent.lastIndexOf('];');

// Create the new string to append
let newOutput = "";
for (const ep of allEps) {
  newOutput += `  ,\n  ${JSON.stringify(ep, null, 2)}`;
}

const updatedContent = outlineContent.substring(0, arrayEndIndex) + newOutput + "\n" + outlineContent.substring(arrayEndIndex);

fs.writeFileSync(outlineFile, updatedContent);
console.log('Successfully added ' + allEps.length + ' episodes.');
