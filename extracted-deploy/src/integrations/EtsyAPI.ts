import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

/**
 * Etsy API v3 Integration
 *
 * Full integration with Etsy marketplace including:
 * - OAuth 2.0 authentication
 * - Listing creation and management
 * - Image uploads
 * - Inventory management
 * - Order processing
 * - Shipping profiles
 */

export interface EtsyConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  shopId?: string;
}

export interface EtsyListing {
  listing_id?: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  shipping_profile_id?: number;
  shop_section_id?: number;
  taxonomy_id: number;
  tags: string[];
  materials?: string[];
  who_made: 'i_did' | 'someone_else' | 'collective';
  when_made: 'made_to_order' | '2020_2024' | '2010_2019' | '2000_2009' | 'before_2000' | '1990s' | '1980s' | '1970s' | '1960s' | '1950s' | '1940s' | '1930s' | '1920s' | '1910s' | '1900s' | '1800s' | '1700s' | 'before_1700';
  is_supply: boolean;
  should_auto_renew: boolean;
  state: 'draft' | 'active';
  type: 'physical' | 'download';
  images?: string[];
}

export interface EtsyShippingProfile {
  shipping_profile_id?: number;
  title: string;
  origin_country_iso: string;
  min_processing_days: number;
  max_processing_days: number;
  processing_days_display_label?: string;
}

export interface EtsyOrder {
  order_id: number;
  receipt_id: number;
  buyer_user_id: number;
  buyer_email: string;
  grandtotal: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  shipments?: any[];
  create_timestamp: number;
  transactions: EtsyTransaction[];
}

export interface EtsyTransaction {
  transaction_id: number;
  title: string;
  description: string;
  quantity: number;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  listing_id: number;
  shipping_profile_id: number;
  is_digital: boolean;
  file_data?: string;
}

export class EtsyAPI {
  private client: AxiosInstance;
  private config: EtsyConfig;
  private baseURL = 'https://openapi.etsy.com/v3';

