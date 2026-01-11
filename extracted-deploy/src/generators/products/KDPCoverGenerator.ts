import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * KDP Cover Generator
 *
 * Generates print-ready book covers for Amazon KDP with:
 * - Precise spine width calculations
 * - Full cover (front + spine + back)
 * - Bleed and safe zones
 * - Barcode placement area
 * - Professional design templates
 *
 * Features:
 * - Automatic spine calculator
 * - Multiple trim sizes
 * - White and cream paper support
 * - Cover templates
 * - Preview generation
 */

export interface KDPCoverConfig {
  title: string;
  subtitle?: string;
  author: string;
  pageCount: number;
  trimSize: '6x9' | '8.5x11' | '8x10' | '7x10' | '5.5x8.5' | '5x8';
  paperType: 'white' | 'cream';
  coverType: 'paperback' | 'hardcover';
  design?: {
    backgroundColor?: string;
    textColor?: string;
    coverImage?: string;
    backCoverText?: string;
    authorBio?: string;
  };
}

export interface KDPCover {
  coverPDF: string;
  specifications: {
    totalWidth: number;
    totalHeight: number;
    spineWidth: number;
    frontCoverWidth: number;
    backCoverWidth: number;
    bleed: number;
    trimSize: string;
    paperType: string;
  };
  safeZones: {
    front: { x: number; y: number; width: number; height: number };
    spine: { x: number; y: number; width: number; height: number };
    back: { x: number; y: number; width: number; height: number };
  };
  templateImage: string;
  previewImage: string;
}

export class KDPCoverGenerator {
  private outputDir: string;

  private readonly TRIM_SIZES = {
    '6x9': { width: 6, height: 9 },
    '8.5x11': { width: 8.5, height: 11 },
    '8x10': { width: 8, height: 10 },
    '7x10': { width: 7, height: 10 },
    '5.5x8.5': { width: 5.5, height: 8.5 },
    '5x8': { width: 5, height: 8 },
  };

  private readonly BLEED = 0.125; // inches
  private readonly SPINE_SAFE_MARGIN = 0.0625; // inches
  private readonly COVER_SAFE_MARGIN = 0.25; // inches

  // Paper thickness constants (inches per page)
  private readonly PAPER_THICKNESS = {
    white: {
      paperback: 0.002252,
      hardcover: 0.0025,
    },
    cream: {
      paperback: 0.0025,
      hardcover: 0.00275,
    },
  };

  constructor(outputDir = './output/kdp-covers') {
    this.outputDir = outputDir;
  }

  /**
   * Generate KDP cover
   */
  async generateCover(config: KDPCoverConfig): Promise<KDPCover> {
    // Create output directory
    const coverDir = path.join(this.outputDir, this.sanitizeFilename(config.title));
    await fs.mkdir(coverDir, { recursive: true });

    console.log(`📘 Generating KDP cover for "${config.title}"...`);

    // Calculate spine width
    const spineWidth = this.calculateSpineWidth(config.pageCount, config.paperType, config.coverType);
    console.log(`📏 Spine width: ${spineWidth.toFixed(4)} inches`);

    // Calculate cover dimensions
    const dimensions = this.calculateCoverDimensions(config.trimSize, spineWidth);
    console.log(`📐 Total cover size: ${dimensions.totalWidth}" x ${dimensions.totalHeight}"`);

    // Generate cover PDF
    const coverPDF = await this.createCoverPDF(config, dimensions, coverDir);

    // Generate template image
    const templateImage = await this.createTemplateImage(config, dimensions, coverDir);

    // Generate preview
    const previewImage = await this.createPreviewImage(templateImage, coverDir);

    // Calculate safe zones
    const safeZones = this.calculateSafeZones(dimensions, spineWidth);

    console.log('✅ KDP cover generated successfully!');

    return {
      coverPDF,
      specifications: {
        totalWidth: dimensions.totalWidth,
        totalHeight: dimensions.totalHeight,
        spineWidth,
        frontCoverWidth: dimensions.frontWidth,
        backCoverWidth: dimensions.backWidth,
        bleed: this.BLEED,
        trimSize: config.trimSize,
        paperType: config.paperType,
      },
      safeZones,
      templateImage,
      previewImage,
    };
  }

