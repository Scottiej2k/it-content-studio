const fs = require('fs');

const rawData = fs.readFileSync('/app/applet/raw_data_1.txt', 'utf8');
const episodes = rawData.split('--------------------------------------------------').map(s => s.trim()).filter(s => s.length > 0);

const newOutlines = [];

for (const ep of episodes) {
  const lines = ep.split('\n');
  const obj = {};
  let currentKey = '';
  let currentValue = '';

  for (const line of lines) {
    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (match) {
      if (currentKey) {
        obj[currentKey] = currentValue.trim();
      }
      currentKey = match[1];
      currentValue = match[2];
    } else {
      currentValue += '\n' + line;
    }
  }
  if (currentKey) {
    obj[currentKey] = currentValue.trim();
  }

  if (!obj.episode_id) continue;

  let chapterNumber = parseFloat(obj.grammar_level);
  if (isNaN(chapterNumber)) {
    chapterNumber = parseFloat(obj.episode_id.replace('E', ''));
  }

  let featuredCharacters = [];
  try {
    const jsonStr = obj.featured_characters.replace(/'/g, '"');
    featuredCharacters = JSON.parse(jsonStr);
  } catch (e) {
    featuredCharacters = [obj.featured_characters];
  }

  let seasonThreads = [];
  if (obj.season_threads) {
    try {
      const jsonStr = obj.season_threads.replace(/'/g, '"');
      seasonThreads = JSON.parse(jsonStr);
    } catch (e) {
      seasonThreads = [obj.season_threads];
    }
  }

  newOutlines.push({
    chapterNumber: chapterNumber,
    title: obj.title,
    cefrLevel: obj.cefr,
    grammarFocus: `${obj.grammar_level} — ${obj.grammar_topic}`,
    vocabularyTheme: obj.vocab_focus,
    setting: obj.setting,
    featuredCharacters: featuredCharacters,
    conflict: obj.conflict,
    resolution: obj.resolution,
    hook: obj.hook,
    grammarOpportunity: obj.grammar_opportunity,
    seasonThreads: seasonThreads,
    continuityNote: obj.continuity_note
  });
}

const existingFile = fs.readFileSync('/app/applet/src/data/episodeOutlines.ts', 'utf8');

const arrayStartMatch = existingFile.match(/export const initialEpisodeOutlines = \[\n/);
if (!arrayStartMatch) {
  console.error("Could not find array start");
  process.exit(1);
}

const startIndex = arrayStartMatch.index + arrayStartMatch[0].length;
const endIndex = existingFile.lastIndexOf('];');

const arrayContent = existingFile.substring(startIndex, endIndex);

let replaceEndIndex = -1;
const chapter6Match = arrayContent.match(/\{\s*chapterNumber:\s*6\.1,/);
if (chapter6Match) {
  replaceEndIndex = startIndex + chapter6Match.index;
} else {
  console.error("Could not find chapter 6.1");
  process.exit(1);
}

const prefix = existingFile.substring(0, startIndex);
const suffix = existingFile.substring(replaceEndIndex);

const newContentStr = newOutlines.map(o => {
  return `  {
    chapterNumber: ${o.chapterNumber},
    title: ${JSON.stringify(o.title)},
    cefrLevel: ${JSON.stringify(o.cefrLevel)},
    grammarFocus: ${JSON.stringify(o.grammarFocus)},
    vocabularyTheme: ${JSON.stringify(o.vocabularyTheme)},
    setting: ${JSON.stringify(o.setting)},
    featuredCharacters: ${JSON.stringify(o.featuredCharacters)},
    conflict: ${JSON.stringify(o.conflict)},
    resolution: ${JSON.stringify(o.resolution)},
    hook: ${JSON.stringify(o.hook)},
    grammarOpportunity: ${JSON.stringify(o.grammarOpportunity)},
    seasonThreads: ${JSON.stringify(o.seasonThreads)},
    continuityNote: ${JSON.stringify(o.continuityNote)}
  },
`;
}).join('');

const finalFile = prefix + newContentStr + suffix;

fs.writeFileSync('/app/applet/src/data/episodeOutlines.ts', finalFile);
console.log("Successfully updated /src/data/episodeOutlines.ts");
