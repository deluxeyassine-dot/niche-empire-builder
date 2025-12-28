/**
 * Test file for ProductTemplate
 * Run this to generate different product types
 */

import * as dotenv from 'dotenv';
import { getProductTemplate, PhysicalProduct, DigitalProduct, ServiceProduct } from './templates/products/ProductTemplate';

// Load environment variables
dotenv.config();

async function testProductTemplate() {
  console.log('='.repeat(70));
  console.log('📦 Testing ProductTemplate - Product Generator');
  console.log('='.repeat(70));

  try {
    const template = getProductTemplate();

    // Test 1: Create Physical Product
    console.log('\n📦 Test 1: Creating Physical Product...');

    const physicalProduct = template.createPhysicalProduct({
      name: 'SmartGuard Pro Security Camera',
      description: 'Professional 4K security camera with AI-powered motion detection, night vision, and cloud storage. Features advanced facial recognition, two-way audio, and weather-resistant housing for indoor and outdoor use.',
      price: 199.99,
      sku: 'SGP-CAM-001',
      weight: 0.5,
      dimensions: {
        length: 12,
        width: 8,
        height: 8
      },
      inventory: 150,
      category: 'Security',
      images: [
        'https://example.com/images/camera-1.jpg',
        'https://example.com/images/camera-2.jpg',
        'https://example.com/images/camera-3.jpg'
      ],
      features: [
        '4K Ultra HD resolution',
        'AI-powered detection',
        'Night vision up to 100ft',
        'Two-way audio'
      ],
      specifications: {
        'Resolution': '4K (3840x2160)',
        'Field of View': '130 degrees',
        'Storage': 'Cloud + Local SD',
        'Power': '12V DC'
      }
    });

    console.log('✓ Physical Product Created:');
    console.log(`  ID: ${physicalProduct.id}`);
    console.log(`  SKU: ${physicalProduct.sku}`);
    console.log(`  Price: $${physicalProduct.price}`);
    console.log(`  Inventory: ${physicalProduct.inventory.quantity} units`);
    console.log(`  Shipping: ${physicalProduct.shipping.weight}${physicalProduct.shipping.weightUnit}`);
    console.log(`  Class: ${physicalProduct.shipping.shippingClass}`);

    // Test 2: Generate Product Variations
    console.log('\n🎨 Test 2: Generating Product Variations...');

    const productWithVariations = template.generateVariations(physicalProduct, {
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

    console.log(`✓ Generated ${productWithVariations.variations?.length} variations:`);
    productWithVariations.variations?.slice(0, 3).forEach(v => {
      console.log(`  - ${v.name}: ${v.sku} ($${v.price})`);
      console.log(`    Attributes: ${JSON.stringify(v.attributes)}`);
    });

    // Test 3: Set Pricing Tiers
    console.log('\n💰 Test 3: Setting Pricing Tiers...');

    const productWithTiers = template.setPricingTiers(physicalProduct, [
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
        discountValue: 10
      },
      {
        minQuantity: 50,
        maxQuantity: 99,
        discountType: 'percentage',
        discountValue: 15
      },
      {
        minQuantity: 100,
        discountType: 'percentage',
        discountValue: 20
      }
    ]);

    console.log('✓ Pricing Tiers Created:');
    productWithTiers.pricingTiers?.forEach(tier => {
      console.log(`  ${tier.minQuantity}-${tier.maxQuantity || '∞'} units: $${tier.price.toFixed(2)} (${tier.discountValue}% off)`);
    });

    // Test 4: Create Digital Product
    console.log('\n💾 Test 4: Creating Digital Product...');

    const digitalProduct = template.createDigitalProduct({
      name: 'Smart Home Automation Software Pro',
      description: 'Complete home automation software suite with AI scheduling, energy optimization, and cross-device synchronization. Includes mobile apps for iOS and Android.',
      price: 149.99,
      category: 'Software',
      images: [
        'https://example.com/images/software-1.jpg',
        'https://example.com/images/software-2.jpg'
      ],
      fileUrl: 'https://example.com/downloads/smarthome-pro-v2.zip',
      fileSize: 524288000, // 500 MB
      fileType: 'zip',
      licenseType: 'multi',
      version: '2.1.0',
      systemRequirements: [
        'Windows 10/11 or macOS 10.15+',
        '4GB RAM minimum',
        'Internet connection required',
        '1GB free disk space'
      ]
    });

    console.log('✓ Digital Product Created:');
    console.log(`  ID: ${digitalProduct.id}`);
    console.log(`  Version: ${digitalProduct.version}`);
    console.log(`  File Size: ${(digitalProduct.download.fileSize! / 1024 / 1024).toFixed(0)}MB`);
    console.log(`  License: ${digitalProduct.license?.type} (${digitalProduct.license?.seats} seats)`);
    console.log(`  Download Limit: ${digitalProduct.download.downloadLimit} times`);
    console.log(`  Expiry: ${digitalProduct.download.downloadExpiry} days`);

    // Test 5: Create Service Product
    console.log('\n🔧 Test 5: Creating Service Product...');

    const serviceProduct = template.createServiceProduct({
      name: 'Smart Home Installation Service',
      description: 'Professional installation and configuration of your smart home devices. Our certified technicians will set up cameras, sensors, and automation routines tailored to your needs.',
      price: 299.99,
      category: 'Services',
      images: [
        'https://example.com/images/installation-service.jpg'
      ],
      duration: 180, // 3 hours
      location: 'client-location',
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

    console.log('✓ Service Product Created:');
    console.log(`  ID: ${serviceProduct.id}`);
    console.log(`  Duration: ${serviceProduct.service.duration} minutes`);
    console.log(`  Location: ${serviceProduct.location}`);
    console.log(`  Booking Window: ${serviceProduct.service.bookingWindow.minAdvance}h - ${serviceProduct.service.bookingWindow.maxAdvance}d`);
    console.log(`  Delivery Methods: ${serviceProduct.deliveryMethod?.join(', ')}`);

    // Test 6: Create Product Bundle
    console.log('\n📦 Test 6: Creating Product Bundle...');

    const bundle = template.createBundles({
      name: 'Complete Smart Home Security Package',
      description: 'Everything you need for comprehensive home security. Includes 2 cameras, 1 smart lock, installation service, and 1-year software subscription.',
      products: [
        {
          product: physicalProduct,
          quantity: 2
        },
        {
          product: digitalProduct,
          quantity: 1
        },
        {
          product: serviceProduct,
          quantity: 1
        }
      ],
      discountPercentage: 20,
      images: [
        'https://example.com/images/bundle-security-package.jpg'
      ],
      limitedTime: {
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31')
      }
    });

    console.log('✓ Product Bundle Created:');
    console.log(`  ID: ${bundle.id}`);
    console.log(`  Products: ${bundle.products.length} items`);
    console.log(`  Total Value: $${bundle.pricing.totalPrice.toFixed(2)}`);
    console.log(`  Bundle Price: $${bundle.pricing.bundlePrice.toFixed(2)}`);
    console.log(`  You Save: $${bundle.pricing.savings.toFixed(2)} (${bundle.pricing.savingsPercentage}%)`);
    console.log(`  Limited Time: ${bundle.limitedTime?.startDate.toLocaleDateString()} - ${bundle.limitedTime?.endDate.toLocaleDateString()}`);

    // Test 7: Add Product Reviews
    console.log('\n⭐ Test 7: Adding Product Reviews...');

    const reviews = template.addReviews(physicalProduct.id, [
      {
        author: 'John Smith',
        rating: 5,
        title: 'Excellent camera!',
        comment: 'Crystal clear video quality, easy to install, and the AI detection works perfectly. Highly recommend!',
        verified: true,
        date: new Date('2024-12-15')
      },
      {
        author: 'Sarah Johnson',
        rating: 5,
        title: 'Best security camera',
        comment: 'Love the night vision and two-way audio. Feel much safer now.',
        verified: true,
        date: new Date('2024-12-10')
      },
      {
        author: 'Mike Chen',
        rating: 4,
        title: 'Great product',
        comment: 'Works well, setup was straightforward. Only wish the app was a bit more intuitive.',
        verified: true,
        date: new Date('2024-12-08')
      },
      {
        author: 'Emily Rodriguez',
        rating: 5,
        title: 'Perfect for home security',
        comment: 'The AI detection is amazing - no more false alerts from trees! Worth every penny.',
        verified: true,
        date: new Date('2024-12-05')
      },
      {
        author: 'David Lee',
        rating: 4,
        title: 'Solid choice',
        comment: 'Good quality camera. Installation was easy. Customer support was helpful.',
        verified: true,
        date: new Date('2024-12-01')
      }
    ]);

    console.log('✓ Reviews Added:');
    console.log(`  Total Reviews: ${reviews.statistics.totalReviews}`);
    console.log(`  Average Rating: ${reviews.statistics.averageRating}/5`);
    console.log(`  Rating Distribution:`);
    for (let i = 5; i >= 1; i--) {
      const count = reviews.statistics.ratingDistribution[i];
      const percentage = (count / reviews.statistics.totalReviews * 100).toFixed(0);
      const stars = '★'.repeat(i) + '☆'.repeat(5 - i);
      const bar = '█'.repeat(Math.floor(count / reviews.statistics.totalReviews * 20));
      console.log(`    ${stars} ${count} (${percentage}%) ${bar}`);
    }

    // Test 8: Generate Product Schema
    console.log('\n📋 Test 8: Generating Product Schema...');

    const schema = template.generateProductSchema(physicalProduct, reviews.statistics);

    console.log('✓ Schema.org Product Markup Generated:');
    console.log(`  Type: ${schema['@type']}`);
    console.log(`  Name: ${schema.name}`);
    console.log(`  Price: ${schema.offers.price} ${schema.offers.priceCurrency}`);
    console.log(`  Rating: ${schema.aggregateRating.ratingValue}/5`);
    console.log(`  Reviews: ${schema.aggregateRating.reviewCount}`);
    console.log(`  Preview: ${JSON.stringify(schema, null, 2).substring(0, 200)}...`);

    // Test 9: Export to JSON
    console.log('\n💾 Test 9: Exporting Products...');

    const jsonExport = template.exportToJSON(physicalProduct);
    console.log(`✓ JSON Export: ${jsonExport.length} characters`);

    const csvExport = template.exportToCSV([
      physicalProduct,
      digitalProduct,
      serviceProduct
    ]);
    console.log(`✓ CSV Export: ${csvExport.split('\n').length} rows`);
    console.log('  Preview:');
    console.log(csvExport.split('\n').slice(0, 4).map(line => `    ${line}`).join('\n'));

    console.log('\n' + '='.repeat(70));
    console.log('✅ ProductTemplate Testing Complete!');
    console.log('='.repeat(70));

    console.log('\n📁 Generated Files (in ./generated-products/):');
    console.log('  • smart-guard-pro-security-camera.json - Physical product');
    console.log('  • smart-home-automation-software-pro.json - Digital product');
    console.log('  • smart-home-installation-service.json - Service product');
    console.log('  • bundle-complete-smart-home-security-package.json - Bundle');
    console.log('  • smart-guard-pro-security-camera-reviews.json - Reviews');

    console.log('\n📊 Product Summary:');
    console.log(`  Physical Products: 1 (${productWithVariations.variations?.length} variations)`);
    console.log(`  Digital Products: 1`);
    console.log(`  Service Products: 1`);
    console.log(`  Product Bundles: 1`);
    console.log(`  Total Reviews: ${reviews.statistics.totalReviews}`);
    console.log(`  Pricing Tiers: ${productWithTiers.pricingTiers?.length}`);

    console.log('\n🎯 Features Demonstrated:');
    console.log('  ✓ Physical product with inventory & shipping');
    console.log('  ✓ Product variations (color, storage)');
    console.log('  ✓ Volume pricing tiers (bulk discounts)');
    console.log('  ✓ Digital product with licensing');
    console.log('  ✓ Service product with scheduling');
    console.log('  ✓ Product bundles with savings');
    console.log('  ✓ Customer reviews & ratings');
    console.log('  ✓ Schema.org structured data');
    console.log('  ✓ JSON/CSV export');

    console.log('\n💡 Use Cases:');
    console.log('  • E-commerce product catalogs');
    console.log('  • Marketplace listings');
    console.log('  • Subscription services');
    console.log('  • Service booking systems');
    console.log('  • Digital downloads & licenses');
    console.log('  • Volume/wholesale pricing');
    console.log('  • Product bundles & packages');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testProductTemplate().catch(console.error);
}

export { testProductTemplate };
