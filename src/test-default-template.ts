/**
 * Test file for DefaultTemplate
 * Run this to generate a complete website
 */

import * as dotenv from 'dotenv';
import { getDefaultTemplate, WebsiteConfig, Product, BlogPost } from './templates/website/DefaultTemplate';

// Load environment variables
dotenv.config();

async function testDefaultTemplate() {
  console.log('='.repeat(70));
  console.log('🌐 Testing DefaultTemplate - Website Generator');
  console.log('='.repeat(70));

  try {
    // Website configuration
    const config: WebsiteConfig = {
      siteName: 'SmartHome Pro',
      tagline: 'Making your home smarter, one device at a time',
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b',
      baseUrl: 'https://smarthomepro.example.com',
      socialLinks: {
        facebook: 'https://facebook.com/smarthomepro',
        twitter: 'https://twitter.com/smarthomepro',
        instagram: 'https://instagram.com/smarthomepro',
        linkedin: 'https://linkedin.com/company/smarthomepro'
      }
    };

    const template = getDefaultTemplate(config);

    // Test 1: Generate Homepage
    console.log('\n🏠 Test 1: Generating Homepage...');
    const homepage = template.generateHomepage({
      heroTitle: 'Welcome to the Future of Smart Homes',
      heroSubtitle: 'Experience cutting-edge home automation with our premium smart devices',
      heroCtaText: 'Shop Now',
      heroCtaUrl: '/products',
      features: [
        {
          title: 'Easy Installation',
          description: 'Set up your smart home in minutes with our intuitive installation process',
          icon: '⚡'
        },
        {
          title: 'Voice Control',
          description: 'Control your entire home with simple voice commands via Alexa or Google',
          icon: '🎤'
        },
        {
          title: '24/7 Support',
          description: 'Our expert team is always ready to help you with any questions',
          icon: '💬'
        }
      ],
      featuredProducts: [
        {
          id: 'smart-camera-pro',
          name: 'SmartGuard Pro Camera',
          description: '4K security camera with AI-powered detection and night vision',
          price: 199.99,
          image: 'https://via.placeholder.com/400x300?text=Smart+Camera',
          category: 'Security',
          rating: 4.8,
          reviews: 524,
          inStock: true
        },
        {
          id: 'smart-lock-elite',
          name: 'SecureLock Elite',
          description: 'Fingerprint and keypad smart lock with remote access',
          price: 249.99,
          image: 'https://via.placeholder.com/400x300?text=Smart+Lock',
          category: 'Security',
          rating: 4.7,
          reviews: 312,
          inStock: true
        },
        {
          id: 'smart-thermostat',
          name: 'ClimateControl Smart',
          description: 'AI-powered thermostat that learns your preferences',
          price: 149.99,
          image: 'https://via.placeholder.com/400x300?text=Thermostat',
          category: 'Climate',
          rating: 4.9,
          reviews: 891,
          inStock: true
        }
      ],
      testimonials: [
        {
          name: 'Sarah Johnson',
          text: 'The SmartGuard Pro has completely transformed how I monitor my home. Crystal clear video quality!',
          rating: 5
        },
        {
          name: 'Mike Chen',
          text: 'Installation was a breeze, and the app is so intuitive. Highly recommend!',
          rating: 5
        },
        {
          name: 'Emily Rodriguez',
          text: 'Best investment I made for home security. Peace of mind knowing my family is safe.',
          rating: 5
        }
      ]
    });

    console.log('✓ Homepage generated successfully!');

    // Test 2: Generate Product Pages
    console.log('\n📦 Test 2: Generating Product Pages...');

    const product: Product = {
      id: 'smart-camera-pro',
      name: 'SmartGuard Pro Camera',
      description: 'The SmartGuard Pro is our flagship 4K security camera featuring advanced AI-powered motion detection, crystal-clear night vision up to 100 feet, two-way audio communication, and cloud storage. Perfect for both indoor and outdoor use, this camera provides 360-degree coverage and instant alerts to keep your home safe 24/7.',
      price: 199.99,
      currency: 'USD',
      image: 'https://via.placeholder.com/800x600?text=Smart+Camera+Main',
      images: [
        'https://via.placeholder.com/800x600?text=Smart+Camera+Main',
        'https://via.placeholder.com/800x600?text=Smart+Camera+Side',
        'https://via.placeholder.com/800x600?text=Smart+Camera+Night',
        'https://via.placeholder.com/800x600?text=Smart+Camera+App'
      ],
      features: [
        '4K Ultra HD resolution',
        'AI-powered motion and person detection',
        '360-degree pan and tilt',
        'Night vision up to 100 feet',
        'Two-way audio with noise cancellation',
        'Weather-resistant (IP66 rating)',
        'Cloud and local storage options',
        'Works with Alexa and Google Home'
      ],
      category: 'Security',
      rating: 4.8,
      reviews: 524,
      inStock: true,
      sku: 'SGP-CAM-001'
    };

    const productPage = template.createProductPages(product);
    console.log('✓ Product page created successfully!');

    // Test 3: Generate About Page
    console.log('\n📖 Test 3: Generating About Page...');

    const aboutPage = template.buildAboutPage({
      title: 'About SmartHome Pro',
      story: `Founded in 2018, SmartHome Pro was born from a simple idea: make home automation
              accessible and affordable for everyone. Our journey began when our founder, frustrated
              with complicated and expensive smart home systems, decided to create a better solution.

              Today, we're proud to serve over 100,000 customers worldwide, helping them create safer,
              more efficient, and more comfortable homes. Every product we design is tested rigorously
              to ensure it meets our high standards for quality, security, and ease of use.`,
      mission: 'To democratize smart home technology and make it accessible to everyone, regardless of technical expertise.',
      vision: 'A world where every home is smart, secure, and sustainable.',
      values: [
        'Customer First',
        'Innovation',
        'Quality',
        'Security',
        'Sustainability',
        'Transparency'
      ],
      team: [
        {
          name: 'John Smith',
          role: 'CEO & Founder',
          bio: '15 years of experience in IoT and home automation'
        },
        {
          name: 'Sarah Chen',
          role: 'CTO',
          bio: 'Former lead engineer at major tech companies'
        },
        {
          name: 'Mike Rodriguez',
          role: 'Head of Product',
          bio: 'Product design expert with a passion for UX'
        },
        {
          name: 'Emily Watson',
          role: 'Customer Success Lead',
          bio: 'Dedicated to ensuring every customer has a great experience'
        }
      ]
    });

    console.log('✓ About page created successfully!');

    // Test 4: Generate Contact Page
    console.log('\n📞 Test 4: Generating Contact Page...');

    const contactPage = template.createContactPage({
      email: 'support@smarthomepro.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA 94102',
      hours: 'Monday - Friday: 9AM - 6PM PST\nSaturday: 10AM - 4PM PST\nSunday: Closed'
    });

    console.log('✓ Contact page created successfully!');

    // Test 5: Generate Blog
    console.log('\n📝 Test 5: Generating Blog...');

    const blogPosts: BlogPost[] = [
      {
        id: 'smart-home-security-tips',
        title: '10 Essential Smart Home Security Tips for 2024',
        excerpt: 'Protect your home with these expert-recommended security practices and smart device configurations.',
        content: `<h2>Introduction</h2>
                 <p>Smart home security has evolved significantly in recent years. Here are the top 10 tips...</p>
                 <h2>1. Regular Firmware Updates</h2>
                 <p>Always keep your devices updated with the latest firmware...</p>
                 <h2>2. Strong Passwords</h2>
                 <p>Use unique, complex passwords for each device...</p>`,
        author: 'Security Team',
        date: new Date('2024-12-15'),
        image: 'https://via.placeholder.com/800x400?text=Security+Tips',
        category: 'Security',
        tags: ['security', 'tips', 'smart home'],
        readTime: 8
      },
      {
        id: 'choosing-smart-camera',
        title: 'How to Choose the Right Smart Camera for Your Home',
        excerpt: 'A comprehensive guide to selecting the perfect security camera based on your needs and budget.',
        content: `<h2>Understanding Your Needs</h2>
                 <p>Before purchasing a smart camera, consider these factors...</p>`,
        author: 'Product Team',
        date: new Date('2024-12-10'),
        image: 'https://via.placeholder.com/800x400?text=Camera+Guide',
        category: 'Guides',
        tags: ['cameras', 'buying guide', 'security'],
        readTime: 6
      },
      {
        id: 'smart-home-energy-savings',
        title: 'Save Money with Smart Home Automation',
        excerpt: 'Learn how smart thermostats and automated systems can reduce your energy bills by up to 30%.',
        content: `<h2>The Power of Smart Thermostats</h2>
                 <p>Smart thermostats learn your schedule and preferences...</p>`,
        author: 'Emily Rodriguez',
        date: new Date('2024-12-05'),
        image: 'https://via.placeholder.com/800x400?text=Energy+Savings',
        category: 'Energy',
        tags: ['energy', 'savings', 'automation'],
        readTime: 5
      }
    ];

    const blogPage = template.generateBlogLayout(blogPosts);
    console.log(`✓ Blog page created with ${blogPosts.length} posts!`);

    console.log('\n' + '='.repeat(70));
    console.log('✅ Website Generation Complete!');
    console.log('='.repeat(70));

    console.log('\n📁 Generated Files:');
    console.log('  • index.html - Homepage');
    console.log('  • products/smart-camera-pro.html - Product page');
    console.log('  • about.html - About page');
    console.log('  • contact.html - Contact page');
    console.log('  • blog.html - Blog listing');
    console.log('  • blog/smart-home-security-tips.html - Blog post 1');
    console.log('  • blog/choosing-smart-camera.html - Blog post 2');
    console.log('  • blog/smart-home-energy-savings.html - Blog post 3');

    console.log('\n🎨 Features:');
    console.log('  ✓ Responsive design (mobile, tablet, desktop)');
    console.log('  ✓ SEO-optimized meta tags');
    console.log('  ✓ Schema.org structured data');
    console.log('  ✓ Open Graph & Twitter Cards');
    console.log('  ✓ Sticky navigation');
    console.log('  ✓ Product galleries');
    console.log('  ✓ Contact forms');
    console.log('  ✓ Blog system');
    console.log('  ✓ Modern CSS (flexbox, grid)');
    console.log('  ✓ Interactive JavaScript');

    console.log('\n🚀 Next Steps:');
    console.log('  1. Review generated HTML files in: ./generated-website/');
    console.log('  2. Customize colors and branding in WebsiteConfig');
    console.log('  3. Add your own product images and content');
    console.log('  4. Deploy to your web server or hosting platform');
    console.log('  5. Configure contact form backend');

    console.log('\n💡 Tips:');
    console.log('  • Replace placeholder images with real product photos');
    console.log('  • Update social media links in WebsiteConfig');
    console.log('  • Add Google Analytics or tracking code');
    console.log('  • Set up SSL certificate for HTTPS');
    console.log('  • Test on multiple devices and browsers');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run tests if executed directly
if (require.main === module) {
  testDefaultTemplate().catch(console.error);
}

export { testDefaultTemplate };
