import axios, { AxiosInstance } from 'axios';

/**
 * Shopify Admin API Integration
 *
 * Full integration with Shopify for:
 * - Product creation and management
 * - Variant management
 * - Collection management
 * - Inventory tracking
 * - Order management
 * - Customer management
 *
 * Perfect for:
 * - Print-on-demand stores
 * - Digital product shops
 * - Dropshipping businesses
 * - Custom merchandise stores
 */

export interface ShopifyConfig {
  shopDomain: string; // your-store.myshopify.com
  accessToken: string;
  apiVersion?: string; // e.g., '2024-01'
}

export interface ShopifyProduct {
  id?: number;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[];
  status?: 'active' | 'archived' | 'draft';
  published_at?: string;
  variants?: ShopifyVariant[];
  images?: ShopifyImage[];
  options?: ShopifyOption[];
  metafields?: ShopifyMetafield[];
}

export interface ShopifyVariant {
  id?: number;
  product_id?: number;
  title?: string;
  price: string;
  sku?: string;
  position?: number;
  inventory_policy?: 'deny' | 'continue';
  compare_at_price?: string;
  fulfillment_service?: 'manual' | string;
  inventory_management?: 'shopify' | null;
  option1?: string;
  option2?: string;
  option3?: string;
  taxable?: boolean;
  barcode?: string;
  grams?: number;
  weight?: number;
  weight_unit?: 'g' | 'kg' | 'oz' | 'lb';
  inventory_quantity?: number;
  requires_shipping?: boolean;
}

export interface ShopifyImage {
  id?: number;
  product_id?: number;
  position?: number;
  src?: string;
  alt?: string;
  variant_ids?: number[];
  attachment?: string; // Base64 encoded image
  filename?: string;
}

export interface ShopifyOption {
  id?: number;
  product_id?: number;
  name: string;
  position?: number;
  values: string[];
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: 'string' | 'integer' | 'json_string' | 'boolean';
}

export interface ShopifyCollection {
  id?: number;
  title: string;
  body_html?: string;
  sort_order?: 'alpha-asc' | 'alpha-desc' | 'best-selling' | 'created' | 'created-desc' | 'manual' | 'price-asc' | 'price-desc';
  published?: boolean;
  published_at?: string;
  image?: {
    src?: string;
    alt?: string;
    attachment?: string;
  };
}

export interface ShopifyOrder {
  id: number;
  order_number: number;
  email: string;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string;
  line_items: ShopifyLineItem[];
  customer: any;
  shipping_address: any;
  billing_address: any;
}

export interface ShopifyLineItem {
  id: number;
  product_id: number;
  variant_id: number;
  title: string;
  quantity: number;
  price: string;
  sku: string;
  fulfillment_status: string;
}

export interface ShopifyInventoryLevel {
  inventory_item_id: number;
  location_id: number;
  available: number;
}

export class ShopifyAPI {
  private client: AxiosInstance;
  private config: ShopifyConfig;
  private baseURL: string;

