import { GeminiService } from '../../services/GeminiService';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Coloring Book Generator
 *
 * Generates complete coloring books for:
 * - Amazon KDP publishing
 * - Etsy digital downloads
 * - Print-on-demand services
 *
 * Features:
 * - 30, 50, or 100 page books
 * - Single-sided printing layout
 * - Custom themes and difficulty levels
 * - Print-ready PDFs
 * - Cover design included
 */

export interface ColoringBookConfig {
  theme: string;
  pageCount: 30 | 50 | 100;
  difficulty: 'easy' | 'medium' | 'advanced' | 'mixed';
  style: 'mandala' | 'nature' | 'animals' | 'patterns' | 'fantasy' | 'floral' | 'geometric' | 'abstract' | 'characters';
  size: '8.5x11' | '8x10' | 'A4' | 'square-8.5';
  includeTestPage?: boolean;
  includeBackPages?: boolean; // Blank backs for single-sided printing
  ageGroup?: 'kids' | 'adults' | 'seniors' | 'all';
}

export interface ColoringPage {
  pageNumber: number;
  prompt: string;
  imagePath: string;
  difficulty: string;
  theme: string;
}

export interface ColoringBook {
  title: string;
  description: string;
  tags: string[];
  interiorPDF: string;
  coverPDF?: string;
  previewImage: string;
  pageCount: number;
  pages: ColoringPage[];
  price: number;
  kdpReady: boolean;
}

export class ColoringBookGenerator {
  private gemini: GeminiService;
  private outputDir: string;

  private readonly PAGE_SIZES = {
    '8.5x11': { width: 8.5, height: 11 },
    '8x10': { width: 8, height: 10 },
    'A4': { width: 8.27, height: 11.69 },
    'square-8.5': { width: 8.5, height: 8.5 },
  };

  private readonly BLEED = 0.125; // inches for print

  constructor(apiKey: string, outputDir = './output/coloring-books') {
    this.gemini = new GeminiService(apiKey);
    this.outputDir = outputDir;
  }

  /**
   * Generate complete coloring book
   */
  async generateColoringBook(config: ColoringBookConfig): Promise<ColoringBook> {
    // Create output directory
    const bookDir = path.join(this.outputDir, this.sanitizeFilename(config.theme));
    await fs.mkdir(bookDir, { recursive: true });

    console.log(`📚 Generating ${config.pageCount}-page coloring book...`);
    console.log(`Theme: ${config.theme}`);
    console.log(`Style: ${config.style}`);
    console.log(`Difficulty: ${config.difficulty}`);

    // Generate pages
    const pages = await this.generatePages(config, bookDir);

    // Create interior PDF
    console.log('📄 Creating interior PDF...');
    const interiorPDF = await this.createInteriorPDF(config, pages, bookDir);

    // Create cover
    console.log('🎨 Designing cover...');
    const coverPDF = await this.createCover(config, bookDir);

    // Create preview image
    console.log('📸 Creating preview image...');
    const previewImage = await this.createPreview(pages.slice(0, 6), bookDir);

    // Generate metadata
    const book = this.generateBookMetadata(config, pages, interiorPDF, coverPDF, previewImage);

    console.log('✅ Coloring book generated successfully!');
    console.log(`📖 Total pages: ${pages.length}`);

    return book;
  }

  /**
   * Generate all coloring pages
   */
  private async generatePages(config: ColoringBookConfig, outputDir: string): Promise<ColoringPage[]> {
    const pages: ColoringPage[] = [];
    const actualPageCount = config.includeBackPages ? config.pageCount / 2 : config.pageCount;

    for (let i = 0; i < actualPageCount; i++) {
      console.log(`  Creating page ${i + 1}/${actualPageCount}...`);

      const difficulty = config.difficulty === 'mixed'
        ? this.getRandomDifficulty()
        : config.difficulty;

      const prompt = this.createPagePrompt(config, i + 1, difficulty);
      const imagePath = await this.generateColoringPage(prompt, config, outputDir, i + 1);

      pages.push({
        pageNumber: i + 1,
        prompt,
        imagePath,
        difficulty,
        theme: config.theme,
      });
    }

    return pages;
  }

