import { toCanvas as toHtmlCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRANDING_IMAGE } from '../assets/branding';

// Helper canvas and cache for oklch color conversion
const colorCache = new Map<string, string>();
let conversionCanvas: HTMLCanvasElement | null = null;
let conversionCtx: CanvasRenderingContext2D | null = null;

function convertSingleColorToRgb(colorStr: string): string {
  const cached = colorCache.get(colorStr);
  if (cached) return cached;

  if (typeof document === 'undefined') return colorStr;

  if (!conversionCanvas) {
    try {
      conversionCanvas = document.createElement('canvas');
      conversionCanvas.width = 1;
      conversionCanvas.height = 1;
      conversionCtx = conversionCanvas.getContext('2d', { willReadFrequently: true });
    } catch (e) {
      console.error('Failed to create canvas for color conversion:', e);
    }
  }

  if (!conversionCtx) return colorStr;

  try {
    conversionCtx.clearRect(0, 0, 1, 1);
    conversionCtx.fillStyle = colorStr;
    conversionCtx.fillRect(0, 0, 1, 1);
    const data = conversionCtx.getImageData(0, 0, 1, 1).data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = (data[3] / 255).toFixed(3);
    const rgbStr = `rgba(${r}, ${g}, ${b}, ${a})`;
    colorCache.set(colorStr, rgbStr);
    return rgbStr;
  } catch (e) {
    return colorStr;
  }
}

function replaceColorFunctions(str: string): string {
  if (!str) return str;
  
  let result = '';
  let i = 0;
  
  while (i < str.length) {
    const remaining = str.slice(i);
    const oklchMatch = remaining.match(/^(oklch|color-mix)\(/);
    
    if (oklchMatch) {
      const funcName = oklchMatch[1];
      const startIdx = i;
      i += funcName.length + 1; // skip function name and '('
      
      let parenCount = 1;
      while (i < str.length && parenCount > 0) {
        if (str[i] === '(') {
          parenCount++;
        } else if (str[i] === ')') {
          parenCount--;
        }
        i++;
      }
      
      const fullFunc = str.slice(startIdx, i);
      const processedFunc = replaceColorFunctions(fullFunc.slice(funcName.length + 1, -1));
      const resolvedColor = convertSingleColorToRgb(`${funcName}(${processedFunc})`);
      result += resolvedColor;
    } else {
      result += str[i];
      i++;
    }
  }
  
  return result;
}

export function convertColorToRgb(colorStr: string): string {
  if (!colorStr) return colorStr;
  if (!colorStr.includes('oklch') && !colorStr.includes('color-mix')) {
    return colorStr;
  }
  return replaceColorFunctions(colorStr);
}

// Install monkeypatch on window.getComputedStyle to support oklch colors in html2canvas
if (typeof window !== 'undefined') {
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function(elt, pseudoElt) {
    const style = originalGetComputedStyle(elt, pseudoElt);
    return new Proxy(style, {
      get(target, prop) {
        const val = Reflect.get(target, prop);
        if (typeof val === 'string' && (val.includes('oklch') || val.includes('color-mix'))) {
          return convertColorToRgb(val);
        }
        if (typeof val === 'function') {
          if (prop === 'getPropertyValue') {
            return function(propertyName: string) {
              const originalVal = target.getPropertyValue(propertyName);
              if (typeof originalVal === 'string' && (originalVal.includes('oklch') || originalVal.includes('color-mix'))) {
                return convertColorToRgb(originalVal);
              }
              return originalVal;
            };
          }
          return val.bind(target);
        }
        return val;
      }
    }) as any;
  };
}

interface ExportOptions {
  margin?: number;
  filename?: string;
  scale?: number;
  type?: 'markdown' | 'wordbank' | 'sidebyside';
}

/**
 * Helper to ensure the branding image is loaded as a canvas for reliable PDF inclusion
 */
let cachedBrandingCanvas: HTMLCanvasElement | null = null;

async function getBrandingCanvas(): Promise<HTMLCanvasElement> {
  if (cachedBrandingCanvas) return cachedBrandingCanvas;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      cachedBrandingCanvas = canvas;
      resolve(canvas);
    };
    img.onerror = () => reject(new Error('Failed to load branding image asset'));
    img.src = BRANDING_IMAGE;
  });
}

