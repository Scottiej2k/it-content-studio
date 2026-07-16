import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../raw_data_1.txt'), 'utf-8');

const episodes = rawData.split('--------------------------------------------------').map(s => s.trim()).filter(Boolean);

const parsedOutlines = episodes.map(ep => {
  const lines = ep.split('\n');
  const obj: any = {};
  
  lines.forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      if (value.startsWith("['") && value.endsWith("']")) {
        // Parse array
        try {
          // Replace single quotes with double quotes for JSON.parse, but be careful with apostrophes
          const jsonStr = value.replace(/'/g, '"').replace(/""/g, "'"); // basic attempt, might need better parsing
          // Actually, let's just use eval for this specific trusted script
          value = eval(value);
        } catch (e) {
          console.error("Error parsing array:", value);
        }
      }
      obj[key] = value;
    }
  });
  
  return obj;
});

// Sort by episode_id (e.g., E1, E1.1, E1.2)
parsedOutlines.sort((a, b) => {
  const aParts = a.episode_id.replace('E', '').split('.').map(Number);
  const bParts = b.episode_id.replace('E', '').split('.').map(Number);
  
  if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
  
  const aSub = aParts.length > 1 ? aParts[1] : 0;
  const bSub = bParts.length > 1 ? bParts[1] : 0;
  
  return aSub - bSub;
});

// Format for episodeOutlines.ts
let output = `export const initialEpisodeOutlines = [\n`;

parsedOutlines.forEach((outline, index) => {
  // Extract chapter number (e.g., E1.2 -> 1.2, E1 -> 1)
  const chapterNumberStr = outline.episode_id.replace('E', '');
  const chapterNumber = parseFloat(chapterNumberStr);
  
  output += `  {\n`;
  output += `    chapterNumber: ${chapterNumber},\n`;
  output += `    title: ${JSON.stringify(outline.title)},\n`;
  output += `    cefrLevel: ${JSON.stringify(outline.cefr)},\n`;
  output += `    grammarFocus: ${JSON.stringify(`${outline.grammar_level} — ${outline.grammar_topic}`)},\n`;
  output += `    vocabularyTheme: ${JSON.stringify(outline.vocab_focus)},\n`;
  output += `    setting: ${JSON.stringify(outline.setting)},\n`;
  
  // Format featured characters
  let chars = outline.featured_characters;
  if (typeof chars === 'string') {
     try { chars = eval(chars); } catch(e) {}
  }
  output += `    featuredCharacters: ${JSON.stringify(chars)},\n`;
  
  output += `    conflict: ${JSON.stringify(outline.conflict)},\n`;
  output += `    resolution: ${JSON.stringify(outline.resolution)}\n`;
  output += `  }${index < parsedOutlines.length - 1 ? ',' : ''}\n`;
});

output += `];\n`;

fs.writeFileSync(path.join(__dirname, '../src/data/episodeOutlines.ts'), output);
console.log('Successfully updated src/data/episodeOutlines.ts');
