# ProductTemplate - Complete Product Management Guide

## Overview

The ProductTemplate is a comprehensive TypeScript utility for creating and managing different types of e-commerce products. It provides a robust, type-safe system for physical products, digital downloads, and services with advanced features like variations, pricing tiers, and product bundles.

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Product Types](#product-types)
4. [Core Features](#core-features)
5. [Advanced Usage](#advanced-usage)
6. [Best Practices](#best-practices)
7. [API Reference](#api-reference)
8. [Examples](#examples)

## Installation

```bash
npm install dotenv
```

## Quick Start

```typescript
import { getProductTemplate } from './templates/products/ProductTemplate';

const template = getProductTemplate();

// Create a simple physical product
const product = template.createPhysicalProduct({
  name: 'Smart Camera Pro',
  description: '4K security camera with AI detection',
  price: 199.99,
  sku: 'CAM-001',
  weight: 0.5,
  dimensions: { length: 12, width: 8, height: 8 },
  inventory: 150,
  category: 'Security'
});

console.log(product);
```

## Product Types

### 1. Physical Products

Physical products require shipping and inventory management.

**Key Features:**
- SKU management
- Inventory tracking with low stock thresholds
- Shipping details (weight, dimensions)
- Backorder management
- Product variations (sizes, colors, etc.)

**Example:**
```typescript
const physicalProduct = template.createPhysicalProduct({
  name: 'Smart Lock Elite',
  description: 'Fingerprint and keypad smart lock',
  price: 249.99,
  sku: 'LOCK-001',
  weight: 1.2, // kg
  dimensions: {
    length: 15,
    width: 10,
    height: 5
  },
  inventory: 200,
  category: 'Security',
  images: [
    'https://example.com/lock-1.jpg',
    'https://example.com/lock-2.jpg'
  ],
  features: [
    'Fingerprint recognition',
    'Keypad entry',
    'Remote access',
    'Auto-lock feature'
  ],
  specifications: {
    'Battery Life': '12 months',
    'Material': 'Stainless steel',
    'Compatibility': 'Standard door sizes'
  }
});
```

**Output Structure:**
```typescript
{
  id: 'unique-uuid',
  type: 'physical',
  name: 'Smart Lock Elite',
  sku: 'LOCK-001',
  inventory: {
    quantity: 200,
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorders: false
  },
  shipping: {
    weight: 1.2,
    weightUnit: 'kg',
    dimensions: { length: 15, width: 10, height: 5 },
    dimensionUnit: 'cm',
    requiresShipping: true,
    shippingClass: 'standard'
  },
  // ... other properties
}
```

### 2. Digital Products

Digital products include software, e-books, music, videos, and other downloadable content.

**Key Features:**
- Download management (URL, file size, limits)
- License types (single, multi, unlimited)
- Version control
- System requirements
- Download expiry and limits

**Example:**
```typescript
const digitalProduct = template.createDigitalProduct({
  name: 'Smart Home Automation Software Pro',
  description: 'Complete home automation suite',
  price: 149.99,
  category: 'Software',
  images: [
    'https://example.com/software-1.jpg'
  ],
  fileUrl: 'https://example.com/downloads/smarthome-pro-v2.zip',
  fileSize: 524288000, // 500 MB in bytes
  fileType: 'zip',
  licenseType: 'multi', // single, multi, or unlimited
  version: '2.1.0',
  systemRequirements: [
    'Windows 10/11 or macOS 10.15+',
    '4GB RAM minimum',
    'Internet connection required',
    '1GB free disk space'
  ]
});
```

**Output Structure:**
```typescript
{
  id: 'unique-uuid',
  type: 'digital',
  name: 'Smart Home Automation Software Pro',
  downloadable: true,
  download: {
    fileUrl: 'https://example.com/downloads/smarthome-pro-v2.zip',
    fileSize: 524288000,
    fileType: 'zip',
    downloadLimit: 5,
    downloadExpiry: 30 // days
  },
  license: {
    type: 'multi',
    seats: 3,
    duration: 365, // days
    allowTransfer: false
  },
  version: '2.1.0',
  // ... other properties
}
```

### 3. Service Products

Service products represent bookable services with scheduling capabilities.

**Key Features:**
- Duration management
- Availability schedules by day of week
- Booking windows (min/max advance booking)
- Location types (online, on-site, client location)
- Approval requirements
- Cancellation policies

**Example:**
```typescript
const serviceProduct = template.createServiceProduct({
  name: 'Smart Home Installation Service',
  description: 'Professional installation and configuration',
  price: 299.99,
  category: 'Services',
  images: [
    'https://example.com/installation-service.jpg'
  ],
  duration: 180, // minutes
  location: 'client-location', // 'online' | 'on-site' | 'client-location'
  availability: {
    monday: [{ start: '09:00', end: '17:00' }],
    tuesday: [{ start: '09:00', end: '17:00' }],
    wednesday: [{ start: '09:00', end: '17:00' }],
    thursday: [{ start: '09:00', end: '17:00' }],
    friday: [{ start: '09:00', end: '17:00' }],
    saturday: [{ start: '10:00', end: '14:00' }]
  },
  requiresApproval: true
});
```

**Output Structure:**
```typescript
{
  id: 'unique-uuid',
  type: 'service',
  name: 'Smart Home Installation Service',
  service: {
    duration: 180,
    bookingWindow: {
      minAdvance: 24, // hours
      maxAdvance: 90  // days
    },
    requiresApproval: true,
    cancellationPolicy: '24 hours notice required for full refund'
  },
  location: 'client-location',
  deliveryMethod: ['on-site'],
  // ... other properties
}
```

## Core Features

### 1. Product Variations

Create multiple variations of a product based on different attributes (color, size, storage, etc.).

**Example:**
```typescript
const baseProduct = template.createPhysicalProduct({
  name: 'Smart Camera Pro',
  price: 199.99,
  sku: 'CAM-001',
  // ... other properties
});

const productWithVariations = template.generateVariations(baseProduct, {
  attributes: [
    {
      name: 'color',
      values: [
        { value: 'White', skuSuffix: 'WHT' },
        { value: 'Black', skuSuffix: 'BLK' },
        { value: 'Silver', skuSuffix: 'SLV', priceModifier: 10 }
      ]
    },
    {
      name: 'storage',
      values: [
        { value: '32GB', skuSuffix: '32GB' },
        { value: '64GB', skuSuffix: '64GB', priceModifier: 20 },
        { value: '128GB', skuSuffix: '128GB', priceModifier: 40 }
      ]
    }
  ]
});

// Results in 9 variations (3 colors × 3 storage options):
// CAM-001-WHT-32GB ($199.99)
// CAM-001-WHT-64GB ($219.99)
// CAM-001-WHT-128GB ($239.99)
// CAM-001-BLK-32GB ($199.99)
// ... and so on
```

**Variation Object:**
```typescript
{
  id: 'variation-uuid',
  name: 'Smart Camera Pro - White / 32GB',
  sku: 'CAM-001-WHT-32GB',
  price: 199.99,
  attributes: {
    color: 'White',
    storage: '32GB'
  },
  image: 'https://example.com/...',
  inStock: true
}
```

### 2. Pricing Tiers (Volume Discounts)

Set up bulk pricing for wholesale or volume purchases.

**Example:**
```typescript
const productWithTiers = template.setPricingTiers(product, [
  {
    minQuantity: 1,
    maxQuantity: 9,
    discountType: 'fixed',
    discountValue: 0
  },
  {
    minQuantity: 10,
    maxQuantity: 49,
    discountType: 'percentage',
    discountValue: 10 // 10% off
  },
  {
    minQuantity: 50,
    maxQuantity: 99,
    discountType: 'percentage',
    discountValue: 15 // 15% off
  },
  {
    minQuantity: 100,
    discountType: 'percentage',
    discountValue: 20 // 20% off
  }
]);
```

**Result:**
```typescript
{
  ...product,
  pricingTiers: [
    { minQuantity: 1, maxQuantity: 9, price: 199.99, discountValue: 0 },
    { minQuantity: 10, maxQuantity: 49, price: 179.99, discountValue: 10 },
    { minQuantity: 50, maxQuantity: 99, price: 169.99, discountValue: 15 },
    { minQuantity: 100, price: 159.99, discountValue: 20 }
  ]
}
```

### 3. Product Bundles

Create package deals with multiple products at a discounted price.

**Example:**
```typescript
const bundle = template.createBundles({
  name: 'Complete Smart Home Security Package',
  description: 'Everything you need for comprehensive home security',
  products: [
    {
      product: smartCamera,
      quantity: 2
    },
    {
      product: smartLock,
      quantity: 1
    },
    {
      product: installationService,
      quantity: 1
    }
  ],
  discountPercentage: 20,
  images: [
    'https://example.com/bundle-security-package.jpg'
  ],
  limitedTime: {
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31')
  }
});
```

**Bundle Structure:**
```typescript
{
  id: 'bundle-uuid',
  type: 'bundle',
  name: 'Complete Smart Home Security Package',
  products: [
    { product: {...}, quantity: 2 },
    { product: {...}, quantity: 1 },
    { product: {...}, quantity: 1 }
  ],
  pricing: {
    totalPrice: 949.97,      // Sum of all products
    bundlePrice: 759.98,     // After 20% discount
    savings: 189.99,         // Amount saved
    savingsPercentage: 20
  },
  limitedTime: {
    startDate: Date,
    endDate: Date
  }
}
```

### 4. Customer Reviews

Add and manage customer reviews with automatic statistics calculation.

**Example:**
```typescript
const reviews = template.addReviews(product.id, [
  {
    author: 'John Smith',
    rating: 5,
    title: 'Excellent camera!',
    comment: 'Crystal clear video quality, easy to install.',
    verified: true,
    date: new Date('2024-12-15')
  },
  {
    author: 'Sarah Johnson',
    rating: 5,
    title: 'Best security camera',
    comment: 'Love the night vision and two-way audio.',
    verified: true,
    date: new Date('2024-12-10')
  },
  {
    author: 'Mike Chen',
    rating: 4,
    title: 'Great product',
    comment: 'Works well, setup was straightforward.',
    verified: true,
    date: new Date('2024-12-08')
  }
]);
```

**Review Statistics:**
```typescript
{
  productId: 'product-uuid',
  reviews: [...],
  statistics: {
    totalReviews: 3,
    averageRating: 4.67,
    ratingDistribution: {
      5: 2,  // Two 5-star reviews
      4: 1,  // One 4-star review
      3: 0,
      2: 0,
      1: 0
    },
    verifiedPurchases: 3,
    recommendationRate: 100
  }
}
```

### 5. Schema.org Structured Data

Generate SEO-friendly Schema.org markup for products.

**Example:**
```typescript
const schema = template.generateProductSchema(product, reviewStatistics);
```

**Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Smart Camera Pro",
  "description": "4K security camera with AI detection",
  "sku": "CAM-001",
  "image": ["https://example.com/camera-1.jpg"],
  "brand": {
    "@type": "Brand",
    "name": "SmartHome Pro"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/smart-camera-pro",
    "priceCurrency": "USD",
    "price": "199.99",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "524"
  }
}
```

### 6. Export Functions

Export products to JSON or CSV formats.

**JSON Export:**
```typescript
const json = template.exportToJSON(product);
// Returns formatted JSON string
```

**CSV Export:**
```typescript
const csv = template.exportToCSV([
  physicalProduct,
  digitalProduct,
  serviceProduct
]);

// Returns CSV with headers:
// id,type,name,sku,price,category,inStock,...
```

## Advanced Usage

### Complete Product Creation Workflow

```typescript
import { getProductTemplate } from './templates/products/ProductTemplate';

const template = getProductTemplate();

// 1. Create base product
const baseProduct = template.createPhysicalProduct({
  name: 'Smart Thermostat Pro',
  description: 'AI-powered climate control',
  price: 149.99,
  sku: 'THERM-001',
  weight: 0.3,
  dimensions: { length: 10, width: 10, height: 3 },
  inventory: 500,
  category: 'Climate Control',
  images: ['https://example.com/thermostat.jpg'],
  features: [
    'AI learning',
    'Energy saving',
    'Voice control',
    'Remote access'
  ]
});

// 2. Add variations
const withVariations = template.generateVariations(baseProduct, {
  attributes: [
    {
      name: 'color',
      values: [
        { value: 'White', skuSuffix: 'WHT' },
        { value: 'Black', skuSuffix: 'BLK' }
      ]
    }
  ]
});

// 3. Set pricing tiers
const withPricing = template.setPricingTiers(withVariations, [
  { minQuantity: 10, discountType: 'percentage', discountValue: 10 },
  { minQuantity: 50, discountType: 'percentage', discountValue: 20 }
]);

// 4. Add reviews
const reviews = template.addReviews(withPricing.id, [
  {
    author: 'Customer 1',
    rating: 5,
    title: 'Amazing!',
    comment: 'Saved me 30% on energy bills',
    verified: true,
    date: new Date()
  }
]);

// 5. Generate schema
const schema = template.generateProductSchema(withPricing, reviews.statistics);

// 6. Export
const json = template.exportToJSON(withPricing);
```

### Creating a Complete Product Catalog

```typescript
const products = {
  physical: template.createPhysicalProduct({...}),
  digital: template.createDigitalProduct({...}),
  service: template.createServiceProduct({...})
};

// Create a super bundle
const megaBundle = template.createBundles({
  name: 'Ultimate Smart Home Package',
  products: [
    { product: products.physical, quantity: 3 },
    { product: products.digital, quantity: 1 },
    { product: products.service, quantity: 1 }
  ],
  discountPercentage: 25
});

// Export entire catalog
const catalogCSV = template.exportToCSV([
  products.physical,
  products.digital,
  products.service
]);
```

## Best Practices

### 1. Inventory Management

```typescript
// Set appropriate low stock thresholds
const product = template.createPhysicalProduct({
  inventory: 100,
  // lowStockThreshold defaults to 10
  // Consider setting based on sales velocity
});

// For fast-moving products:
product.inventory.lowStockThreshold = 50;

// For slow-moving products:
product.inventory.lowStockThreshold = 5;
```

### 2. SKU Conventions

```typescript
// Use consistent SKU patterns:
// Category-Product-Variant
// Examples:
// CAM-001-WHT-64GB (Camera, Model 001, White, 64GB)
// LOCK-PRO-BLK (Lock, Pro model, Black)
// THERM-STD-SLV (Thermostat, Standard, Silver)
```

### 3. Pricing Strategy

```typescript
// Set competitive pricing tiers
const tiers = [
  { minQuantity: 1, maxQuantity: 9, discountValue: 0 },    // Retail
  { minQuantity: 10, maxQuantity: 49, discountValue: 10 }, // Small business
  { minQuantity: 50, maxQuantity: 99, discountValue: 15 }, // Wholesale
  { minQuantity: 100, discountValue: 20 }                  // Volume
];
```

### 4. Product Variations

```typescript
// Order attributes from most to least important
const variations = template.generateVariations(product, {
  attributes: [
    { name: 'size', values: [...] },      // Most important
    { name: 'color', values: [...] },     // Second
    { name: 'material', values: [...] }   // Least important
  ]
});
```

### 5. Digital Products

```typescript
// Set reasonable download limits and expiry
const digital = template.createDigitalProduct({
  // ...
  fileUrl: 'secure-download-link',
  downloadLimit: 5,     // Prevent abuse
  downloadExpiry: 30,   // 30 days
  licenseType: 'single' // Clear licensing
});
```

### 6. Service Scheduling

```typescript
// Set realistic booking windows
const service = template.createServiceProduct({
  // ...
  duration: 120,
  availability: {
    // Only set hours you can fulfill
    monday: [{ start: '09:00', end: '17:00' }]
  },
  requiresApproval: true // For custom services
});
```

## API Reference

### `getProductTemplate()`

Returns a new ProductTemplate instance.

```typescript
const template = getProductTemplate();
```

### `createPhysicalProduct(options)`

Creates a physical product with inventory and shipping.

**Parameters:**
- `name` (string, required): Product name
- `description` (string, required): Product description
- `price` (number, required): Product price
- `sku` (string, required): Stock Keeping Unit
- `weight` (number, required): Weight in kg
- `dimensions` (object, required): Length, width, height in cm
- `inventory` (number, required): Initial stock quantity
- `category` (string, required): Product category
- `images` (string[], optional): Image URLs
- `features` (string[], optional): Feature list
- `specifications` (object, optional): Key-value specs

**Returns:** `PhysicalProduct` object

### `createDigitalProduct(options)`

Creates a digital/downloadable product.

**Parameters:**
- `name` (string, required): Product name
- `description` (string, required): Product description
- `price` (number, required): Product price
- `category` (string, required): Product category
- `fileUrl` (string, optional): Download URL
- `fileSize` (number, optional): File size in bytes
- `fileType` (string, optional): File extension
- `licenseType` (string, optional): 'single', 'multi', or 'unlimited'
- `version` (string, optional): Version number
- `systemRequirements` (string[], optional): System requirements

**Returns:** `DigitalProduct` object

### `createServiceProduct(options)`

Creates a bookable service product.

**Parameters:**
- `name` (string, required): Service name
- `description` (string, required): Service description
- `price` (number, required): Service price
- `category` (string, required): Service category
- `duration` (number, required): Duration in minutes
- `location` (string, optional): 'online', 'on-site', or 'client-location'
- `availability` (object, optional): Weekly availability schedule
- `requiresApproval` (boolean, optional): Requires manual approval

**Returns:** `ServiceProduct` object

### `generateVariations(product, options)`

Generates all possible variations from attributes.

**Parameters:**
- `product` (PhysicalProduct, required): Base product
- `options.attributes` (array, required): Array of attribute definitions

**Returns:** Product with `variations` array

### `setPricingTiers(product, tiers)`

Adds volume pricing to a product.

**Parameters:**
- `product` (BaseProduct, required): Any product type
- `tiers` (array, required): Array of pricing tier definitions

**Returns:** Product with `pricingTiers` array

### `createBundles(options)`

Creates a product bundle with multiple items.

**Parameters:**
- `name` (string, required): Bundle name
- `description` (string, required): Bundle description
- `products` (array, required): Array of {product, quantity} objects
- `discountPercentage` (number, required): Discount percentage (0-100)
- `images` (string[], optional): Bundle images
- `limitedTime` (object, optional): {startDate, endDate}

**Returns:** `ProductBundle` object

### `addReviews(productId, reviews)`

Adds reviews and calculates statistics.

**Parameters:**
- `productId` (string, required): Product UUID
- `reviews` (array, required): Array of review objects

**Returns:** Object with reviews and statistics

### `generateProductSchema(product, reviewStats)`

Generates Schema.org JSON-LD markup.

**Parameters:**
- `product` (BaseProduct, required): Any product type
- `reviewStats` (object, optional): Review statistics

**Returns:** Schema.org JSON object

### `exportToJSON(product)`

Exports product to JSON string.

**Parameters:**
- `product` (BaseProduct, required): Any product type

**Returns:** Formatted JSON string

### `exportToCSV(products)`

Exports products to CSV format.

**Parameters:**
- `products` (array, required): Array of products

**Returns:** CSV string with headers

## Examples

### Example 1: Simple Product

```typescript
const camera = template.createPhysicalProduct({
  name: 'Basic Security Camera',
  description: '1080p HD camera',
  price: 79.99,
  sku: 'CAM-BASIC',
  weight: 0.3,
  dimensions: { length: 10, width: 8, height: 8 },
  inventory: 1000,
  category: 'Security'
});
```

### Example 2: Product with Variations

```typescript
const tshirt = template.createPhysicalProduct({
  name: 'Smart Home T-Shirt',
  description: 'Premium cotton t-shirt',
  price: 29.99,
  sku: 'SHIRT-001',
  weight: 0.2,
  dimensions: { length: 30, width: 40, height: 1 },
  inventory: 500,
  category: 'Apparel'
});

const withSizes = template.generateVariations(tshirt, {
  attributes: [
    {
      name: 'size',
      values: [
        { value: 'S', skuSuffix: 'S' },
        { value: 'M', skuSuffix: 'M' },
        { value: 'L', skuSuffix: 'L' },
        { value: 'XL', skuSuffix: 'XL', priceModifier: 2 }
      ]
    },
    {
      name: 'color',
      values: [
        { value: 'Black', skuSuffix: 'BLK' },
        { value: 'White', skuSuffix: 'WHT' },
        { value: 'Navy', skuSuffix: 'NVY' }
      ]
    }
  ]
});
// Results in 12 variations (4 sizes × 3 colors)
```

### Example 3: Software Product

```typescript
const software = template.createDigitalProduct({
  name: 'Home Automation Pro',
  description: 'Professional home automation software',
  price: 299.99,
  category: 'Software',
  fileUrl: 'https://downloads.example.com/ha-pro-v3.zip',
  fileSize: 1073741824, // 1 GB
  fileType: 'zip',
  licenseType: 'multi',
  version: '3.0.0',
  systemRequirements: [
    'Windows 10/11, macOS 11+, or Linux',
    '8GB RAM',
    '2GB free space',
    'Internet required'
  ]
});
```

### Example 4: Service with Scheduling

```typescript
const consultation = template.createServiceProduct({
  name: 'Smart Home Consultation',
  description: '1-hour expert consultation',
  price: 99.99,
  category: 'Consultation',
  duration: 60,
  location: 'online',
  availability: {
    monday: [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' }
    ],
    wednesday: [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' }
    ],
    friday: [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' }
    ]
  },
  requiresApproval: false
});
```

### Example 5: Bundle Deal

```typescript
const starterKit = template.createBundles({
  name: 'Smart Home Starter Kit',
  description: 'Get started with smart home automation',
  products: [
    { product: smartCamera, quantity: 1 },
    { product: smartLock, quantity: 1 },
    { product: smartThermostat, quantity: 1 },
    { product: software, quantity: 1 }
  ],
  discountPercentage: 15,
  images: ['https://example.com/starter-kit.jpg'],
  limitedTime: {
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31')
  }
});

console.log(`Save $${starterKit.pricing.savings}!`);
```

## Testing

Run the comprehensive test suite:

```bash
npx ts-node src/test-product-template.ts
```

The test demonstrates:
- Physical product creation
- Variation generation
- Pricing tiers
- Digital product
- Service product
- Bundle creation
- Review system
- Schema generation
- Export functionality

## Support

For questions or issues:
- Check the main README: `/src/utils/README.md`
- Review test file: `/src/test-product-template.ts`
- Check templates: `/src/templates/products/`

## License

Part of the Niche Empire Builder toolkit.
