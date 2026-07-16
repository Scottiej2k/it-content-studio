import React from 'react';
import { createRoot } from 'react-dom/client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const App = () => {
  const text = "È una mattina grigia a Torino. La nebbia copre i viali di Crocetta e nasconde le cime delle Alpi. In via Monferrato 14, **l'edificio** sembra addormentato, ma dentro **l'androne** c'è già molta attività. Il signor Roberto Ferrero è davanti a **l'ascensore**. Lo sguardo di Roberto è serio. **L'ascensore**, un oggetto di ferro degli anni sessanta, ha un problema. La porta rimane aperta tra il primo piano e il secondo piano. È bloccata. Roberto sospira. Lui conosce ogni pezzo di metallo in questo palazzo. Lui è ingegnere.";
  return <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>;
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