  /**
   * Calculate spine width using KDP formula
   */
  calculateSpineWidth(pageCount: number, paperType: 'white' | 'cream', coverType: 'paperback' | 'hardcover' = 'paperback'): number {
    const thickness = this.PAPER_THICKNESS[paperType][coverType];
    const spineWidth = pageCount * thickness;

    // KDP minimum spine width
    const minSpineWidth = 0.06;

    return Math.max(spineWidth, minSpineWidth);
  }

  /**
   * Calculate full cover dimensions
   */
  private calculateCoverDimensions(trimSize: string, spineWidth: number) {
    const trim = this.TRIM_SIZES[trimSize];

    // Front and back covers are the same size
    const frontWidth = trim.width;
    const backWidth = trim.width;
    const height = trim.height;

    // Total width = back + spine + front + bleed on both sides
    const totalWidth = backWidth + spineWidth + frontWidth + (this.BLEED * 2);
    const totalHeight = height + (this.BLEED * 2);

    return {
      totalWidth,
      totalHeight,
      frontWidth,
      backWidth,
      height,
      spineWidth,
      frontStartX: this.BLEED + backWidth + spineWidth,
      backStartX: this.BLEED,
      spineStartX: this.BLEED + backWidth,
    };
  }

  /**
   * Calculate safe zones for content placement
   */
  private calculateSafeZones(dimensions: any, spineWidth: number) {
    const safeMargin = this.COVER_SAFE_MARGIN;
    const spineSafeMargin = this.SPINE_SAFE_MARGIN;

    return {
      front: {
        x: dimensions.frontStartX + safeMargin,
        y: this.BLEED + safeMargin,
        width: dimensions.frontWidth - safeMargin * 2,
        height: dimensions.height - safeMargin * 2,
      },
      spine: {
        x: dimensions.spineStartX + spineSafeMargin,
        y: this.BLEED + safeMargin,
        width: spineWidth - spineSafeMargin * 2,
        height: dimensions.height - safeMargin * 2,
      },
      back: {
        x: dimensions.backStartX + safeMargin,
        y: this.BLEED + safeMargin,
        width: dimensions.backWidth - safeMargin * 2 - 2, // Reserve space for barcode
        height: dimensions.height - safeMargin * 2,
      },
    };
  }

  /**
   * Create cover PDF
   */
  private async createCoverPDF(config: KDPCoverConfig, dimensions: any, outputDir: string): Promise<string> {
    const pdfPath = path.join(outputDir, 'cover.pdf');
    const pdfDoc = await PDFDocument.create();

    const width = dimensions.totalWidth * 72;
    const height = dimensions.totalHeight * 72;

    const page = pdfDoc.addPage([width, height]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Background color
    const bgColor = config.design?.backgroundColor
      ? this.hexToRgb(config.design.backgroundColor)
      : rgb(1, 1, 1);

    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: bgColor,
    });

    // Front cover
    await this.drawFrontCover(page, config, dimensions, boldFont, font);

    // Spine
    await this.drawSpine(page, config, dimensions, font);

    // Back cover
    await this.drawBackCover(page, config, dimensions, font);

    // Draw guide lines (will be removed in final version)
    if (process.env.NODE_ENV === 'development') {
      this.drawGuideLines(page, dimensions);
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(pdfPath, pdfBytes);

    return pdfPath;
  }