/**
 * Adds a full-page branding image to the PDF
 */
async function addBrandingPage(pdf: jsPDF) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Create a new page
  pdf.addPage();
  
  // Add the branding image centered
  const imgWidth = 6; // 6 inches wide
  const imgHeight = 6; 
  const x = (pdfWidth - imgWidth) / 2;
  const y = (pdfHeight - imgHeight) / 2;
  
  try {
    const canvas = await getBrandingCanvas();
    pdf.addImage(canvas, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
  } catch (e) {
    console.error("Could not add branding image to PDF:", e);
  }
}

/**
 * Robust PDF export using a block-by-block approach to prevent text slicing.
 * Uses canvas capture with micro-delays to ensure full rendering.
 */
export async function exportToPdf(element: HTMLElement, options: ExportOptions = {}) {
  const {
    margin = 0.5,
    filename = 'document.pdf',
    type = 'markdown'
  } = options;

    try {
    // We use AutoTable for Word Bank for perfect vectors.
    if (type === 'wordbank') {
      const title = element.querySelector('h2')?.textContent || 'Word Bank';
      const tables = Array.from(element.querySelectorAll('table'));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      });

      // Front Branding
      await addBrandingPage(pdf);

      // Add a new page for the content
      pdf.addPage();

      pdf.setFontSize(18);
      pdf.setTextColor(40);
      pdf.text(title, margin, margin + 0.3);

      let lastY = margin + 0.6;

      for (const table of tables) {
        autoTable(pdf, {
          html: table as HTMLTableElement,
          startY: lastY,
          margin: { top: margin, bottom: margin, left: margin, right: margin },
          styles: {
            fontSize: 10,
            cellPadding: 0.12,
            lineColor: [231, 229, 228],
            lineWidth: 0.01,
            font: 'helvetica',
          },
          headStyles: {
            fillColor: [245, 245, 244],
            textColor: [87, 83, 78],
            fontSize: 9,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [250, 250, 249],
          },
          columnStyles: {
            0: { fontStyle: 'bold', textColor: [49, 46, 129] },
          }
        });
        lastY = (pdf as any).lastAutoTable.finalY + 0.4;
      }

      // Back Branding
      await addBrandingPage(pdf);

      // Let's rearrange pages so the first branding page is Actually the first page.
      // addBrandingPage() does `pdf.addPage()`. 
      // The `insertPage(1)` method can move the currently added branding page if we had tracked it, but AutoTable is easier:
      // Wait, no need to rearrange if we added the branding page, then added a new page, then drew the table.
      // AutoTable just continues adding pages starting from the current page. Let's make sure the order is correct.
      // The order IS correct: addBrandingPage (creates page 1), then pdf.addPage() (creates page 2). Content goes on page 2. Then addBrandingPage (creates page N+1).
      
      // Wait, there is a bug: when jsPDF is created, it comes with an empty page 1 by default.
      // So new jsPDF -> page 1. addBrandingPage() adds a NEW page (page 2), draws on page 2.
      // So page 1 is blank. Let's fix that.
      pdf.deletePage(1); 
      
      return pdf;
    }

    // --- HTML2PDF Branch for standard Markdown ---
    // Make sure html2pdf is dynamically imported or statically imported
    const html2pdf = (await import('html2pdf.js')).default;
    
    const isLandscape = type === 'sidebyside';

    // We clone the element so we can adjust styles precisely for the PDF without affecting UI
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.padding = '0';
    clonedElement.style.margin = '0';
    
    const targetWidth = isLandscape ? 1100 : 800;
    clonedElement.style.width = `${targetWidth}px`;
    clonedElement.style.maxWidth = `${targetWidth}px`;
    clonedElement.style.boxSizing = 'border-box';

    // Ensure all tables inside the cloned element are perfectly fitted and wrapped
    const tables = clonedElement.querySelectorAll('table');
    tables.forEach(table => {
      (table as HTMLElement).style.width = '100%';
      (table as HTMLElement).style.tableLayout = 'fixed';
      (table as HTMLElement).style.wordBreak = 'break-word';
      (table as HTMLElement).style.overflowWrap = 'break-word';
      
      const ths = table.querySelectorAll('th');
      if (ths.length > 0) {
        const colWidth = `${100 / ths.length}%`;
        ths.forEach(th => {
          (th as HTMLElement).style.width = colWidth;
          (th as HTMLElement).style.wordBreak = 'break-word';
          (th as HTMLElement).style.overflowWrap = 'break-word';
        });
      }
      
      const tds = table.querySelectorAll('td');
      tds.forEach(td => {
        (td as HTMLElement).style.wordBreak = 'break-word';
        (td as HTMLElement).style.overflowWrap = 'break-word';
        (td as HTMLElement).style.whiteSpace = 'normal';
      });
    });

    // Ensure all pre/code blocks wrap nicely instead of overflowing
    const preBlocks = clonedElement.querySelectorAll('pre, code');
    preBlocks.forEach(block => {
      (block as HTMLElement).style.whiteSpace = 'pre-wrap';
      (block as HTMLElement).style.wordBreak = 'break-all';
    });

    // Calculate scale safely to keep the resolution high (up to 2.5) while staying within browser canvas limits.
    let scale = 2.0;
    try {
      const elementHeight = element.offsetHeight || element.clientHeight || 1200;
      // Modern browsers have a maximum canvas height limit of 16384px (let's use 14000px to be safe)
      // and a maximum canvas area limit of around 16M pixels (let's use 10,000,000 to be perfectly safe).
      const maxCanvasHeight = 14000;
      const maxCanvasArea = 10000000;
      
      const maxScaleHeight = maxCanvasHeight / elementHeight;
      const maxScaleArea = Math.sqrt(maxCanvasArea / (targetWidth * elementHeight));
      
      const calculatedScale = Math.min(2.5, maxScaleHeight, maxScaleArea);
      // We allow scaling down to 1.2 to guarantee baseline crispness
      scale = Math.max(1.2, calculatedScale);
    } catch (e) {
      scale = 2.0;
    }

    const opt = {
      margin: margin,
      filename: filename,
      image: { type: 'png' as const },
      html2canvas: { 
        scale: scale, 
        useCORS: true,
        letterRendering: true,
        width: targetWidth,
        windowWidth: targetWidth,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: 'in' as const, format: 'letter', orientation: isLandscape ? ('landscape' as const) : ('portrait' as const) },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Apply specific CSS to help with page breaks
    const style = document.createElement('style');
    style.innerHTML = `
      * { break-inside: avoid; }
      div, p, h1, h2, h3, h4, h5, h6 { break-inside: avoid; }
      table { break-inside: avoid; }
    `;
    clonedElement.appendChild(style);

    const worker = html2pdf().set(opt).from(clonedElement);
    const pdf = await worker.toPdf().get('pdf');

    // Currently `pdf` contains all the HTML pages.
    // We want to PREPEND a branding page and APPEND a branding page.
    
    // Create a temporary PDF to get the branding canvas with identical orientation
    const tempPdf = new jsPDF({ unit: 'in', format: 'letter', orientation: (isLandscape ? 'landscape' : 'portrait') as any });
    const imgWidth = 6;
    const imgHeight = 6;
    const imgX = (tempPdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const imgY = (tempPdf.internal.pageSize.getHeight() - imgHeight) / 2;
    const canvas = await getBrandingCanvas();

    // Insert front page
    pdf.insertPage(1);
    pdf.setPage(1);
    pdf.addImage(canvas, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

    // Append back page
    const totalPages = pdf.internal.getNumberOfPages();
    pdf.addPage();
    pdf.setPage(totalPages + 1);
    pdf.addImage(canvas, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

    return pdf;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}


