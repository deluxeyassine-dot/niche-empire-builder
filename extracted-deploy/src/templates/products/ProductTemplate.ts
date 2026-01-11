/**
 * ProductTemplate - Complete product template system
 *
 * Handles different product types:
 * - Physical products (with shipping, inventory)
 * - Digital products (with downloads, licenses)
 * - Service products (with scheduling, bookings)
 * - Product variations (size, color, etc.)
 * - Pricing tiers (volume discounts)
 * - Product bundles (package deals)
 */

import { getSEOOptimizer } from '../../utils/SEOOptimizer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Base product interface
 */
export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  currency: string;
  category: string;
  tags?: string[];
  images: string[];
  featured?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Physical product with shipping details
 */
export interface PhysicalProduct extends BaseProduct {
  type: 'physical';
  sku: string;
  barcode?: string;
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
    trackInventory: boolean;
    allowBackorders?: boolean;
  };
  shipping: {
    weight: number;
    weightUnit: 'kg' | 'lb';
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'in';
    };
    requiresShipping: boolean;
    shippingClass?: string;
  };
  variations?: ProductVariation[];
}

/**
 * Digital product with download/license info
 */
export interface DigitalProduct extends BaseProduct {
  type: 'digital';
  downloadable: true;
  download: {
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    downloadLimit?: number;
    downloadExpiry?: number; // days
  };
  license?: {
    type: 'single' | 'multi' | 'unlimited';
    seats?: number;
    duration?: number; // days, null for lifetime
    allowTransfer?: boolean;
  };
  systemRequirements?: string[];
  version?: string;
  autoUpdate?: boolean;
}

/**
 * Service product with booking details
 */
export interface ServiceProduct extends BaseProduct {
  type: 'service';
  service: {
    duration: number; // minutes
    durationType: 'fixed' | 'flexible';
    bookingWindow: {
      minAdvance: number; // hours
      maxAdvance: number; // days
    };
    availability?: {
      monday?: TimeSlot[];
      tuesday?: TimeSlot[];
      wednesday?: TimeSlot[];
      thursday?: TimeSlot[];
      friday?: TimeSlot[];
      saturday?: TimeSlot[];
      sunday?: TimeSlot[];
    };
    maxBookingsPerSlot?: number;
    requiresApproval?: boolean;
    cancellationPolicy?: string;
  };
  location?: 'online' | 'on-site' | 'client-location';
  deliveryMethod?: string[];
  staffRequired?: number;
}

/**
 * Time slot for service availability
 */
export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

/**
 * Product variation (size, color, etc.)
 */
export interface ProductVariation {
  id: string;
  name: string;
  attributes: Record<string, string>; // e.g., { size: 'Large', color: 'Blue' }
  price?: number; // Override base price
  sku?: string;
  inventory?: number;
  image?: string;
  active?: boolean;
}

/**
 * Pricing tier for volume discounts
 */
export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number; // null for unlimited
  price: number;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
}

/**
 * Product bundle
 */
export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: BundleItem[];
  pricing: {
    totalPrice: number;
    bundlePrice: number;
    savings: number;
    savingsPercentage: number;
  };
  images?: string[];
  active?: boolean;
  limitedTime?: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Bundle item
 */
export interface BundleItem {
  productId: string;
  quantity: number;
  variationId?: string;
  optional?: boolean;
}

/**
 * Product review
 */
export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  verified?: boolean;
  helpful?: number;
  date: Date;
  images?: string[];
}

/**
 * Product metadata for SEO and marketing
 */
export interface ProductMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  brand?: string;
  manufacturer?: string;
  warranty?: string;
  returnPolicy?: string;
  taxable?: boolean;
  taxClass?: string;
}

export class ProductTemplate {
  private outputDir: string;
  private seo: any;