  /**
   * Create prompt for individual coloring page
   */
  private createPagePrompt(config: ColoringBookConfig, pageNumber: number, difficulty: string): string {
    let prompt = `Create a detailed black and white line art illustration for a coloring book. `;
    prompt += `Theme: ${config.theme}. `;
    prompt += `Style: ${config.style}. `;
    prompt += `Page ${pageNumber}. `;

    // Age-appropriate content
    if (config.ageGroup === 'kids') {
      prompt += 'Make it fun, friendly, and suitable for children ages 4-12. ';
    } else if (config.ageGroup === 'adults') {
      prompt += 'Make it intricate and sophisticated for adult colorists. ';
    } else if (config.ageGroup === 'seniors') {
      prompt += 'Make it clear with medium detail levels, relaxing and enjoyable. ';
    }

    // Difficulty-specific instructions
    switch (difficulty) {
      case 'easy':
        prompt += 'Use large, simple shapes with bold outlines. Minimal small details. ';
        break;
      case 'medium':
        prompt += 'Use moderate detail with a mix of large and small elements. ';
        break;
      case 'advanced':
        prompt += 'Use intricate details, complex patterns, and fine lines. ';
        break;
    }

    // Style-specific instructions
    switch (config.style) {
      case 'mandala':
        prompt += 'Create a symmetrical mandala design with concentric circles and geometric patterns. ';
        break;
      case 'nature':
        prompt += 'Feature natural elements like trees, flowers, mountains, or landscapes. ';
        break;
      case 'animals':
        prompt += 'Feature an animal with decorative patterns and details. ';
        break;
      case 'patterns':
        prompt += 'Create repeating patterns and abstract designs. ';
        break;
      case 'fantasy':
        prompt += 'Include fantasy elements like dragons, unicorns, or magical scenes. ';
        break;
      case 'floral':
        prompt += 'Feature beautiful flowers, vines, and botanical elements. ';
        break;
      case 'geometric':
        prompt += 'Use geometric shapes, tessellations, and mathematical patterns. ';
        break;
      case 'abstract':
        prompt += 'Create abstract flowing shapes and artistic compositions. ';
        break;
      case 'characters':
        prompt += 'Feature characters or people in interesting scenes or poses. ';
        break;
    }

    prompt += 'CRITICAL: The image must be black line art on white background only. ';
    prompt += 'No shading, no gray tones, no colors - just clean black outlines for coloring. ';
    prompt += 'The design should fill the page nicely with appropriate margins. ';

    return prompt;
  }

  /**
   * Generate single coloring page
   */
  private async generateColoringPage(
    prompt: string,
    config: ColoringBookConfig,
    outputDir: string,
    pageNumber: number
  ): Promise<string> {
    const filename = `page-${String(pageNumber).padStart(3, '0')}.png`;
    const filepath = path.join(outputDir, filename);

    const pageSize = this.PAGE_SIZES[config.size];
    const widthPx = Math.round((pageSize.width + this.BLEED * 2) * 300); // 300 DPI
    const heightPx = Math.round((pageSize.height + this.BLEED * 2) * 300);

    // TODO: Replace with actual AI image generation (line art)
    // For demo, create placeholder
    await this.createLinePlaceholder(filepath, widthPx, heightPx);

    return filepath;
  }

  /**
   * Create interior PDF from pages
   */
  private async createInteriorPDF(
    config: ColoringBookConfig,
    pages: ColoringPage[],
    outputDir: string
  ): Promise<string> {
    const pdfPath = path.join(outputDir, 'interior.pdf');

    const pdfDoc = await PDFDocument.create();
    const pageSize = this.PAGE_SIZES[config.size];

    for (const page of pages) {
      // Add coloring page
      const imageBytes = await fs.readFile(page.imagePath);
      const image = await pdfDoc.embedPng(imageBytes);

      const pdfPage = pdfDoc.addPage([pageSize.width * 72, pageSize.height * 72]);
      const { width, height } = pdfPage.getSize();

      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });

      // Add blank back page if requested (for single-sided printing)
      if (config.includeBackPages) {
        pdfDoc.addPage([pageSize.width * 72, pageSize.height * 72]);
      }
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(pdfPath, pdfBytes);

