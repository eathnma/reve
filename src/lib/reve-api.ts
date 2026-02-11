/**
 * Reve API Client
 * Documentation: https://api.reve.com/console/docs
 */

const REVE_API_BASE = 'https://api.reve.com/v1';

// ============================================================================
// Types
// ============================================================================

export type ResponseFormat = 'application/json' | 'image/png' | 'image/jpeg' | 'image/webp';

export interface PostprocessingUpscale {
  process: 'upscale';
  upscale_factor: 1 | 2 | 3 | 4;
}

export interface PostprocessingRemoveBackground {
  process: 'remove_background';
}

export interface PostprocessingFitImage {
  process: 'fit_image';
  max_dim?: number;
  max_width?: number;
  max_height?: number;
}

export interface PostprocessingEffect {
  process: 'effect';
  effect_name: string;
  effect_parameters?: Record<string, Record<string, unknown>>;
}

export type Postprocessing =
  | PostprocessingUpscale
  | PostprocessingRemoveBackground
  | PostprocessingFitImage
  | PostprocessingEffect;

// Base request options shared across endpoints
export interface BaseRequestOptions {
  test_time_scaling?: number; // 1-15, default 1
  postprocessing?: Postprocessing[];
  breadcrumb?: string;
}

// Create endpoint
export interface CreateImageRequest extends BaseRequestOptions {
  prompt: string;
}

// Edit endpoint
export interface EditImageRequest extends BaseRequestOptions {
  edit_instruction: string;
  reference_image: string; // base64 encoded image
  aspect_ratio?: string;
  version?: string; // 'latest', 'latest-fast', 'reve-edit@20250915', 'reve-edit-fast@20251030'
}

// Remix endpoint
export interface RemixImageRequest extends BaseRequestOptions {
  prompt: string;
  images: string[]; // array of base64 encoded images
}

// Response types
export interface ReveImageResponse {
  image: string; // base64 encoded PNG
  metadata: {
    version: string;
    credits_used: number;
    credits_remaining: number;
    content_violation: boolean;
    request_id: string;
  };
}

export interface ReveErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface ReveResponseHeaders {
  'x-reve-content-violation'?: string;
  'x-reve-request-id'?: string;
  'x-reve-version'?: string;
  'x-reve-credits-used'?: string;
  'x-reve-credits-remaining'?: string;
  'x-reve-error-code'?: string;
}

// ============================================================================
// API Client Class
// ============================================================================