  constructor(config: EtsyConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.clientId,
      },
    });

    // Add authorization header if access token exists
    if (config.accessToken) {
      this.setAccessToken(config.accessToken);
    }
  }

  /**
   * OAuth 2.0 Authentication Flow
   */

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    // Store code verifier for later use in token exchange
    this.config.codeVerifier = codeVerifier;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      scope: 'listings_w listings_r shops_r transactions_r transactions_w email_r',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state || crypto.randomBytes(16).toString('hex'),
    });

    return `https://www.etsy.com/oauth/connect?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await axios.post('https://api.etsy.com/v3/public/oauth/token', {
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: this.config.codeVerifier,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    this.config.accessToken = access_token;
    this.config.refreshToken = refresh_token;
    this.setAccessToken(access_token);

    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.config.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('https://api.etsy.com/v3/public/oauth/token', {
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      refresh_token: this.config.refreshToken,
    });

    const { access_token, refresh_token } = response.data;

    this.config.accessToken = access_token;
    this.config.refreshToken = refresh_token;
    this.setAccessToken(access_token);

    return access_token;
  }

  /**
   * Listing Management
   */

  /**
   * Create a new listing
   */
  async createListing(listing: EtsyListing): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.post(
      `/application/shops/${this.config.shopId}/listings`,
      {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        quantity: listing.quantity,
        shipping_profile_id: listing.shipping_profile_id,
        shop_section_id: listing.shop_section_id,
        taxonomy_id: listing.taxonomy_id,
        tags: listing.tags,
        materials: listing.materials,
        who_made: listing.who_made,
        when_made: listing.when_made,
        is_supply: listing.is_supply,
        should_auto_renew: listing.should_auto_renew,
        state: listing.state,
        type: listing.type,
      }
    );

    // Upload images if provided
    if (listing.images && listing.images.length > 0 && response.data.listing_id) {
      await this.uploadListingImages(response.data.listing_id, listing.images);
    }

    return response.data;
  }

  /**
   * Update an existing listing
   */
  async updateListing(listingId: number, updates: Partial<EtsyListing>): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.patch(
      `/application/shops/${this.config.shopId}/listings/${listingId}`,
      updates
    );

    return response.data;
  }

  /**
   * Delete a listing
   */
  async deleteListing(listingId: number): Promise<void> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    await this.client.delete(
      `/application/shops/${this.config.shopId}/listings/${listingId}`
    );
  }

  /**
   * Get listing by ID
   */
  async getListing(listingId: number): Promise<any> {
    const response = await this.client.get(
      `/application/listings/${listingId}`
    );

    return response.data;
  }

  /**
   * Get all shop listings
   */
  async getShopListings(state?: 'draft' | 'active' | 'inactive' | 'sold_out' | 'expired'): Promise<any[]> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const params: any = { limit: 100 };
    if (state) {
      params.state = state;
    }

    const response = await this.client.get(
      `/application/shops/${this.config.shopId}/listings`,
      { params }
    );

    return response.data.results || [];
  }

  /**
   * Image Management
   */

  /**
   * Upload images to a listing
   */
  async uploadListingImages(listingId: number, imagePaths: string[]): Promise<any[]> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const uploadedImages = [];

    for (let i = 0; i < imagePaths.length && i < 10; i++) {
      const imagePath = imagePaths[i];

      // For URLs, download and upload
      // For local files, read and upload
      const formData = new FormData();
      formData.append('image', imagePath);
      formData.append('rank', (i + 1).toString());

      const response = await this.client.post(
        `/application/shops/${this.config.shopId}/listings/${listingId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      uploadedImages.push(response.data);
    }

    return uploadedImages;
  }

  /**
   * Delete listing image
   */
  async deleteListingImage(listingId: number, imageId: number): Promise<void> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    await this.client.delete(
      `/application/shops/${this.config.shopId}/listings/${listingId}/images/${imageId}`
    );
  }

  /**
   * Inventory Management
   */

  /**
   * Update listing inventory
   */
  async updateInventory(listingId: number, quantity: number, sku?: string): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.put(
      `/application/shops/${this.config.shopId}/listings/${listingId}/inventory`,
      {
        products: [
          {
            sku,
            offerings: [
              {
                quantity,
                is_enabled: true,
              },
            ],
          },
        ],
      }
    );

    return response.data;
  }

  /**
   * Get listing inventory
   */
  async getInventory(listingId: number): Promise<any> {
    const response = await this.client.get(
      `/application/listings/${listingId}/inventory`
    );

    return response.data;
  }

  /**
   * Order Management
   */

  /**
   * Get shop orders/receipts
   */
  async getOrders(limit = 25, offset = 0): Promise<EtsyOrder[]> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.get(
      `/application/shops/${this.config.shopId}/receipts`,
      {
        params: {
          limit,
          offset,
        },
      }
    );

    return response.data.results || [];
  }

  /**
   * Get single order by receipt ID
   */
  async getOrder(receiptId: number): Promise<EtsyOrder> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.get(
      `/application/shops/${this.config.shopId}/receipts/${receiptId}`
    );

    return response.data;
  }

  /**
   * Create shipment for order
   */
  async createShipment(receiptId: number, trackingCode: string, carrierName: string): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.post(
      `/application/shops/${this.config.shopId}/receipts/${receiptId}/tracking`,
      {
        tracking_code: trackingCode,
        carrier_name: carrierName,
      }
    );

    return response.data;
  }

  /**
   * Shipping Profiles
   */

  /**
   * Create shipping profile
   */
  async createShippingProfile(profile: EtsyShippingProfile): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.post(
      `/application/shops/${this.config.shopId}/shipping-profiles`,
      profile
    );

    return response.data;
  }

  /**
   * Get shipping profiles
   */
  async getShippingProfiles(): Promise<any[]> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.get(
      `/application/shops/${this.config.shopId}/shipping-profiles`
    );

    return response.data.results || [];
  }

  /**
   * Shop Information
   */

  /**
   * Get shop details
   */
  async getShop(): Promise<any> {
    if (!this.config.shopId) {
      throw new Error('Shop ID is required');
    }

    const response = await this.client.get(
      `/application/shops/${this.config.shopId}`
    );

    return response.data;
  }

  /**
   * Taxonomy (Categories)
   */

  /**
   * Get seller taxonomy (categories)
   */
  async getTaxonomy(): Promise<any[]> {
    const response = await this.client.get('/application/seller-taxonomy/nodes');
    return response.data.results || [];
  }

  /**
   * Search taxonomy by name
   */
  async searchTaxonomy(query: string): Promise<any[]> {
    const allCategories = await this.getTaxonomy();
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Utility Methods
   */

  /**
   * Set access token
   */
  private setAccessToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Generate PKCE code verifier
   */
  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Generate PKCE code challenge
   */
  private generateCodeChallenge(verifier: string): string {
    return crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }

  /**
   * Validate listing data before creation
   */
  validateListing(listing: EtsyListing): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!listing.title || listing.title.length < 1 || listing.title.length > 140) {
      errors.push('Title must be between 1 and 140 characters');
    }

    if (!listing.description || listing.description.length < 1) {
      errors.push('Description is required');
    }

    if (!listing.price || listing.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (!listing.quantity || listing.quantity < 0) {
      errors.push('Quantity must be 0 or greater');
    }

    if (!listing.tags || listing.tags.length === 0) {
      errors.push('At least one tag is required');
    }

    if (listing.tags && listing.tags.length > 13) {
      errors.push('Maximum 13 tags allowed');
    }

    if (!listing.taxonomy_id) {
      errors.push('Taxonomy ID (category) is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default EtsyAPI;
