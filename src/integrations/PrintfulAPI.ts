import axios, { AxiosInstance } from 'axios';

/**
 * Printful API Integration
 *
 * Full integration with Printful print-on-demand service for:
 * - Product catalog browsing
 * - Custom product creation
 * - Order management
 * - Mockup generation
 * - Shipping calculations
 * - Store integration
 *
 * Perfect for:
 * - Print-on-demand automation
 * - Custom merchandise creation
 * - Order fulfillment
 * - Product mockups
 */

export interface PrintfulConfig {
  apiKey: string;
  storeId?: number;
}

export interface PrintfulProduct {
  id: number;
  type: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: any[];
  options: any[];
  dimensions: any;
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  image: string;
  price: string;
  in_stock: boolean;
  availability_regions: any;
  availability_status: any[];
}

export interface PrintfulSyncProduct {
  id?: number;
  external_id?: string;
  name: string;
  thumbnail?: string;
  is_ignored?: boolean;
  sync_variants: PrintfulSyncVariant[];
}

export interface PrintfulSyncVariant {
  id?: number;
  external_id?: string;
  sync_product_id?: number;
  name?: string;
  variant_id: number;
  retail_price: string;
  currency?: string;
  is_ignored?: boolean;
  sku?: string;
  files?: PrintfulFile[];
  options?: any[];
}

export interface PrintfulFile {
  type: 'default' | 'preview' | 'back' | 'left' | 'right' | 'label_outside' | 'label_inside';
  url?: string;
  filename?: string;
  visible?: boolean;
  position?: {
    area_width: number;
    area_height: number;
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export interface PrintfulOrder {
  id?: number;
  external_id: string;
  status?: string;
  shipping: string;
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    phone?: string;
    email?: string;
  };
  items: PrintfulOrderItem[];
  retail_costs?: any;
  packing_slip?: any;
}

export interface PrintfulOrderItem {
  sync_variant_id?: number;
  external_variant_id?: string;
  variant_id?: number;
  quantity: number;
  price: string;
  retail_price?: string;
  name?: string;
  product?: any;
  files?: PrintfulFile[];
  options?: any[];
}

export class PrintfulAPI {
  private client: AxiosInstance;
  private config: PrintfulConfig;
  private baseURL = 'https://api.printful.com';

  constructor(config: PrintfulConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });

    // Add store ID to all requests if provided
    if (config.storeId) {
      this.client.defaults.headers.common['X-PF-Store-Id'] = config.storeId;
    }
  }

  /**
   * CATALOG PRODUCTS
   */

  /**
   * Get all products
   */
  async getProducts(): Promise<PrintfulProduct[]> {
    const response = await this.client.get('/products');
    return response.data.result || [];
  }

  /**
   * Get product details
   */
  async getProduct(productId: number): Promise<PrintfulProduct> {
    const response = await this.client.get(`/products/${productId}`);
    return response.data.result;
  }

  /**
   * Get product variants
   */
  async getProductVariants(productId: number): Promise<PrintfulVariant[]> {
    const response = await this.client.get(`/products/${productId}`);
    return response.data.result.variants || [];
  }

  /**
   * Get variant details
   */
  async getVariant(variantId: number): Promise<PrintfulVariant> {
    const response = await this.client.get(`/products/variant/${variantId}`);
    return response.data.result;
  }

  /**
   * SYNC PRODUCTS (Store Products)
   */

  /**
   * Get all sync products
   */
  async getSyncProducts(): Promise<PrintfulSyncProduct[]> {
    const response = await this.client.get('/store/products');
    return response.data.result || [];
  }

  /**
   * Get sync product
   */
  async getSyncProduct(syncProductId: number): Promise<PrintfulSyncProduct> {
    const response = await this.client.get(`/store/products/${syncProductId}`);
    return response.data.result.sync_product;
  }

  /**
   * Create sync product
   */
  async createSyncProduct(product: PrintfulSyncProduct): Promise<PrintfulSyncProduct> {
    const response = await this.client.post('/store/products', product);
    return response.data.result.sync_product;
  }

  /**
   * Update sync product
   */
  async updateSyncProduct(syncProductId: number, updates: Partial<PrintfulSyncProduct>): Promise<PrintfulSyncProduct> {
    const response = await this.client.put(`/store/products/${syncProductId}`, updates);
    return response.data.result.sync_product;
  }

  /**
   * Delete sync product
   */
  async deleteSyncProduct(syncProductId: number): Promise<void> {
    await this.client.delete(`/store/products/${syncProductId}`);
  }

  /**
   * Get sync variant
   */
  async getSyncVariant(syncVariantId: number): Promise<PrintfulSyncVariant> {
    const response = await this.client.get(`/store/variants/${syncVariantId}`);
    return response.data.result.sync_variant;
  }

  /**
   * UPDATE sync variant
   */
  async updateSyncVariant(syncVariantId: number, updates: Partial<PrintfulSyncVariant>): Promise<PrintfulSyncVariant> {
    const response = await this.client.put(`/store/variants/${syncVariantId}`, updates);
    return response.data.result.sync_variant;
  }

  /**
   * Delete sync variant
   */
  async deleteSyncVariant(syncVariantId: number): Promise<void> {
    await this.client.delete(`/store/variants/${syncVariantId}`);
  }

  /**
   * ORDERS
   */

  /**
   * Get all orders
   */
  async getOrders(params?: {
    status?: 'draft' | 'pending' | 'fulfilled' | 'canceled' | 'failed' | 'archived';
    offset?: number;
    limit?: number;
  }): Promise<any[]> {
    const response = await this.client.get('/orders', { params });
    return response.data.result || [];
  }

  /**
   * Get order
   */
  async getOrder(orderId: number): Promise<PrintfulOrder> {
    const response = await this.client.get(`/orders/${orderId}`);
    return response.data.result;
  }

  /**
   * Create order
   */
  async createOrder(order: PrintfulOrder, confirm = false): Promise<any> {
    const response = await this.client.post('/orders', order, {
      params: { confirm: confirm ? '1' : '0' },
    });

    return response.data.result;
  }

  /**
   * Estimate order costs
   */
  async estimateOrderCosts(order: PrintfulOrder): Promise<any> {
    const response = await this.client.post('/orders/estimate-costs', order);
    return response.data.result;
  }

  /**
   * Confirm draft order
   */
  async confirmOrder(orderId: number): Promise<any> {
    const response = await this.client.post(`/orders/${orderId}/confirm`);
    return response.data.result;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: number): Promise<any> {
    const response = await this.client.delete(`/orders/${orderId}`);
    return response.data.result;
  }

  /**
   * Update order
   */
  async updateOrder(orderId: number, updates: Partial<PrintfulOrder>): Promise<any> {
    const response = await this.client.put(`/orders/${orderId}`, updates);
    return response.data.result;
  }

  /**
   * FILE LIBRARY
   */

  /**
   * Get all files
   */
  async getFiles(): Promise<any[]> {
    const response = await this.client.get('/files');
    return response.data.result || [];
  }

  /**
   * Get file
   */
  async getFile(fileId: number): Promise<any> {
    const response = await this.client.get(`/files/${fileId}`);
    return response.data.result;
  }

  /**
   * Add file
   */
  async addFile(url: string, type: 'default' | 'preview' | 'back', filename?: string): Promise<any> {
    const response = await this.client.post('/files', {
      url,
      type,
      filename,
    });

    return response.data.result;
  }

  /**
   * MOCKUP GENERATOR
   */

  /**
   * Create mockup generation task
   */
  async createMockupTask(variantId: number, files: PrintfulFile[]): Promise<any> {
    const response = await this.client.post('/mockup-generator/create-task', {
      variant_ids: [variantId],
      format: 'jpg',
      files: files.map(file => ({
        placement: file.type,
        image_url: file.url,
        position: file.position,
      })),
    });

    return response.data.result;
  }

  /**
   * Get mockup task result
   */
  async getMockupTaskResult(taskKey: string): Promise<any> {
    const response = await this.client.get(`/mockup-generator/task`, {
      params: { task_key: taskKey },
    });

    return response.data.result;
  }

  /**
   * Generate mockup and wait for completion
   */
  async generateMockup(variantId: number, files: PrintfulFile[]): Promise<any> {
    const task = await this.createMockupTask(variantId, files);
    const taskKey = task.task_key;

    // Poll for completion
    let attempts = 0;
    while (attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await this.getMockupTaskResult(taskKey);

      if (result.status === 'completed') {
        return result.mockups;
      }

      if (result.status === 'failed') {
        throw new Error('Mockup generation failed');
      }

      attempts++;
    }

    throw new Error('Mockup generation timeout');
  }

  /**
   * SHIPPING
   */

  /**
   * Get shipping rates
   */
  async getShippingRates(recipient: any, items: PrintfulOrderItem[]): Promise<any[]> {
    const response = await this.client.post('/shipping/rates', {
      recipient,
      items,
    });

    return response.data.result || [];
  }

  /**
   * WEBHOOKS
   */

  /**
   * Get webhooks
   */
  async getWebhooks(): Promise<any[]> {
    const response = await this.client.get('/webhooks');
    return response.data.result || [];
  }

  /**
   * Create webhook
   */
  async createWebhook(url: string, types: string[]): Promise<any> {
    const response = await this.client.post('/webhooks', {
      url,
      types,
    });

    return response.data.result;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}`);
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');

    const hash = crypto
      .createHmac('sha256', this.config.apiKey)
      .update(payload)
      .digest('hex');

    return hash === signature;
  }

  /**
   * STORE INFORMATION
   */

  /**
   * Get store info
   */
  async getStoreInfo(): Promise<any> {
    const response = await this.client.get('/store');
    return response.data.result;
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Create t-shirt product
   */
  async createTShirtProduct(
    name: string,
    designUrl: string,
    variantIds: number[],
    retailPrice: string
  ): Promise<PrintfulSyncProduct> {
    const syncVariants: PrintfulSyncVariant[] = variantIds.map(variantId => ({
      variant_id: variantId,
      retail_price: retailPrice,
      files: [
        {
          type: 'default',
          url: designUrl,
        },
      ],
    }));

    return this.createSyncProduct({
      name,
      sync_variants: syncVariants,
    });
  }

  /**
   * Batch create products
   */
  async batchCreateProducts(
    products: Array<{
      name: string;
      designUrl: string;
      variantIds: number[];
      retailPrice: string;
    }>
  ): Promise<PrintfulSyncProduct[]> {
    const created: PrintfulSyncProduct[] = [];

    for (const product of products) {
      try {
        const syncProduct = await this.createTShirtProduct(
          product.name,
          product.designUrl,
          product.variantIds,
          product.retailPrice
        );

        created.push(syncProduct);
        console.log(`✅ Created product: ${product.name}`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`❌ Failed to create ${product.name}:`, error.message);
      }
    }

    return created;
  }

  /**
   * Get popular t-shirt variants
   */
  getPopularTShirtVariants(): number[] {
    // These are example Bella+Canvas 3001 variant IDs (common t-shirt)
    // Update with actual variant IDs from your catalog
    return [
      4011, // S / White
      4012, // M / White
      4013, // L / White
      4014, // XL / White
      4016, // S / Black
      4017, // M / Black
      4018, // L / Black
      4019, // XL / Black
    ];
  }

  /**
   * Calculate profit margin
   */
  async calculateProfitMargin(syncVariantId: number, retailPrice: number): Promise<{
    retail_price: number;
    printful_cost: number;
    profit: number;
    margin_percentage: number;
  }> {
    const variant = await this.getSyncVariant(syncVariantId);
    const product = await this.getVariant(variant.variant_id);

    const printfulCost = parseFloat(product.price);
    const profit = retailPrice - printfulCost;
    const marginPercentage = (profit / retailPrice) * 100;

    return {
      retail_price: retailPrice,
      printful_cost: printfulCost,
      profit,
      margin_percentage: marginPercentage,
    };
  }
}

export default PrintfulAPI;