  constructor(outputDir: string = './generated-products') {
    this.outputDir = outputDir;
    this.seo = getSEOOptimizer();

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Create a physical product template
   *
   * @param options - Physical product options
   * @returns Complete physical product
   */
  createPhysicalProduct(options: {
    name: string;
    description: string;
    price: number;
    sku: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    inventory: number;
    category: string;
    images: string[];
    features?: string[];
    specifications?: Record<string, string>;
  }): PhysicalProduct {
    console.log(`📦 Creating physical product: ${options.name}`);

    const product: PhysicalProduct = {
      id: this.generateId(options.name),
      type: 'physical',
      name: options.name,
      description: options.description,
      shortDescription: this.generateShortDescription(options.description),
      price: options.price,
      currency: 'USD',
      category: options.category,
      tags: this.extractTags(options.description),
      images: options.images,
      sku: options.sku,
      featured: false,
      active: true,
      inventory: {
        quantity: options.inventory,
        lowStockThreshold: Math.floor(options.inventory * 0.2),
        trackInventory: true,
        allowBackorders: false
      },
      shipping: {
        weight: options.weight,
        weightUnit: 'kg',
        dimensions: {
          ...options.dimensions,
          unit: 'cm'
        },
        requiresShipping: true,
        shippingClass: this.determineShippingClass(options.weight)
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveProduct(product);
    return product;
  }

  /**
   * Create a digital product template
   *
   * @param options - Digital product options
   * @returns Complete digital product
   */
  createDigitalProduct(options: {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    licenseType?: 'single' | 'multi' | 'unlimited';
    version?: string;
    systemRequirements?: string[];
  }): DigitalProduct {
    console.log(`💾 Creating digital product: ${options.name}`);

    const product: DigitalProduct = {
      id: this.generateId(options.name),
      type: 'digital',
      name: options.name,
      description: options.description,
      shortDescription: this.generateShortDescription(options.description),
      price: options.price,
      currency: 'USD',
      category: options.category,
      tags: this.extractTags(options.description),
      images: options.images,
      featured: false,
      active: true,
      downloadable: true,
      download: {
        fileUrl: options.fileUrl,
        fileSize: options.fileSize,
        fileType: options.fileType || this.extractFileType(options.fileUrl),
        downloadLimit: 5,
        downloadExpiry: 30
      },
      license: {
        type: options.licenseType || 'single',
        seats: options.licenseType === 'multi' ? 5 : options.licenseType === 'single' ? 1 : undefined,
        duration: null, // lifetime
        allowTransfer: false
      },
      version: options.version || '1.0.0',
      systemRequirements: options.systemRequirements,
      autoUpdate: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveProduct(product);
    return product;
  }

  /**
   * Create a service product template
   *
   * @param options - Service product options
   * @returns Complete service product
   */
  createServiceProduct(options: {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    duration: number; // minutes
    location?: 'online' | 'on-site' | 'client-location';
    availability?: any;
    requiresApproval?: boolean;
  }): ServiceProduct {
    console.log(`🔧 Creating service product: ${options.name}`);

    const product: ServiceProduct = {
      id: this.generateId(options.name),
      type: 'service',
      name: options.name,
      description: options.description,
      shortDescription: this.generateShortDescription(options.description),
      price: options.price,
      currency: 'USD',
      category: options.category,
      tags: this.extractTags(options.description),
      images: options.images,
      featured: false,
      active: true,
      service: {
        duration: options.duration,
        durationType: 'fixed',
        bookingWindow: {
          minAdvance: 24, // 24 hours
          maxAdvance: 60  // 60 days
        },
        availability: options.availability || this.getDefaultAvailability(),
        maxBookingsPerSlot: 1,
        requiresApproval: options.requiresApproval || false,
        cancellationPolicy: '24 hours notice required for full refund'
      },
      location: options.location || 'online',
      deliveryMethod: this.getDeliveryMethods(options.location || 'online'),
      staffRequired: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveProduct(product);
    return product;
  }

  /**
   * Generate product variations
   *
   * @param baseProduct - Base product
   * @param variationOptions - Variation options (size, color, etc.)
   * @returns Product with variations
   */
  generateVariations(
    baseProduct: PhysicalProduct,
    variationOptions: {
      attributes: Array<{
        name: string;
        values: Array<{
          value: string;
          priceModifier?: number;
          skuSuffix?: string;
          inventory?: number;
        }>;
      }>;
    }
  ): PhysicalProduct {
    console.log(`🎨 Generating variations for: ${baseProduct.name}`);

    const variations: ProductVariation[] = [];

    // Generate all combinations
    const attributeCombinations = this.generateCombinations(variationOptions.attributes);

    attributeCombinations.forEach((combo, index) => {
      const attributes: Record<string, string> = {};
      let priceModifier = 0;
      let skuSuffix = '';
      let inventory = baseProduct.inventory.quantity;

      combo.forEach(attr => {
        attributes[attr.name] = attr.value;
        priceModifier += attr.priceModifier || 0;
        skuSuffix += `-${attr.skuSuffix || attr.value.toLowerCase().replace(/\s+/g, '-')}`;
        if (attr.inventory !== undefined) {
          inventory = attr.inventory;
        }
      });

      variations.push({
        id: `${baseProduct.id}-var-${index + 1}`,
        name: `${baseProduct.name} (${Object.values(attributes).join(', ')})`,
        attributes,
        price: baseProduct.price + priceModifier,
        sku: `${baseProduct.sku}${skuSuffix}`,
        inventory,
        active: true
      });
    });

    baseProduct.variations = variations;

    console.log(`✓ Generated ${variations.length} variations`);
    this.saveProduct(baseProduct);

    return baseProduct;
  }

  /**
   * Set pricing tiers for volume discounts
   *
   * @param product - Product to add pricing tiers to
   * @param tiers - Pricing tier configuration
   * @returns Product with pricing tiers
   */
  setPricingTiers(
    product: BaseProduct & { pricingTiers?: PricingTier[] },
    tiers: Array<{
      minQuantity: number;
      maxQuantity?: number;
      discountType: 'fixed' | 'percentage';
      discountValue: number;
    }>
  ): BaseProduct & { pricingTiers: PricingTier[] } {
    console.log(`💰 Setting pricing tiers for: ${product.name}`);

    const pricingTiers: PricingTier[] = tiers.map(tier => {
      const discountedPrice = tier.discountType === 'fixed'
        ? product.price - tier.discountValue
        : product.price * (1 - tier.discountValue / 100);

      return {
        minQuantity: tier.minQuantity,
        maxQuantity: tier.maxQuantity,
        price: discountedPrice,
        discountType: tier.discountType,
        discountValue: tier.discountValue
      };
    });

    // Sort by minQuantity
    pricingTiers.sort((a, b) => a.minQuantity - b.minQuantity);

    const productWithTiers = {
      ...product,
      pricingTiers
    };

    console.log(`✓ Added ${pricingTiers.length} pricing tiers`);
    this.saveProduct(productWithTiers);

    return productWithTiers;
  }

  /**
   * Create a product bundle
   *
   * @param options - Bundle options
   * @returns Complete product bundle
   */
  createBundles(options: {
    name: string;
    description: string;
    products: Array<{
      product: BaseProduct;
      quantity: number;
      variationId?: string;
      optional?: boolean;
    }>;
    discountPercentage: number;
    images?: string[];
    limitedTime?: { startDate: Date; endDate: Date };
  }): ProductBundle {
    console.log(`📦 Creating bundle: ${options.name}`);

    // Calculate pricing
    let totalPrice = 0;
    const bundleItems: BundleItem[] = [];

    options.products.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalPrice += itemPrice;

      bundleItems.push({
        productId: item.product.id,
        quantity: item.quantity,
        variationId: item.variationId,
        optional: item.optional || false
      });
    });

    const bundlePrice = totalPrice * (1 - options.discountPercentage / 100);
    const savings = totalPrice - bundlePrice;
    const savingsPercentage = options.discountPercentage;

    const bundle: ProductBundle = {
      id: this.generateId(options.name),
      name: options.name,
      description: options.description,
      products: bundleItems,
      pricing: {
        totalPrice,
        bundlePrice,
        savings,
        savingsPercentage
      },
      images: options.images || options.products[0]?.product.images,
      active: true,
      limitedTime: options.limitedTime
    };

    this.saveBundle(bundle);

    console.log(`✓ Bundle created: Save ${savingsPercentage}% ($${savings.toFixed(2)})`);

    return bundle;
  }

  /**
   * Add reviews to product
   *
   * @param productId - Product ID
   * @param reviews - Product reviews
   * @returns Reviews with statistics
   */
  addReviews(productId: string, reviews: Omit<ProductReview, 'id' | 'productId'>[]): {
    reviews: ProductReview[];
    statistics: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<number, number>;
    };
  } {
    console.log(`⭐ Adding ${reviews.length} reviews to product: ${productId}`);

    const productReviews: ProductReview[] = reviews.map((review, index) => ({
      id: `${productId}-review-${index + 1}`,
      productId,
      ...review,
      helpful: review.helpful || 0,
      date: review.date || new Date()
    }));

    // Calculate statistics
    const totalReviews = productReviews.length;
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / totalReviews;

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    productReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const reviewData = {
      reviews: productReviews,
      statistics: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      }
    };

    this.saveReviews(productId, reviewData);

    console.log(`✓ Average rating: ${reviewData.statistics.averageRating}/5 (${totalReviews} reviews)`);

    return reviewData;
  }

  /**
   * Generate product JSON-LD schema
   *
   * @param product - Product data
   * @param reviews - Optional review data
   * @returns Schema.org JSON-LD
   */
  generateProductSchema(
    product: BaseProduct,
    reviews?: {
      averageRating: number;
      totalReviews: number;
    }
  ): any {
    const schema = this.seo.generateSchema('Product', {
      name: product.name,
      description: product.description,
      image: product.images,
      sku: (product as any).sku || product.id,
      brand: {
        '@type': 'Brand',
        name: 'Your Brand Name'
      },
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency,
        availability: product.active
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `https://example.com/products/${product.id}`
      },
      ...(reviews && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: reviews.averageRating.toString(),
          reviewCount: reviews.totalReviews.toString()
        }
      })
    });

    return schema;
  }

  /**
   * Export product to JSON
   *
   * @param product - Product to export
   * @returns JSON string
   */
  exportToJSON(product: BaseProduct): string {
    return JSON.stringify(product, null, 2);
  }

  /**
   * Export product to CSV
   *
   * @param products - Products to export
   * @returns CSV string
   */
  exportToCSV(products: BaseProduct[]): string {
    if (products.length === 0) return '';

    const headers = ['id', 'name', 'type', 'price', 'currency', 'category', 'active'];
    const rows = products.map(p => [
      p.id,
      p.name,
      (p as any).type || 'physical',
      p.price,
      p.currency,
      p.category,
      p.active ? 'true' : 'false'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csv;
  }

  // ==================== Private Helper Methods ====================

  private generateId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  private generateShortDescription(description: string): string {
    return description.length > 160
      ? description.substring(0, 157) + '...'
      : description;
  }

  private extractTags(description: string): string[] {
    // Simple tag extraction based on common keywords
    const keywords = ['premium', 'luxury', 'eco-friendly', 'smart', 'portable', 'professional'];
    const lowerDesc = description.toLowerCase();

    return keywords.filter(keyword => lowerDesc.includes(keyword));
  }

  private determineShippingClass(weight: number): string {
    if (weight < 1) return 'light';
    if (weight < 5) return 'standard';
    if (weight < 20) return 'heavy';
    return 'oversized';
  }

  private extractFileType(fileUrl?: string): string | undefined {
    if (!fileUrl) return undefined;

    const extension = fileUrl.split('.').pop()?.toLowerCase();
    return extension;
  }

  private getDefaultAvailability(): any {
    const standardHours: TimeSlot[] = [
      { start: '09:00', end: '17:00' }
    ];

    return {
      monday: standardHours,
      tuesday: standardHours,
      wednesday: standardHours,
      thursday: standardHours,
      friday: standardHours
    };
  }

  private getDeliveryMethods(location: string): string[] {
    const methods: Record<string, string[]> = {
      online: ['Video Call', 'Chat', 'Email'],
      'on-site': ['In-Person'],
      'client-location': ['On-site Visit', 'Home Service']
    };

    return methods[location] || ['Standard'];
  }

  private generateCombinations(
    attributes: Array<{
      name: string;
      values: Array<{
        value: string;
        priceModifier?: number;
        skuSuffix?: string;
        inventory?: number;
      }>;
    }>
  ): Array<Array<{
    name: string;
    value: string;
    priceModifier?: number;
    skuSuffix?: string;
    inventory?: number;
  }>> {
    if (attributes.length === 0) return [[]];

    const [first, ...rest] = attributes;
    const restCombinations = this.generateCombinations(rest);

    const combinations: any[] = [];

    first.values.forEach(value => {
      restCombinations.forEach(combo => {
        combinations.push([
          {
            name: first.name,
            ...value
          },
          ...combo
        ]);
      });
    });

    return combinations;
  }

  private saveProduct(product: any): void {
    const filepath = path.join(this.outputDir, `${product.id}.json`);
    fs.writeFileSync(filepath, JSON.stringify(product, null, 2), 'utf-8');
    console.log(`✓ Saved product: ${filepath}`);
  }

  private saveBundle(bundle: ProductBundle): void {
    const filepath = path.join(this.outputDir, `bundle-${bundle.id}.json`);
    fs.writeFileSync(filepath, JSON.stringify(bundle, null, 2), 'utf-8');
    console.log(`✓ Saved bundle: ${filepath}`);
  }

  private saveReviews(productId: string, reviewData: any): void {
    const filepath = path.join(this.outputDir, `${productId}-reviews.json`);
    fs.writeFileSync(filepath, JSON.stringify(reviewData, null, 2), 'utf-8');
    console.log(`✓ Saved reviews: ${filepath}`);
  }
}

/**
 * Export singleton instance getter
 */
export function getProductTemplate(outputDir?: string): ProductTemplate {
  return new ProductTemplate(outputDir);
}
