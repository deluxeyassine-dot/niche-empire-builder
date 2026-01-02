import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Gumroad API Integration
 *
 * Full integration with Gumroad marketplace including:
 * - Product creation and management
 * - File uploads
 * - Pricing and variants
 * - Sales and analytics
 * - Webhook handling
 * - License key management
 */

export interface GumroadConfig {
  accessToken: string;
}

export interface GumroadProduct {
  id?: string;
  name: string;
  description?: string;
  price: number;
  currency?: 'usd' | 'eur' | 'gbp' | 'cad' | 'aud';
  url?: string;
  thumbnail_url?: string;
  tags?: string[];
  formatted_price?: string;
  published?: boolean;
  shown_on_profile?: boolean;
  file_info?: any;
  max_purchase_count?: number;
  require_shipping?: boolean;
  custom_permalink?: string;
  custom_receipt?: string;
  custom_summary?: string;
  custom_fields?: CustomField[];
  variants?: ProductVariant[];
}

export interface CustomField {
  name: string;
  required: boolean;
  variant?: string;
}

export interface ProductVariant {
  title: string;
  options: VariantOption[];
}

export interface VariantOption {
  name: string;
  price_difference: number;
  is_shipping_required?: boolean;
  quantity?: number;
}

export interface GumroadSale {
  id: string;
  product_id: string;
  product_name: string;
  permalink: string;
  product_permalink: string;
  email: string;
  price: number;
  gumroad_fee: number;
  currency: string;
  quantity: number;
  discover_fee_charged: boolean;
  can_contact: boolean;
  referrer: string;
  card: {
    visual: string;
    type: string;
  };
  order_number: number;
  sale_id: string;
  sale_timestamp: string;
  purchaser_id: string;
  subscription_id?: string;
  variants?: string;
  license_key?: string;
  ip_country: string;
  recurrence?: string;
  is_gift_receiver_purchase: boolean;
  refunded: boolean;
  disputed: boolean;
  dispute_won: boolean;
  seller_id: string;
  affiliate?: string;
}

export interface GumroadSubscriber {
  id: string;
  product_id: string;
  product_name: string;
  user_email: string;
  purchase_ids: string[];
  created_at: string;
  user_id: string;
  subscription_ended_at?: string;
  subscription_cancelled_at?: string;
  subscription_failed_at?: string;
  status: 'alive' | 'pending_cancellation' | 'pending_failure' | 'failed_payment' | 'fixed_subscription_period_ended' | 'cancelled';
}

export interface WebhookPayload {
  seller_id: string;
  product_id: string;
  product_name: string;
  permalink: string;
  product_permalink: string;
  email: string;
  price: number;
  gumroad_fee: number;
  currency: string;
  quantity: number;
  sale_id: string;
  sale_timestamp: string;
  purchaser_id: string;
  subscription_id?: string;
  license_key?: string;
  ip_country: string;
  refunded: boolean;
  disputed: boolean;
  dispute_won: boolean;
  variants?: string;
  custom_fields?: Record<string, string>;
  chargebacked: boolean;
  affiliate?: string;
  order_id: string;
}

export class GumroadAPI {
  private client: AxiosInstance;
  private config: GumroadConfig;
  private baseURL = 'https://api.gumroad.com/v2';

