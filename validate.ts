import fs from 'fs';
import { initialEpisodeOutlines } from './src/data/episodeOutlines';

let errors = [];

initialEpisodeOutlines.forEach(outline => {
  if (outline.chapterNumber !== undefined && typeof outline.chapterNumber !== 'number') errors.push('chapterNumber not number');
  if (outline.title !== undefined && typeof outline.title !== 'string') errors.push('title not string');
  if (outline.cefrLevel !== undefined && typeof outline.cefrLevel !== 'string') errors.push('cefrLevel not string');
  if (outline.grammarFocus !== undefined && typeof outline.grammarFocus !== 'string') errors.push('grammarFocus not string');
  if (outline.coreLanguageTarget !== undefined && !Array.isArray(outline.coreLanguageTarget)) errors.push('core not array');
});

console.log(errors.length === 0 ? "No violations found" : errors);