    return pdfPath;
  }

  /**
   * Create book cover
   */
  private async createCover(config: ColoringBookConfig, outputDir: string): Promise<string> {
    const coverPath = path.join(outputDir, 'cover.pdf');
    const pageSize = this.PAGE_SIZES[config.size];

    // Calculate spine width (approximate)
    const spineWidth = this.calculateSpineWidth(config.pageCount, 'white'); // white paper

    // Total cover width = front + spine + back
    const totalWidth = (pageSize.width * 2 + spineWidth + this.BLEED * 2) * 72;
    const totalHeight = (pageSize.height + this.BLEED * 2) * 72;

    const pdfDoc = await PDFDocument.create();
    const coverPage = pdfDoc.addPage([totalWidth, totalHeight]);

    const { width, height } = coverPage.getSize();

    // Draw simple cover design
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Background
    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Title on front cover
    const title = this.generateTitle(config);
    const titleSize = 36;

    const frontCenterX = width * 0.75; // Right side (front cover)
    const centerY = height / 2;

    // Split title into multiple lines if needed
    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = helveticaFont.widthOfTextAtSize(testLine, titleSize);

      if (textWidth > width * 0.2) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Draw title lines
    const lineHeight = titleSize * 1.2;
    const startY = centerY + (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      const textWidth = helveticaFont.widthOfTextAtSize(line, titleSize);
      coverPage.drawText(line, {
        x: frontCenterX - textWidth / 2,
        y: startY - index * lineHeight,
        size: titleSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });

    // Subtitle
    const subtitle = `${config.pageCount} Beautiful Pages to Color`;
    const subtitleSize = 18;
    const subtitleWidth = helveticaFont.widthOfTextAtSize(subtitle, subtitleSize);

    coverPage.drawText(subtitle, {
      x: frontCenterX - subtitleWidth / 2,
      y: centerY - 100,
      size: subtitleSize,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(coverPath, pdfBytes);

    return coverPath;
  }

  /**
   * Create preview image
   */
  private async createPreview(pages: ColoringPage[], outputDir: string): Promise<string> {
    const previewPath = path.join(outputDir, 'preview.jpg');

    // Create a grid of 2x3 pages
    const cols = 3;
    const rows = 2;
    const pageWidth = 800;
    const pageHeight = 1000;
    const padding = 20;

    const canvasWidth = cols * pageWidth + (cols + 1) * padding;
    const canvasHeight = rows * pageHeight + (rows + 1) * padding;

    // Create background
    const background = await sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 3,
        background: { r: 245, g: 245, b: 245 },
      },
    })
      .png()
      .toBuffer();

    // Composite pages
    const composites = [];
    for (let i = 0; i < Math.min(pages.length, 6); i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const resized = await sharp(pages[i].imagePath)
        .resize(pageWidth, pageHeight, { fit: 'inside', background: { r: 255, g: 255, b: 255 } })
        .toBuffer();

      composites.push({
        input: resized,
        top: padding + row * (pageHeight + padding),
        left: padding + col * (pageWidth + padding),
      });
    }

    await sharp(background)
      .composite(composites)
      .jpeg({ quality: 90 })
      .toFile(previewPath);

    return previewPath;
  }

  /**
   * Generate book metadata
   */
  private generateBookMetadata(
    config: ColoringBookConfig,
    pages: ColoringPage[],
    interiorPDF: string,
    coverPDF: string,
    previewImage: string
  ): ColoringBook {
    return {
      title: this.generateTitle(config),
      description: this.generateDescription(config),
      tags: this.generateTags(config),
      interiorPDF,
      coverPDF,
      previewImage,
      pageCount: config.includeBackPages ? config.pageCount : pages.length,
      pages,
      price: this.calculatePrice(config.pageCount, config.size),
      kdpReady: true,
    };
  }

  /**
   * Generate book title
   */
  private generateTitle(config: ColoringBookConfig): string {
    const styleCapitalized = config.style.charAt(0).toUpperCase() + config.style.slice(1);
    const themeCapitalized = config.theme.charAt(0).toUpperCase() + config.theme.slice(1);

    let ageText = '';
    if (config.ageGroup === 'kids') ageText = ' for Kids';
    else if (config.ageGroup === 'adults') ageText = ' for Adults';
    else if (config.ageGroup === 'seniors') ageText = ' for Seniors';

    return `${themeCapitalized} ${styleCapitalized} Coloring Book${ageText}`;
  }

  /**
   * Generate book description
   */
  private generateDescription(config: ColoringBookConfig): string {
    return `
🎨 ${config.theme.toUpperCase()} COLORING BOOK - ${config.pageCount} PAGES

Relax and unleash your creativity with this beautiful ${config.style} coloring book!

✨ FEATURES:
• ${config.pageCount} unique coloring pages
• ${config.style} style illustrations
• ${config.difficulty === 'mixed' ? 'Mixed difficulty levels' : config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1) + ' difficulty'}
• High-quality designs
• Single-sided pages to prevent bleed-through
• ${config.size} size - perfect for framing!

📖 INSIDE THIS BOOK:
Discover ${config.pageCount} stunning ${config.style} designs featuring ${config.theme}. Each page is thoughtfully created to provide hours of coloring enjoyment and stress relief.

🎯 PERFECT FOR:
• Relaxation and stress relief
• Mindfulness practice
• Gifts for loved ones
• Art therapy
• Creative expression
• Quality me-time
${config.ageGroup === 'kids' ? '• Developing fine motor skills' : ''}

📐 SPECIFICATIONS:
• Size: ${config.size} inches
• Pages: ${config.pageCount}
• Paper: Single-sided for no bleed-through
• Perfect for colored pencils, markers, gel pens, and crayons

🎨 DIFFICULTY: ${config.difficulty === 'mixed' ? 'Varied - something for everyone!' : config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)}

💝 MAKES A GREAT GIFT!
Perfect for birthdays, holidays, or any occasion. Give the gift of creativity and relaxation!

⭐ HIGH QUALITY GUARANTEE
Each design is carefully crafted to ensure clean lines and enjoyable coloring experience.
    `.trim();
  }

  /**
   * Generate book tags
   */
  private generateTags(config: ColoringBookConfig): string[] {
    const baseTags = [
      'coloring book',
      'adult coloring book',
      'coloring pages',
      'stress relief',
      'mindfulness',
    ];

    const styleTags = [
      config.style + ' coloring',
      config.style + ' designs',
    ];

    const themeTags = [
      config.theme + ' coloring book',
      config.theme,
    ];

    const ageTags = config.ageGroup === 'kids'
      ? ['kids coloring book', 'children activity']
      : ['adult coloring', 'relaxation'];

    return [...baseTags, ...styleTags, ...themeTags, ...ageTags].slice(0, 13);
  }

  /**
   * Calculate book price
   */
  private calculatePrice(pageCount: number, size: string): number {
    const basePrices: Record<number, number> = {
      30: 6.99,
      50: 9.99,
      100: 14.99,
    };

    const basePrice = basePrices[pageCount] || 9.99;

    // Larger sizes cost more
    const sizeMultiplier = size === 'square-8.5' || size === '8.5x11' ? 1.2 : 1.0;

    return Math.round(basePrice * sizeMultiplier * 100) / 100;
  }

  /**
   * Calculate spine width for cover
   */
  private calculateSpineWidth(pageCount: number, paperType: 'white' | 'cream'): number {
    // KDP spine width formula
    const paperThickness = paperType === 'white' ? 0.002252 : 0.0025;
    const spineWidth = pageCount * paperThickness;

    return spineWidth;
  }

  /**
   * Get random difficulty
   */
  private getRandomDifficulty(): 'easy' | 'medium' | 'advanced' {
    const difficulties: ('easy' | 'medium' | 'advanced')[] = ['easy', 'medium', 'advanced'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  /**
   * Helper: Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Helper: Create line art placeholder
   */
  private async createLinePlaceholder(
    outputPath: string,
    width: number,
    height: number
  ): Promise<void> {
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toFile(outputPath);
  }

  /**
   * Batch generate multiple coloring books
   */
  async generateMultipleBooks(configs: ColoringBookConfig[]): Promise<ColoringBook[]> {
    const books: ColoringBook[] = [];

    for (const config of configs) {
      const book = await this.generateColoringBook(config);
      books.push(book);
    }

    return books;
  }
}

export default ColoringBookGenerator;