  constructor(config: GumroadConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Product Management
   */

  /**
   * Create a new product
   */
  async createProduct(product: GumroadProduct): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('access_token', this.config.accessToken);
    formData.append('name', product.name);
    formData.append('price', (product.price * 100).toString()); // Gumroad uses cents

    if (product.description) {
      formData.append('description', product.description);
    }

    if (product.currency) {
      formData.append('currency', product.currency);
    }

    if (product.url) {
      formData.append('url', product.url);
    }

    if (product.thumbnail_url) {
      formData.append('thumbnail_url', product.thumbnail_url);
    }

    if (product.tags && product.tags.length > 0) {
      formData.append('tags', product.tags.join(','));
    }

    if (product.published !== undefined) {
      formData.append('published', product.published.toString());
    }

    if (product.shown_on_profile !== undefined) {
      formData.append('shown_on_profile', product.shown_on_profile.toString());
    }

    if (product.require_shipping !== undefined) {
      formData.append('require_shipping', product.require_shipping.toString());
    }

    if (product.custom_permalink) {
      formData.append('custom_permalink', product.custom_permalink);
    }

    if (product.custom_receipt) {
      formData.append('custom_receipt', product.custom_receipt);
    }

    if (product.custom_summary) {
      formData.append('custom_summary', product.custom_summary);
    }

    if (product.max_purchase_count) {
      formData.append('max_purchase_count', product.max_purchase_count.toString());
    }

    // Add custom fields
    if (product.custom_fields && product.custom_fields.length > 0) {
      product.custom_fields.forEach((field, index) => {
        formData.append(`custom_fields[${index}][name]`, field.name);
        formData.append(`custom_fields[${index}][required]`, field.required.toString());
        if (field.variant) {
          formData.append(`custom_fields[${index}][variant]`, field.variant);
        }
      });
    }

    // Add variants
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, vIndex) => {
        formData.append(`variants[${vIndex}][title]`, variant.title);
        variant.options.forEach((option, oIndex) => {
          formData.append(`variants[${vIndex}][options][${oIndex}][name]`, option.name);
          formData.append(`variants[${vIndex}][options][${oIndex}][price_difference]`, (option.price_difference * 100).toString());
          if (option.is_shipping_required !== undefined) {
            formData.append(`variants[${vIndex}][options][${oIndex}][is_shipping_required]`, option.is_shipping_required.toString());
          }
          if (option.quantity !== undefined) {
            formData.append(`variants[${vIndex}][options][${oIndex}][quantity]`, option.quantity.toString());
          }
        });
      });
    }

    const response = await this.client.post('/products', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Get product by ID or permalink
   */
  async getProduct(productId: string): Promise<any> {
    const response = await this.client.get(`/products/${productId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });

    return response.data.product;
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<any[]> {
    const response = await this.client.get('/products', {
      params: {
        access_token: this.config.accessToken,
      },
    });

    return response.data.products || [];
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<GumroadProduct>): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('access_token', this.config.accessToken);

    if (updates.name) {
      formData.append('name', updates.name);
    }

    if (updates.description !== undefined) {
      formData.append('description', updates.description);
    }

    if (updates.price !== undefined) {
      formData.append('price', (updates.price * 100).toString());
    }

    if (updates.url !== undefined) {
      formData.append('url', updates.url);
    }

    if (updates.thumbnail_url !== undefined) {
      formData.append('thumbnail_url', updates.thumbnail_url);
    }

    if (updates.published !== undefined) {
      formData.append('published', updates.published.toString());
    }

    if (updates.shown_on_profile !== undefined) {
      formData.append('shown_on_profile', updates.shown_on_profile.toString());
    }

    if (updates.require_shipping !== undefined) {
      formData.append('require_shipping', updates.require_shipping.toString());
    }

    const response = await this.client.put(`/products/${productId}`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<void> {
    await this.client.delete(`/products/${productId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });
  }

  /**
   * Enable product
   */
  async enableProduct(productId: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('access_token', this.config.accessToken);

    const response = await this.client.put(`/products/${productId}/enable`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Disable product
   */
  async disableProduct(productId: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('access_token', this.config.accessToken);

    const response = await this.client.put(`/products/${productId}/disable`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Sales and Analytics
   */

  /**
   * Get all sales
   */
  async getSales(params?: {
    after?: string;
    before?: string;
    page?: number;
    product_id?: string;
    email?: string;
  }): Promise<GumroadSale[]> {
    const queryParams: any = {
      access_token: this.config.accessToken,
    };

    if (params) {
      if (params.after) queryParams.after = params.after;
      if (params.before) queryParams.before = params.before;
      if (params.page) queryParams.page = params.page;
      if (params.product_id) queryParams.product_id = params.product_id;
      if (params.email) queryParams.email = params.email;
    }

    const response = await this.client.get('/sales', { params: queryParams });

    return response.data.sales || [];
  }

  /**
   * Get single sale
   */
  async getSale(saleId: string): Promise<GumroadSale> {
    const response = await this.client.get(`/sales/${saleId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });

    return response.data.sale;
  }

  /**
   * Refund sale
   */
  async refundSale(saleId: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('access_token', this.config.accessToken);

    const response = await this.client.put(`/sales/${saleId}/refund`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Subscribers (for membership/subscription products)
   */

  /**
   * Get all subscribers
   */
  async getSubscribers(productId?: string): Promise<GumroadSubscriber[]> {
    const params: any = {
      access_token: this.config.accessToken,
    };

    if (productId) {
      params.product_id = productId;
    }

    const response = await this.client.get('/subscribers', { params });

    return response.data.subscribers || [];
  }

  /**
   * Get single subscriber
   */
  async getSubscriber(subscriberId: string): Promise<GumroadSubscriber> {
    const response = await this.client.get(`/subscribers/${subscriberId}`, {
      params: {
        access_token: this.config.accessToken,
      },
    });

    return response.data.subscriber;
  }

  /**
   * License Key Verification
   */

  /**
   * Verify license key
   */
  async verifyLicense(productPermalink: string, licenseKey: string, incrementUsesCount = false): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('product_permalink', productPermalink);
    formData.append('license_key', licenseKey);
    formData.append('increment_uses_count', incrementUsesCount.toString());

    const response = await this.client.post('/licenses/verify', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Enable license key
   */
  async enableLicense(productPermalink: string, licenseKey: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('product_permalink', productPermalink);
    formData.append('license_key', licenseKey);

    const response = await this.client.put('/licenses/enable', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Disable license key
   */
  async disableLicense(productPermalink: string, licenseKey: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('product_permalink', productPermalink);
    formData.append('license_key', licenseKey);

    const response = await this.client.put('/licenses/disable', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * User Information
   */

  /**
   * Get authenticated user info
   */
  async getUser(): Promise<any> {
    const response = await this.client.get('/user', {
      params: {
        access_token: this.config.accessToken,
      },
    });

    return response.data.user;
  }

  /**
   * Webhook Handlers
   */

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Parse webhook payload
   */
  parseWebhook(payload: any): WebhookPayload {
    return {
      seller_id: payload.seller_id,
      product_id: payload.product_id,
      product_name: payload.product_name,
      permalink: payload.permalink,
      product_permalink: payload.product_permalink,
      email: payload.email,
      price: payload.price,
      gumroad_fee: payload.gumroad_fee,
      currency: payload.currency,
      quantity: payload.quantity,
      sale_id: payload.sale_id,
      sale_timestamp: payload.sale_timestamp,
      purchaser_id: payload.purchaser_id,
      subscription_id: payload.subscription_id,
      license_key: payload.license_key,
      ip_country: payload.ip_country,
      refunded: payload.refunded,
      disputed: payload.disputed,
      dispute_won: payload.dispute_won,
      variants: payload.variants,
      custom_fields: payload.custom_fields,
      chargebacked: payload.chargebacked,
      affiliate: payload.affiliate,
      order_id: payload.order_id,
    };
  }

  /**
   * Helper Methods
   */

  /**
   * Generate product permalink from name
   */
  generatePermalink(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Calculate net revenue after Gumroad fees
   */
  calculateNetRevenue(price: number, gumroadFee = 0.1): number {
    // Gumroad charges 10% fee by default
    const fee = price * gumroadFee;
    const stripeFee = (price - fee) * 0.029 + 0.30; // Stripe processing fee
    return price - fee - stripeFee;
  }

  /**
   * Validate product data
   */
  validateProduct(product: GumroadProduct): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!product.name || product.name.length < 1) {
      errors.push('Product name is required');
    }

    if (!product.price || product.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (product.custom_permalink) {
      const validPermalink = /^[a-z0-9-]+$/.test(product.custom_permalink);
      if (!validPermalink) {
        errors.push('Permalink can only contain lowercase letters, numbers, and hyphens');
      }
    }

    if (product.variants) {
      product.variants.forEach((variant, index) => {
        if (!variant.title) {
          errors.push(`Variant ${index + 1} is missing a title`);
        }
        if (!variant.options || variant.options.length === 0) {
          errors.push(`Variant "${variant.title}" has no options`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default GumroadAPI;