export class ReveAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    body: Record<string, unknown>,
    options: {
      responseFormat?: ResponseFormat;
      breadcrumb?: string;
    } = {}
  ): Promise<{ data: T; headers: ReveResponseHeaders }> {
    const { responseFormat = 'application/json', breadcrumb } = options;

    let url = `${REVE_API_BASE}${endpoint}`;
    if (breadcrumb) {
      url += `?breadcrumb=${encodeURIComponent(breadcrumb)}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': responseFormat,
      },
      body: JSON.stringify(body),
    });

    const headers: ReveResponseHeaders = {
      'x-reve-content-violation': response.headers.get('x-reve-content-violation') || undefined,
      'x-reve-request-id': response.headers.get('x-reve-request-id') || undefined,
      'x-reve-version': response.headers.get('x-reve-version') || undefined,
      'x-reve-credits-used': response.headers.get('x-reve-credits-used') || undefined,
      'x-reve-credits-remaining': response.headers.get('x-reve-credits-remaining') || undefined,
      'x-reve-error-code': response.headers.get('x-reve-error-code') || undefined,
    };

    if (!response.ok) {
      let errorData: ReveErrorResponse;
      let rawText = '';
      try {
        rawText = await response.text();
        errorData = JSON.parse(rawText) as ReveErrorResponse;
      } catch {
        errorData = { error: { code: 'PARSE_ERROR', message: `HTTP ${response.status}: ${response.statusText}` } };
      }
      console.error('Reve API Error - Status:', response.status);
      console.error('Reve API Error - Status Text:', response.statusText);
      console.error('Reve API Error - Raw Response:', rawText);
      console.error('Reve API Error - Parsed:', JSON.stringify(errorData));
      throw new ReveAPIError(
        errorData.error?.message || `HTTP ${response.status}: ${rawText || response.statusText}`,
        response.status,
        errorData.error?.code || headers['x-reve-error-code'] || 'UNKNOWN',
        headers['x-reve-request-id']
      );
    }

    let data: T;
    if (responseFormat === 'application/json') {
      data = await response.json() as T;
    } else {
      // For image formats, return the blob as base64
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      data = {
        image: base64,
        format: responseFormat.split('/')[1],
        metadata: {
          version: headers['x-reve-version'],
          credits_used: headers['x-reve-credits-used'] ? parseInt(headers['x-reve-credits-used']) : undefined,
          credits_remaining: headers['x-reve-credits-remaining'] ? parseInt(headers['x-reve-credits-remaining']) : undefined,
          content_violation: headers['x-reve-content-violation'] === 'true',
          request_id: headers['x-reve-request-id'],
        },
      } as T;
    }

    return { data, headers };
  }

  /**
   * Generate images from text descriptions.
   * Perfect for creating original artwork, illustrations, and visual content.
   */
  async create(
    request: CreateImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse> {
    const { breadcrumb, ...body } = request;
    const { data } = await this.request<ReveImageResponse>(
      '/image/create',
      body,
      { responseFormat: options?.responseFormat, breadcrumb }
    );
    return data;
  }

  /**
   * Modify existing images using text instructions.
   * Upload an image and describe the changes you want to make.
   */
  async edit(
    request: EditImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse> {
    const { breadcrumb, ...body } = request;
    // Use latest version by default
    const requestBody = {
      ...body,
      version: body.version || 'latest',
    };
    console.log('Reve Edit API Request:', {
      endpoint: '/image/edit',
      version: requestBody.version,
      edit_instruction: requestBody.edit_instruction,
      reference_image_length: requestBody.reference_image?.length
    });
    const { data } = await this.request<ReveImageResponse>(
      '/image/edit',
      requestBody,
      { responseFormat: options?.responseFormat, breadcrumb }
    );
    return data;
  }

  /**
   * Combine text prompts with reference images to create new variations.
   * Blend styles, concepts, and visual elements.
   */
  async remix(
    request: RemixImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse> {
    const { breadcrumb, ...body } = request;
    const { data } = await this.request<ReveImageResponse>(
      '/image/remix',
      body,
      { responseFormat: options?.responseFormat, breadcrumb }
    );
    return data;
  }
}

// ============================================================================
// Error Class
// ============================================================================

export class ReveAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ReveAPIError';
  }

  /**
   * Check if the error is due to rate limiting
   */
  isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  /**
   * Check if the error is due to insufficient credits
   */
  isInsufficientCredits(): boolean {
    return this.statusCode === 402;
  }

  /**
   * Check if the error is due to content policy violation
   */
  isContentViolation(): boolean {
    return this.errorCode === 'CONTENT_POLICY_VIOLATION';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert a File or Blob to base64 string for API requests
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a base64 string to a Blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Convert a base64 string to a data URL for display in img elements
 */
export function base64ToDataUrl(base64: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Create a download link for a base64 image
 */
export function downloadBase64Image(base64: string, filename: string, mimeType: string = 'image/png'): void {
  const blob = base64ToBlob(base64, mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// Singleton Instance
// ============================================================================

let reveApiInstance: ReveAPI | null = null;

/**
 * Get the Reve API client instance.
 * Uses NEXT_PUBLIC_REVE_API_KEY environment variable.
 */
export function getReveApi(): ReveAPI {
  if (!reveApiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_REVE_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_REVE_API_KEY environment variable is not set');
    }
    reveApiInstance = new ReveAPI(apiKey);
  }
  return reveApiInstance;
}

/**
 * Create a new Reve API client with a custom API key
 */
export function createReveApi(apiKey: string): ReveAPI {
  return new ReveAPI(apiKey);
}