  /**
   * Draw front cover content
   */
  private async drawFrontCover(
    page: any,
    config: KDPCoverConfig,
    dimensions: any,
    boldFont: PDFFont,
    font: PDFFont
  ): Promise<void> {
    const frontCenterX = (dimensions.frontStartX + dimensions.frontWidth / 2) * 72;
    const centerY = (dimensions.height / 2 + this.BLEED) * 72;

    const textColor = config.design?.textColor
      ? this.hexToRgb(config.design.textColor)
      : rgb(0, 0, 0);

    // Title
    const titleSize = this.calculateTitleSize(config.title, dimensions.frontWidth);
    const titleLines = this.wrapText(config.title, titleSize, boldFont, dimensions.frontWidth * 0.8 * 72);

    const lineHeight = titleSize * 1.3;
    let currentY = centerY + (titleLines.length * lineHeight) / 2;

    titleLines.forEach(line => {
      const textWidth = boldFont.widthOfTextAtSize(line, titleSize);
      page.drawText(line, {
        x: frontCenterX - textWidth / 2,
        y: currentY,
        size: titleSize,
        font: boldFont,
        color: textColor,
      });
      currentY -= lineHeight;
    });

    // Subtitle
    if (config.subtitle) {
      const subtitleSize = titleSize * 0.5;
      const subtitleLines = this.wrapText(config.subtitle, subtitleSize, font, dimensions.frontWidth * 0.8 * 72);

      currentY -= 20;

      subtitleLines.forEach(line => {
        const textWidth = font.widthOfTextAtSize(line, subtitleSize);
        page.drawText(line, {
          x: frontCenterX - textWidth / 2,
          y: currentY,
          size: subtitleSize,
          font: font,
          color: textColor,
        });
        currentY -= subtitleSize * 1.3;
      });
    }

    // Author
    const authorSize = titleSize * 0.6;
    const authorText = config.author;
    const authorWidth = boldFont.widthOfTextAtSize(authorText, authorSize);

    page.drawText(authorText, {
      x: frontCenterX - authorWidth / 2,
      y: (this.BLEED + 1) * 72,
      size: authorSize,
      font: boldFont,
      color: textColor,
    });
  }

  /**
   * Draw spine content
   */
  private async drawSpine(
    page: any,
    config: KDPCoverConfig,
    dimensions: any,
    font: PDFFont
  ): Promise<void> {
    if (dimensions.spineWidth < 0.15) {
      // Spine too narrow for text
      return;
    }

    const spineText = config.title.toUpperCase();
    const spineSize = Math.min(12, dimensions.spineWidth * 72 * 0.6);

    const spineCenterX = (dimensions.spineStartX + dimensions.spineWidth / 2) * 72;
    const spineCenterY = (dimensions.height / 2 + this.BLEED) * 72;

    const textColor = config.design?.textColor
      ? this.hexToRgb(config.design.textColor)
      : rgb(0, 0, 0);

    // Rotate text 90 degrees for spine
    page.drawText(spineText, {
      x: spineCenterX - spineSize / 3,
      y: spineCenterY - font.widthOfTextAtSize(spineText, spineSize) / 2,
      size: spineSize,
      font: font,
      color: textColor,
      rotate: { angle: 90, type: 'degrees' },
    });
  }