  constructor(config: ShopifyConfig) {
    this.config = config;
    const apiVersion = config.apiVersion || '2024-01';
    this.baseURL = `https://${config.shopDomain}/admin/api/${apiVersion}`;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * PRODUCT MANAGEMENT
   */

  /**
   * Create a new product
   */
  async createProduct(product: ShopifyProduct): Promise<any> {
    const response = await this.client.post('/products.json', {
      product,
    });

    return response.data.product;
  }

  /**
   * Create product with variants
   */
  async createProductWithVariants(
    title: string,
    description: string,
    basePrice: number,
    options: { name: string; values: string[] }[],
    images?: string[]
  ): Promise<any> {
    const product: ShopifyProduct = {
      title,
      body_html: description,
      status: 'active',
      options: options.map((opt, index) => ({
        name: opt.name,
        position: index + 1,
        values: opt.values,
      })),
    };

    // Add images if provided
    if (images && images.length > 0) {
      product.images = images.map((src, index) => ({
        src,
        position: index + 1,
      }));
    }

    // Create variants for all option combinations
    const variants: ShopifyVariant[] = [];
    const generateVariants = (
      optionIndex: number,
      currentVariant: Partial<ShopifyVariant>
    ) => {
      if (optionIndex >= options.length) {
        variants.push({
          price: basePrice.toString(),
          inventory_management: 'shopify',
          inventory_policy: 'continue',
          ...currentVariant,
        } as ShopifyVariant);
        return;
      }

      const option = options[optionIndex];
      for (const value of option.values) {
        const variantCopy = { ...currentVariant };
        (variantCopy as any)[`option${optionIndex + 1}`] = value;
        generateVariants(optionIndex + 1, variantCopy);
      }
    };

    generateVariants(0, {});
    product.variants = variants;

    return this.createProduct(product);
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: number): Promise<any> {
    const response = await this.client.get(`/products/${productId}.json`);
    return response.data.product;
  }

  /**
   * Get all products
   */
  async getProducts(params?: {
    limit?: number;
    since_id?: number;
    status?: 'active' | 'archived' | 'draft';
    collection_id?: number;
  }): Promise<any[]> {
    const response = await this.client.get('/products.json', { params });
    return response.data.products || [];
  }

  /**
   * Update product
   */
  async updateProduct(productId: number, updates: Partial<ShopifyProduct>): Promise<any> {
    const response = await this.client.put(`/products/${productId}.json`, {
      product: updates,
    });

    return response.data.product;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: number): Promise<void> {
    await this.client.delete(`/products/${productId}.json`);
  }

  /**
   * VARIANT MANAGEMENT
   */

  /**
   * Create variant
   */
  async createVariant(productId: number, variant: ShopifyVariant): Promise<any> {
    const response = await this.client.post(`/products/${productId}/variants.json`, {
      variant,
    });

    return response.data.variant;
  }

  /**
   * Update variant
   */
  async updateVariant(variantId: number, updates: Partial<ShopifyVariant>): Promise<any> {
    const response = await this.client.put(`/variants/${variantId}.json`, {
      variant: updates,
    });

    return response.data.variant;
  }

  /**
   * Delete variant
   */
  async deleteVariant(productId: number, variantId: number): Promise<void> {
    await this.client.delete(`/products/${productId}/variants/${variantId}.json`);
  }

  /**
   * IMAGE MANAGEMENT
   */

  /**
   * Add image to product
   */
  async addProductImage(productId: number, image: ShopifyImage): Promise<any> {
    const response = await this.client.post(`/products/${productId}/images.json`, {
      image,
    });

    return response.data.image;
  }

  /**
   * Add multiple images
   */
  async addProductImages(productId: number, imageUrls: string[]): Promise<any[]> {
    const images = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const image = await this.addProductImage(productId, {
        src: imageUrls[i],
        position: i + 1,
      });
      images.push(image);
    }

    return images;
  }

