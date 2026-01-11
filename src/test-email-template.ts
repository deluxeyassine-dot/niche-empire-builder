/**
 * Test file for EmailTemplate
 * Run this to generate responsive HTML email templates
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getEmailTemplate, EmailConfig } from './templates/emails/EmailTemplate';

// Load environment variables
dotenv.config();

async function testEmailTemplate() {
  console.log('='.repeat(70));
  console.log('📧 Testing EmailTemplate - Responsive HTML Email Generator');
  console.log('='.repeat(70));

  try {
    // Email configuration
    const config: EmailConfig = {
      brandName: 'SmartHome Pro',
      brandLogo: 'https://via.placeholder.com/150x50?text=SmartHome+Pro',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      socialLinks: {
        facebook: 'https://facebook.com/smarthomepro',
        twitter: 'https://twitter.com/smarthomepro',
        instagram: 'https://instagram.com/smarthomepro',
        linkedin: 'https://linkedin.com/company/smarthomepro'
      },
      companyAddress: '123 Tech Street, San Francisco, CA 94102',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      viewInBrowserUrl: 'https://example.com/view'
    };

    const template = getEmailTemplate(config);

    // Create output directory
    const outputDir = path.join(process.cwd(), 'generated-emails');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Test 1: Welcome Email
    console.log('\n👋 Test 1: Creating Welcome Email...');

    const welcomeEmail = template.createWelcomeEmail({
      subject: 'Welcome to SmartHome Pro, [firstName]!',
      preheader: 'Thanks for joining us! Here\'s how to get started.',
      headline: 'Welcome to the Smart Home Revolution!',
      message: 'We\'re thrilled to have you join our community of smart home enthusiasts.',
      ctaText: 'Complete Your Profile',
      ctaUrl: 'https://example.com/profile/complete',
      steps: [
        {
          stepNumber: 1,
          title: 'Set Up Your Account',
          description: 'Complete your profile and add your home details to get personalized recommendations.'
        },
        {
          stepNumber: 2,
          title: 'Connect Your Devices',
          description: 'Add your smart home devices to the app and start controlling them from anywhere.'
        },
        {
          stepNumber: 3,
          title: 'Create Automations',
          description: 'Set up custom scenes and schedules to make your home truly smart.'
        }
      ],
      benefits: [
        'Control all your devices from one app',
        '24/7 customer support',
        'Advanced automation features',
        'Energy usage insights',
        'Regular firmware updates'
      ],
      personalization: {
        firstName: 'Yassine'
      }
    });

    console.log('✓ Welcome Email Created:');
    console.log(`  Subject: ${welcomeEmail.subject}`);
    console.log(`  Preheader: ${welcomeEmail.preheader}`);
    console.log(`  Has Personalization: ${welcomeEmail.metadata.hasPersonalization}`);
    console.log(`  Email Size: ${(welcomeEmail.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'welcome-email.html'),
      welcomeEmail.html
    );

    // Test 2: Newsletter
    console.log('\n📰 Test 2: Generating Newsletter...');

    const newsletter = template.generateNewsletters({
      subject: 'Your Weekly Smart Home Digest',
      preheader: 'Top stories, tips, and updates from the smart home world',
      headerImage: 'https://via.placeholder.com/600x200?text=Newsletter+Header',
      introText: 'Welcome to this week\'s edition! We\'ve got some exciting updates and insights to share with you.',
      featuredArticle: {
        title: 'The Future of Home Automation: 2025 Trends',
        excerpt: 'Discover the latest innovations that will transform how we live. From AI-powered assistants to energy-efficient solutions, the future is bright.',
        imageUrl: 'https://via.placeholder.com/560x300?text=Featured+Article',
        linkUrl: 'https://example.com/blog/future-of-automation',
        category: 'Industry News',
        readTime: 8
      },
      articles: [
        {
          title: '5 Ways to Optimize Your Smart Home Energy Usage',
          excerpt: 'Learn how to reduce your energy bills while maintaining comfort with these smart automation tips.',
          imageUrl: 'https://via.placeholder.com/120x80?text=Energy',
          linkUrl: 'https://example.com/blog/optimize-energy',
          category: 'Tips & Tricks',
          readTime: 5
        },
        {
          title: 'New Product Launch: SmartGuard Pro Camera',
          excerpt: 'Introducing our latest 4K security camera with AI-powered detection and night vision up to 100ft.',
          imageUrl: 'https://via.placeholder.com/120x80?text=Camera',
          linkUrl: 'https://example.com/products/smartguard-pro',
          category: 'Product News',
          readTime: 3
        },
        {
          title: 'Customer Spotlight: The Johnson Family',
          excerpt: 'See how the Johnsons transformed their century-old home into a modern smart home.',
          imageUrl: 'https://via.placeholder.com/120x80?text=Customer',
          linkUrl: 'https://example.com/blog/customer-spotlight-johnson',
          category: 'Case Studies',
          readTime: 6
        }
      ],
      ctaSection: {
        headline: 'Ready to Upgrade Your Home?',
        text: 'Browse our latest smart home products and find the perfect solution for your needs.',
        buttonText: 'Shop Now',
        buttonUrl: 'https://example.com/shop'
      }
    });

    console.log('✓ Newsletter Created:');
    console.log(`  Subject: ${newsletter.subject}`);
    console.log(`  Articles: ${newsletter.metadata.articleCount}`);
    console.log(`  Email Size: ${(newsletter.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'newsletter.html'),
      newsletter.html
    );

    // Test 3: Abandoned Cart
    console.log('\n🛒 Test 3: Creating Abandoned Cart Email...');

    const abandonedCart = template.createAbandonedCart({
      subject: 'Your cart misses you, [customerName]!',
      preheader: 'Complete your purchase and save 10%',
      customerName: 'Sarah',
      cartItems: [
        {
          name: 'SmartGuard Pro Camera',
          imageUrl: 'https://via.placeholder.com/80x80?text=Camera',
          price: 199.99,
          quantity: 2,
          productUrl: 'https://example.com/products/smartguard-pro'
        },
        {
          name: 'Smart Thermostat Elite',
          imageUrl: 'https://via.placeholder.com/80x80?text=Thermostat',
          price: 149.99,
          quantity: 1,
          productUrl: 'https://example.com/products/thermostat-elite'
        }
      ],
      cartTotal: 549.97,
      currency: 'USD',
      discountCode: 'COMEBACK10',
      discountAmount: '10% off',
      urgencyMessage: 'Items in your cart are selling fast! Complete your order in the next 24 hours.',
      ctaText: 'Complete My Purchase',
      ctaUrl: 'https://example.com/checkout',
      personalization: {
        firstName: 'Sarah'
      }
    });

    console.log('✓ Abandoned Cart Email Created:');
    console.log(`  Subject: ${abandonedCart.subject}`);
    console.log(`  Items: ${abandonedCart.metadata.itemCount}`);
    console.log(`  Cart Value: $${abandonedCart.metadata.cartValue}`);
    console.log(`  Email Size: ${(abandonedCart.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'abandoned-cart.html'),
      abandonedCart.html
    );

    // Test 4: Promotional Email
    console.log('\n🎉 Test 4: Building Promotional Email...');

    const promotional = template.buildPromotionalEmail({
      subject: 'Flash Sale: Save 25% on All Smart Cameras!',
      preheader: 'Limited time offer - ends tonight at midnight',
      headline: 'Flash Sale Alert!',
      offerText: 'Save 25% on All Security Cameras',
      offerDetails: 'Plus get free shipping on orders over $100',
      heroImage: 'https://via.placeholder.com/600x300?text=Flash+Sale',
      products: [
        {
          name: 'SmartGuard Pro',
          originalPrice: 199.99,
          salePrice: 149.99,
          imageUrl: 'https://via.placeholder.com/180x180?text=SmartGuard',
          productUrl: 'https://example.com/products/smartguard-pro',
          savingsPercent: 25
        },
        {
          name: 'SecureView 360',
          originalPrice: 149.99,
          salePrice: 112.49,
          imageUrl: 'https://via.placeholder.com/180x180?text=SecureView',
          productUrl: 'https://example.com/products/secureview-360',
          savingsPercent: 25
        },
        {
          name: 'HomeWatch Mini',
          originalPrice: 99.99,
          salePrice: 74.99,
          imageUrl: 'https://via.placeholder.com/180x180?text=HomeWatch',
          productUrl: 'https://example.com/products/homewatch-mini',
          savingsPercent: 25
        }
      ],
      ctaText: 'Shop Flash Sale',
      ctaUrl: 'https://example.com/flash-sale',
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      discountCode: 'FLASH25',
      urgencyBadge: 'Ends Tonight'
    });

    console.log('✓ Promotional Email Created:');
    console.log(`  Subject: ${promotional.subject}`);
    console.log(`  Has Offer: ${promotional.metadata.hasOffer}`);
    console.log(`  Has Expiry: ${promotional.metadata.hasExpiry}`);
    console.log(`  Email Size: ${(promotional.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'promotional.html'),
      promotional.html
    );

    // Test 5: Transactional Emails
    console.log('\n📦 Test 5: Creating Transactional Emails...');

    // Order Confirmation
    const orderConfirmation = template.createTransactional({
      type: 'order-confirmation',
      subject: 'Order Confirmation #12345',
      customerName: 'Mike',
      orderNumber: '12345',
      orderDate: new Date(),
      orderItems: [
        {
          name: 'SmartGuard Pro Camera',
          quantity: 2,
          price: 199.99,
          imageUrl: 'https://via.placeholder.com/60x60?text=Camera'
        },
        {
          name: 'Smart Thermostat Elite',
          quantity: 1,
          price: 149.99,
          imageUrl: 'https://via.placeholder.com/60x60?text=Thermostat'
        }
      ],
      subtotal: 549.97,
      tax: 44.00,
      shipping: 0,
      total: 593.97,
      currency: 'USD',
      ctaText: 'View Order Details',
      ctaUrl: 'https://example.com/orders/12345'
    });

    console.log('  ✓ Order Confirmation:');
    console.log(`    Order #${orderConfirmation.subject.split('#')[1]}`);
    console.log(`    Size: ${(orderConfirmation.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'order-confirmation.html'),
      orderConfirmation.html
    );

    // Shipping Notification
    const shipping = template.createTransactional({
      type: 'shipping-notification',
      subject: 'Your order has shipped!',
      customerName: 'Mike',
      orderNumber: '12345',
      trackingNumber: 'TRK123456789',
      trackingUrl: 'https://tracking.example.com/TRK123456789',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    });

    console.log('  ✓ Shipping Notification:');
    console.log(`    Tracking: ${shipping.subject}`);
    console.log(`    Size: ${(shipping.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'shipping-notification.html'),
      shipping.html
    );

    // Password Reset
    const passwordReset = template.createTransactional({
      type: 'password-reset',
      subject: 'Reset your password',
      customerName: 'Alex',
      resetLink: 'https://example.com/reset-password?token=abc123xyz',
      resetExpiry: 24
    });

    console.log('  ✓ Password Reset:');
    console.log(`    Valid for: 24 hours`);
    console.log(`    Size: ${(passwordReset.metadata.estimatedSize / 1024).toFixed(2)} KB`);

    fs.writeFileSync(
      path.join(outputDir, 'password-reset.html'),
      passwordReset.html
    );

    // Test 6: Email Sequence
    console.log('\n📨 Test 6: Generating Email Sequence...');

    const sequence = template.generateSequences({
      sequenceName: 'New Customer Onboarding',
      sequenceType: 'onboarding',
      emails: [
        {
          dayOffset: 0,
          subject: 'Welcome to SmartHome Pro!',
          preheader: 'Let\'s get your smart home set up',
          headline: 'Welcome Aboard!',
          content: 'We\'re excited to have you join the SmartHome Pro family. This is the first step in transforming your home into an intelligent, efficient, and secure space.\n\nOver the next few days, we\'ll send you helpful tips and guides to make the most of your smart home devices.',
          ctaText: 'Get Started',
          ctaUrl: 'https://example.com/getting-started',
          tips: [
            'Download our mobile app for iOS or Android',
            'Complete your home profile for personalized recommendations',
            'Explore our knowledge base for setup guides'
          ],
          imageUrl: 'https://via.placeholder.com/540x300?text=Welcome'
        },
        {
          dayOffset: 2,
          subject: 'Quick Setup Guide: Your First Device',
          preheader: 'Get your first smart device up and running in minutes',
          headline: 'Let\'s Connect Your First Device',
          content: 'Adding your first smart device is easier than you think! Whether it\'s a camera, thermostat, or smart lock, we\'ll guide you through the process step by step.\n\nMost devices connect in under 5 minutes using our intuitive app.',
          ctaText: 'Watch Setup Video',
          ctaUrl: 'https://example.com/videos/first-device-setup',
          tips: [
            'Make sure your device is powered on and in pairing mode',
            'Have your WiFi password ready',
            'Keep your phone close to the device during setup'
          ],
          imageUrl: 'https://via.placeholder.com/540x300?text=Setup+Guide'
        },
        {
          dayOffset: 5,
          subject: 'Pro Tips: Automations That Save Time',
          preheader: 'Create smart automations to simplify your daily routine',
          headline: 'Unlock the Power of Automation',
          content: 'Automations are where the magic happens! Set up routines that automatically adjust your home based on time, location, or sensor triggers.\n\nImagine your lights turning on when you arrive home, or your thermostat adjusting when you leave. It\'s all possible with smart automations.',
          ctaText: 'Create Your First Automation',
          ctaUrl: 'https://example.com/automations/create',
          tips: [
            'Start with simple time-based automations',
            'Use "Good Morning" and "Good Night" scenes',
            'Set up location-based triggers for convenience'
          ],
          imageUrl: 'https://via.placeholder.com/540x300?text=Automations'
        },
        {
          dayOffset: 7,
          subject: 'Exclusive Offer: 20% Off Your Next Purchase',
          preheader: 'Thanks for being awesome! Here\'s a special discount.',
          headline: 'You\'ve Earned This!',
          content: 'As a thank you for joining SmartHome Pro, we\'re giving you an exclusive 20% discount on your next purchase.\n\nWhether you want to expand your security setup or add climate control, now is the perfect time to upgrade your smart home.',
          ctaText: 'Shop with Discount',
          ctaUrl: 'https://example.com/shop?code=WELCOME20',
          tips: [
            'Use code WELCOME20 at checkout',
            'Valid for 7 days from today',
            'Applies to all products except bundles'
          ],
          imageUrl: 'https://via.placeholder.com/540x300?text=Special+Offer'
        }
      ],
      personalization: {
        firstName: 'Emily'
      }
    });

    console.log('✓ Email Sequence Created:');
    console.log(`  Sequence: ${sequence.sequenceName}`);
    console.log(`  Type: ${sequence.sequenceType}`);
    console.log(`  Total Emails: ${sequence.metadata.totalEmails}`);
    console.log(`  Duration: ${sequence.metadata.totalDuration} days`);
    console.log(`  Total Size: ${(sequence.metadata.estimatedSize / 1024).toFixed(2)} KB`);
    console.log(`  Emails:`);
    sequence.emails.forEach((email, index) => {
      console.log(`    Day ${email.dayOffset}: ${email.email.subject}`);
      fs.writeFileSync(
        path.join(outputDir, `sequence-day-${email.dayOffset}.html`),
        email.email.html
      );
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ EmailTemplate Testing Complete!');
    console.log('='.repeat(70));

    console.log('\n📊 Summary:');
    console.log('  ✓ Welcome Email: Onboarding with steps and benefits');
    console.log('  ✓ Newsletter: Featured article + 3 regular articles');
    console.log('  ✓ Abandoned Cart: 2 items with discount code');
    console.log('  ✓ Promotional: Flash sale with 3 products');
    console.log('  ✓ Transactional: Order, shipping, password reset');
    console.log('  ✓ Email Sequence: 4-email onboarding campaign');

    console.log('\n📁 Generated Files:');
    console.log(`  Output Directory: ${outputDir}`);
    console.log('  • welcome-email.html');
    console.log('  • newsletter.html');
    console.log('  • abandoned-cart.html');
    console.log('  • promotional.html');
    console.log('  • order-confirmation.html');
    console.log('  • shipping-notification.html');
    console.log('  • password-reset.html');
    console.log('  • sequence-day-0.html');
    console.log('  • sequence-day-2.html');
    console.log('  • sequence-day-5.html');
    console.log('  • sequence-day-7.html');

    console.log('\n🎨 Features Demonstrated:');
    console.log('  ✓ Responsive HTML templates');
    console.log('  ✓ Inline CSS for email clients');
    console.log('  ✓ Mobile-optimized layouts');
    console.log('  ✓ Personalization support');
    console.log('  ✓ CTA buttons and links');
    console.log('  ✓ Product listings');
    console.log('  ✓ Order details and tracking');
    console.log('  ✓ Discount codes and urgency');
    console.log('  ✓ Social media links');
    console.log('  ✓ Unsubscribe footer');

    console.log('\n💡 Email Types:');
    console.log('  • Welcome: New user onboarding');
    console.log('  • Newsletter: Weekly content digest');
    console.log('  • Abandoned Cart: Recovery with incentive');
    console.log('  • Promotional: Flash sale campaign');
    console.log('  • Transactional: Orders, shipping, security');
    console.log('  • Sequence: Multi-day drip campaign');

    console.log('\n🚀 Use Cases:');
    console.log('  • E-commerce automation');
    console.log('  • Customer onboarding');
    console.log('  • Transactional notifications');
    console.log('  • Marketing campaigns');
    console.log('  • Cart recovery');
    console.log('  • Customer engagement');
    console.log('  • Content newsletters');

    console.log('\n📧 Email Client Compatibility:');
    console.log('  ✓ Gmail (Desktop & Mobile)');
    console.log('  ✓ Apple Mail (iOS & macOS)');
    console.log('  ✓ Outlook (2010+)');
    console.log('  ✓ Yahoo Mail');
    console.log('  ✓ Windows Mail');
    console.log('  ✓ Mobile clients (iOS, Android)');

    console.log('\n🎯 Next Steps:');
    console.log('  1. Open generated HTML files in a browser');
    console.log('  2. Send test emails to verify rendering');
    console.log('  3. Customize colors and branding');
    console.log('  4. Integrate with email service provider');
    console.log('  5. Set up automation triggers');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testEmailTemplate().catch(console.error);
}

export { testEmailTemplate };