  /**
   * Draw back cover content
   */
  private async drawBackCover(
    page: any,
    config: KDPCoverConfig,
    dimensions: any,
    font: PDFFont
  ): Promise<void> {
    const backX = (dimensions.backStartX + this.COVER_SAFE_MARGIN) * 72;
    const backY = (dimensions.height - this.COVER_SAFE_MARGIN - this.BLEED) * 72;
    const backWidth = (dimensions.backWidth - this.COVER_SAFE_MARGIN * 2) * 72;

    const textColor = config.design?.textColor
      ? this.hexToRgb(config.design.textColor)
      : rgb(0, 0, 0);

    // Back cover description
    if (config.design?.backCoverText) {
      const descSize = 11;
      const descLines = this.wrapText(config.design.backCoverText, descSize, font, backWidth - 100);

      let currentY = backY - 50;

      descLines.slice(0, 25).forEach(line => {
        page.drawText(line, {
          x: backX + 20,
          y: currentY,
          size: descSize,
          font: font,
          color: textColor,
        });
        currentY -= descSize * 1.4;
      });
    }

    // Author bio
    if (config.design?.authorBio) {
      const bioSize = 9;
      const bioLines = this.wrapText(config.design.authorBio, bioSize, font, backWidth - 100);

      let currentY = (this.BLEED + 2) * 72;

      page.drawText('About the Author', {
        x: backX + 20,
        y: currentY,
        size: 10,
        font: font,
        color: textColor,
      });

      currentY -= 20;

      bioLines.slice(0, 5).forEach(line => {
        page.drawText(line, {
          x: backX + 20,
          y: currentY,
          size: bioSize,
          font: font,
          color: textColor,
        });
        currentY -= bioSize * 1.4;
      });
    }

    // Barcode placeholder
    page.drawRectangle({
      x: backX + backWidth - 150,
      y: (this.BLEED + 0.5) * 72,
      width: 130,
      height: 70,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });

    page.drawText('ISBN BARCODE', {
      x: backX + backWidth - 140,
      y: (this.BLEED + 1) * 72,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  /**
   * Draw guide lines for development
   */
  private drawGuideLines(page: any, dimensions: any): void {
    const { width, height } = page.getSize();

    // Bleed lines
    page.drawRectangle({
      x: this.BLEED * 72,
      y: this.BLEED * 72,
      width: width - this.BLEED * 72 * 2,
      height: height - this.BLEED * 72 * 2,
      borderColor: rgb(1, 0, 0),
      borderWidth: 1,
    });

    // Spine lines
    const spineLeft = dimensions.spineStartX * 72;
    const spineRight = (dimensions.spineStartX + dimensions.spineWidth) * 72;

    page.drawLine({
      start: { x: spineLeft, y: 0 },
      end: { x: spineLeft, y: height },
      color: rgb(0, 0, 1),
      thickness: 1,
    });

    page.drawLine({
      start: { x: spineRight, y: 0 },
      end: { x: spineRight, y: height },
      color: rgb(0, 0, 1),
      thickness: 1,
    });
  }

  /**
   * Create template image
   */
  private async createTemplateImage(
    config: KDPCoverConfig,
    dimensions: any,
    outputDir: string
  ): Promise<string> {
    const templatePath = path.join(outputDir, 'template.png');

    const widthPx = Math.round(dimensions.totalWidth * 300); // 300 DPI
    const heightPx = Math.round(dimensions.totalHeight * 300);

    // Create high-res template image
    await sharp({
      create: {
        width: widthPx,
        height: heightPx,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toFile(templatePath);

    return templatePath;
  }

  /**
   * Create preview image
   */
  private async createPreviewImage(templatePath: string, outputDir: string): Promise<string> {
    const previewPath = path.join(outputDir, 'preview.jpg');

    await sharp(templatePath)
      .resize(1200, null, { fit: 'inside' })
      .jpeg({ quality: 90 })
      .toFile(previewPath);

    return previewPath;
  }

  /**
   * Calculate optimal title size
   */
  private calculateTitleSize(title: string, coverWidth: number): number {
    const titleLength = title.length;

    if (titleLength < 20) return 48;
    if (titleLength < 30) return 42;
    if (titleLength < 40) return 36;
    if (titleLength < 50) return 30;
    return 24;
  }

  /**
   * Wrap text to fit width
   */
  private wrapText(text: string, fontSize: number, font: PDFFont, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
      return rgb(1, 1, 1);
    }

    return rgb(
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    );
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate spine width chart for reference
   */
  generateSpineWidthChart(): Record<number, { white: number; cream: number }> {
    const chart: Record<number, { white: number; cream: number }> = {};
    const pageCounts = [24, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800];

    pageCounts.forEach(pageCount => {
      chart[pageCount] = {
        white: this.calculateSpineWidth(pageCount, 'white', 'paperback'),
        cream: this.calculateSpineWidth(pageCount, 'cream', 'paperback'),
      };
    });

    return chart;
  }
}

export default KDPCoverGenerator;
