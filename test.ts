const text = "È una mattina grigia a Torino. La nebbia copre i viali di Crocetta e nasconde le cime delle Alpi. In via Monferrato 14, **l'**edificio sembra addormentato, ma dentro **l'**androne c'è già molta attività. Il signor Roberto Ferrero è davanti a **l'**ascensore. Lo sguardo di Roberto è serio. **L'**ascensore, un oggetto di ferro degli anni sessanta, ha un problema. La porta rimane aperta tra il primo piano e il secondo piano. È bloccata. Roberto sospira. Lui conosce ogni pezzo di metallo in questo palazzo. Lui è ingegnere.";

const cleanMarkdownBolding = (text) => {
  let cleaned = text;
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

console.log(cleanMarkdownBolding(text));