  /**
   * Delete image
   */
  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await this.client.delete(`/products/${productId}/images/${imageId}.json`);
  }

  /**
   * COLLECTION MANAGEMENT
   */

  /**
   * Create collection
   */
  async createCollection(collection: ShopifyCollection): Promise<any> {
    const response = await this.client.post('/custom_collections.json', {
      custom_collection: collection,
    });

    return response.data.custom_collection;
  }

  /**
   * Get collection
   */
  async getCollection(collectionId: number): Promise<any> {
    const response = await this.client.get(`/custom_collections/${collectionId}.json`);
    return response.data.custom_collection;
  }

  /**
   * Get all collections
   */
  async getCollections(limit = 250): Promise<any[]> {
    const response = await this.client.get('/custom_collections.json', {
      params: { limit },
    });

    return response.data.custom_collections || [];
  }

  /**
   * Add product to collection
   */
  async addProductToCollection(collectionId: number, productId: number): Promise<any> {
    const response = await this.client.post('/collects.json', {
      collect: {
        product_id: productId,
        collection_id: collectionId,
      },
    });

    return response.data.collect;
  }

  /**
   * Remove product from collection
   */
  async removeProductFromCollection(collectId: number): Promise<void> {
    await this.client.delete(`/collects/${collectId}.json`);
  }

  /**
   * INVENTORY MANAGEMENT
   */

  /**
   * Get inventory levels
   */
  async getInventoryLevels(inventoryItemIds: number[]): Promise<ShopifyInventoryLevel[]> {
    const response = await this.client.get('/inventory_levels.json', {
      params: {
        inventory_item_ids: inventoryItemIds.join(','),
      },
    });

    return response.data.inventory_levels || [];
  }

  /**
   * Set inventory level
   */
  async setInventoryLevel(
    inventoryItemId: number,
    locationId: number,
    available: number
  ): Promise<any> {
    const response = await this.client.post('/inventory_levels/set.json', {
      location_id: locationId,
      inventory_item_id: inventoryItemId,
      available,
    });

    return response.data.inventory_level;
  }

  /**
   * Adjust inventory level
   */
  async adjustInventoryLevel(
    inventoryItemId: number,
    locationId: number,
    adjustment: number
  ): Promise<any> {
    const response = await this.client.post('/inventory_levels/adjust.json', {
      location_id: locationId,
      inventory_item_id: inventoryItemId,
      available_adjustment: adjustment,
    });

    return response.data.inventory_level;
  }

  /**
   * Get locations
   */
  async getLocations(): Promise<any[]> {
    const response = await this.client.get('/locations.json');
    return response.data.locations || [];
  }

  /**
   * ORDER MANAGEMENT
   */

  /**
   * Get orders
   */
  async getOrders(params?: {
    status?: 'open' | 'closed' | 'cancelled' | 'any';
    financial_status?: 'authorized' | 'paid' | 'pending' | 'refunded' | 'voided' | 'any';
    fulfillment_status?: 'shipped' | 'partial' | 'unshipped' | 'any';
    limit?: number;
    since_id?: number;
  }): Promise<ShopifyOrder[]> {
    const response = await this.client.get('/orders.json', { params });
    return response.data.orders || [];
  }

  /**
   * Get single order
   */
  async getOrder(orderId: number): Promise<ShopifyOrder> {
    const response = await this.client.get(`/orders/${orderId}.json`);
    return response.data.order;
  }

  /**
   * Create fulfillment
   */
  async createFulfillment(orderId: number, lineItems: { id: number }[]): Promise<any> {
    const response = await this.client.post(`/orders/${orderId}/fulfillments.json`, {
      fulfillment: {
        line_items: lineItems,
        tracking_number: '',
        notify_customer: true,
      },
    });

    return response.data.fulfillment;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: number, reason?: string): Promise<any> {
    const response = await this.client.post(`/orders/${orderId}/cancel.json`, {
      reason: reason || 'other',
    });

    return response.data.order;
  }

  /**
   * CUSTOMER MANAGEMENT
   */

  /**
   * Get customers
   */
  async getCustomers(limit = 250): Promise<any[]> {
    const response = await this.client.get('/customers.json', {
      params: { limit },
    });

    return response.data.customers || [];
  }

  /**
   * Get customer
   */
  async getCustomer(customerId: number): Promise<any> {
    const response = await this.client.get(`/customers/${customerId}.json`);
    return response.data.customer;
  }

  /**
   * Search customers
   */
  async searchCustomers(query: string): Promise<any[]> {
    const response = await this.client.get('/customers/search.json', {
      params: { query },
    });

    return response.data.customers || [];
  }

  /**
   * METAFIELD MANAGEMENT
   */

  /**
   * Add metafield to product
   */
  async addProductMetafield(
    productId: number,
    metafield: ShopifyMetafield
  ): Promise<any> {
    const response = await this.client.post(`/products/${productId}/metafields.json`, {
      metafield,
    });

    return response.data.metafield;
  }

  /**
   * Get product metafields
   */
  async getProductMetafields(productId: number): Promise<any[]> {
    const response = await this.client.get(`/products/${productId}/metafields.json`);
    return response.data.metafields || [];
  }

  /**
   * WEBHOOK MANAGEMENT
   */

  /**
   * Create webhook
   */
  async createWebhook(
    topic: string,
    address: string,
    format: 'json' | 'xml' = 'json'
  ): Promise<any> {
    const response = await this.client.post('/webhooks.json', {
      webhook: {
        topic,
        address,
        format,
      },
    });

    return response.data.webhook;
  }

  /**
   * Get webhooks
   */
  async getWebhooks(): Promise<any[]> {
    const response = await this.client.get('/webhooks.json');
    return response.data.webhooks || [];
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: number): Promise<void> {
    await this.client.delete(`/webhooks/${webhookId}.json`);
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Verify webhook signature
   */
  verifyWebhook(data: string, hmacHeader: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', this.config.accessToken)
      .update(data, 'utf8')
      .digest('base64');

    return hash === hmacHeader;
  }

  /**
   * Get shop info
   */
  async getShopInfo(): Promise<any> {
    const response = await this.client.get('/shop.json');
    return response.data.shop;
  }

  /**
   * Bulk create products
   */
  async bulkCreateProducts(products: ShopifyProduct[]): Promise<any[]> {
    const results = [];

    for (const product of products) {
      try {
        const created = await this.createProduct(product);
        results.push({ success: true, product: created });
      } catch (error: any) {
        results.push({ success: false, error: error.message, product });
      }
    }

    return results;
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    const response = await this.client.get('/products/count.json');
    return response.data.count;
  }

  /**
   * Get order count
   */
  async getOrderCount(status?: string): Promise<number> {
    const response = await this.client.get('/orders/count.json', {
      params: status ? { status } : undefined,
    });

    return response.data.count;
  }
}

export default ShopifyAPI;
