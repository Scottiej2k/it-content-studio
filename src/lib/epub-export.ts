import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Chapter } from '../store/useStore';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const exportToEpub = async (chapter: Chapter, content: string, shouldSave = true) => {
  const zip = new JSZip();
  
  // Basic EPUB structure
  const mimetype = "application/epub+zip";
  zip.file("mimetype", mimetype, { compression: "STORE" });
  
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`;
  zip.folder("META-INF")!.file("container.xml", containerXml);
  
  const title = `Chapter ${chapter.chapterNumber}: ${chapter.cefrLevel} - ${chapter.grammarFocus}`;
  const epubTitle = `Episode ${chapter.chapterNumber}`;
  const epubSubtitle = chapter.grammarFocus;

  const opfContent = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="pub-id">urn:uuid:${chapter.id}</dc:identifier>
        <dc:title>${epubTitle.replace(/&/g, '&amp;')} - ${epubSubtitle.replace(/&/g, '&amp;')}</dc:title>
        <dc:creator>inputmasters.com</dc:creator>
        <dc:language>it</dc:language>
    </metadata>
    <manifest>
        <item id="titlepage" href="titlepage.xhtml" media-type="application/xhtml+xml"/>
        <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
        <item id="toc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    </manifest>
    <spine toc="toc">
        <itemref idref="titlepage"/>
        <itemref idref="chapter"/>
    </spine>
</package>`;

  const titlePageHtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>${epubTitle.replace(/&/g, '&amp;')} - ${epubSubtitle.replace(/&/g, '&amp;')}</title>
    <style>
        body {
            margin: 0;
            padding: 15% 10% 10% 10%;
            background-color: #1a1a1a;
            color: #ffffff;
            font-family: Georgia, "Times New Roman", Times, serif;
            text-align: left;
        }
        .container {
            max-width: 600px;
            margin: 0;
        }
        h1 {
            font-size: 3.5em;
            font-weight: bold;
            color: #ffffff;
            margin: 0 0 1.2em 0;
            line-height: 1.2;
        }
        h2 {
            font-size: 1.8em;
            font-weight: normal;
            color: #dddddd;
            margin: 0 0 4em 0;
            line-height: 1.4;
        }
        .brand {
            font-size: 1.1em;
            color: #888888;
            margin-top: 6em;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${epubTitle.replace(/&/g, '&amp;')}</h1>
        <h2>${epubSubtitle.replace(/&/g, '&amp;')}</h2>
        <div class="brand">inputmasters.com</div>
    </div>
</body>
</html>`;

  // Convert markdown to XHTML using react-dom/server and sanitize entities
  const renderedContent = renderToString(React.createElement(Markdown, { remarkPlugins: [remarkGfm] }, content));
  // Replace HTML entities that might cause issues and ensure proper quote escaping
  const cleanContent = renderedContent
    .replace(/&#x27;/g, '&apos;')
    .replace(/&#39;/g, '&apos;')
    .replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');

  const xhtmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>${title.replace(/&/g, '&amp;')}</title>
    <style>
        table { border-collapse: separate; border-spacing: 40px 0; }
        td { vertical-align: top; }
        strong { font-weight: bold; }
        .instructions { font-style: italic; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>${title.replace(/&/g, '&amp;')}</h1>
    <p class="instructions">
        For the best reading experience, please use your device in horizontal (landscape) mode to view the bilingual text side-by-side. 
        You can adjust the font size in your EPUB reader settings if the text is too small or large.
    </p>
    ${cleanContent}
</body>
</html>`;

  zip.folder("OEBPS")!.file("content.opf", opfContent);
  zip.folder("OEBPS")!.file("titlepage.xhtml", titlePageHtml);
  zip.folder("OEBPS")!.file("chapter.xhtml", xhtmlContent);
  
  // Simple TOC
  const ncxContent = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head><meta name="dtb:uid" content="urn:uuid:${chapter.id}"/></head>
    <docTitle><text>${epubTitle.replace(/&/g, '&amp;')} - ${epubSubtitle.replace(/&/g, '&amp;')}</text></docTitle>
    <navMap>
        <navPoint id="titlepage" playOrder="1">
            <navLabel><text>Title Page</text></navLabel>
            <content src="titlepage.xhtml"/>
        </navPoint>
        <navPoint id="chapter" playOrder="2">
            <navLabel><text>${title.replace(/&/g, '&amp;')}</text></navLabel>
            <content src="chapter.xhtml"/>
        </navPoint>
    </navMap>
</ncx>`;
  zip.folder("OEBPS")!.file("toc.ncx", ncxContent);
  
  const blob = await zip.generateAsync({ type: "blob" });
  if (shouldSave) {
    const filename = `${chapter.chapterNumber}-${chapter.cefrLevel}-${chapter.grammarFocus.replace(/[^a-z0-9]/gi, '-')}`.substring(0, 100) + '.epub';
    saveAs(blob, filename);
  }
  return blob;
};
