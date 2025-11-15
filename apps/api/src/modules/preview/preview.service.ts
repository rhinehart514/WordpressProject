import { Injectable, Logger } from '@nestjs/common';

export interface BricksElement {
  id: string;
  name: string;
  settings?: {
    text?: string;
    tag?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    [key: string]: any;
  };
  children?: BricksElement[];
}

@Injectable()
export class PreviewService {
  private readonly logger = new Logger(PreviewService.name);

  /**
   * Convert Bricks JSON elements to HTML
   */
  generateHTML(elements: BricksElement[], pageTitle: string = 'Preview'): string {
    const bodyHTML = this.convertElementsToHTML(elements);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHTML(pageTitle)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section {
      padding: 60px 20px;
    }

    .hero {
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    .card {
      padding: 2rem;
      border-radius: 8px;
      background: #f9fafb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .card h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }

    .button:hover {
      background: #5568d3;
    }
  </style>
</head>
<body>
  ${bodyHTML}
</body>
</html>`;
  }

  /**
   * Convert Bricks elements array to HTML
   */
  private convertElementsToHTML(elements: BricksElement[]): string {
    return elements.map((element) => this.convertElementToHTML(element)).join('\n');
  }

  /**
   * Convert a single Bricks element to HTML
   */
  private convertElementToHTML(element: BricksElement): string {
    const settings = element.settings || {};
    const children = element.children || [];

    // Generate inline styles from settings
    const styles: string[] = [];
    if (settings.backgroundColor) styles.push(`background-color: ${settings.backgroundColor}`);
    if (settings.padding) styles.push(`padding: ${settings.padding}`);
    if (settings.margin) styles.push(`margin: ${settings.margin}`);
    if (settings.color) styles.push(`color: ${settings.color}`);

    const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')}"` : '';

    // Map Bricks element names to HTML
    switch (element.name) {
      case 'container':
        return `<div class="container"${styleAttr}>${this.convertElementsToHTML(children)}</div>`;

      case 'section':
        return `<section class="section"${styleAttr}>${this.convertElementsToHTML(children)}</section>`;

      case 'heading':
        const tag = settings.tag || 'h2';
        const text = this.escapeHTML(settings.text || '');
        return `<${tag}${styleAttr}>${text}</${tag}>`;

      case 'text':
      case 'paragraph':
        const pText = this.escapeHTML(settings.text || '');
        return `<p${styleAttr}>${pText}</p>`;

      case 'image':
        const src = settings.src || settings.url || '';
        const alt = settings.alt || '';
        return `<img src="${this.escapeHTML(src)}" alt="${this.escapeHTML(alt)}"${styleAttr} />`;

      case 'button':
        const buttonText = this.escapeHTML(settings.text || 'Click Me');
        const href = settings.link || settings.href || '#';
        return `<a href="${this.escapeHTML(href)}" class="button"${styleAttr}>${buttonText}</a>`;

      case 'div':
      case 'block':
        return `<div${styleAttr}>${this.convertElementsToHTML(children)}</div>`;

      case 'grid':
        return `<div class="grid"${styleAttr}>${this.convertElementsToHTML(children)}</div>`;

      case 'card':
        return `<div class="card"${styleAttr}>${this.convertElementsToHTML(children)}</div>`;

      case 'hero':
        return `<div class="hero"${styleAttr}>${this.convertElementsToHTML(children)}</div>`;

      default:
        // Generic wrapper for unknown elements
        return `<div data-element="${element.name}"${styleAttr}>${this.convertElementsToHTML(children)}</div>`;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHTML(text: string): string {
    const div = { textContent: text };
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return text.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
  }

  /**
   * Generate a complete preview page
   */
  generatePreviewPage(
    pages: Array<{
      title: string;
      slug: string;
      elements: any;
    }>,
    restaurantName: string,
  ): string {
    const navLinks = pages
      .map(
        (page) =>
          `<a href="#${page.slug}" style="margin: 0 15px; color: white; text-decoration: none;">${page.title}</a>`,
      )
      .join('');

    const sectionsHTML = pages
      .map((page) => {
        const elements = Array.isArray(page.elements) ? page.elements : [];
        return `
        <div id="${page.slug}" class="page-section">
          <h2 style="text-align: center; margin: 40px 0; font-size: 2.5rem;">${page.title}</h2>
          ${this.convertElementsToHTML(elements)}
        </div>
      `;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHTML(restaurantName)} - Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    nav {
      background: #667eea;
      padding: 20px 0;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .page-section {
      min-height: 400px;
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section {
      padding: 60px 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 2rem 0;
    }

    .card {
      padding: 2rem;
      border-radius: 8px;
      background: #f9fafb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .hero {
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }

    .button:hover {
      background: #5568d3;
    }

    .preview-notice {
      background: #fef3c7;
      padding: 15px;
      text-align: center;
      font-weight: 500;
      color: #92400e;
      border-bottom: 2px solid #fcd34d;
    }
  </style>
</head>
<body>
  <div class="preview-notice">
    📋 Preview Mode - This is how your rebuilt website will look
  </div>

  <nav>
    ${navLinks}
  </nav>

  ${sectionsHTML}
</body>
</html>`;
  }
}
