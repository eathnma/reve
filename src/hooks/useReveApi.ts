'use client';

import { useState, useCallback } from 'react';
import {
  ReveAPI,
  CreateImageRequest,
  EditImageRequest,
  RemixImageRequest,
  ReveImageResponse,
  ReveAPIError,
  ResponseFormat,
  fileToBase64,
  base64ToDataUrl,
} from '@/lib/reve-api';

interface UseReveApiState {
  isLoading: boolean;
  error: ReveAPIError | Error | null;
  result: ReveImageResponse | null;
  imageUrl: string | null;
}

interface UseReveApiReturn extends UseReveApiState {
  createImage: (request: CreateImageRequest, options?: { responseFormat?: ResponseFormat }) => Promise<ReveImageResponse | null>;
  editImage: (request: EditImageRequest, options?: { responseFormat?: ResponseFormat }) => Promise<ReveImageResponse | null>;
  remixImage: (request: RemixImageRequest, options?: { responseFormat?: ResponseFormat }) => Promise<ReveImageResponse | null>;
  editImageWithFile: (prompt: string, file: File, options?: Omit<EditImageRequest, 'prompt' | 'image'>) => Promise<ReveImageResponse | null>;
  remixImageWithFiles: (prompt: string, files: File[], options?: Omit<RemixImageRequest, 'prompt' | 'images'>) => Promise<ReveImageResponse | null>;
  reset: () => void;
}

const apiKey = process.env.NEXT_PUBLIC_REVE_API_KEY;

export function useReveApi(): UseReveApiReturn {
  const [state, setState] = useState<UseReveApiState>({
    isLoading: false,
    error: null,
    result: null,
    imageUrl: null,
  });

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      imageUrl: null,
    });
  }, []);

  const handleRequest = useCallback(async <T extends ReveImageResponse>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await requestFn();
      const imageUrl = result.image ? base64ToDataUrl(result.image) : null;

      setState({
        isLoading: false,
        error: null,
        result,
        imageUrl,
      });

      return result;
    } catch (err) {
      console.error('Reve API Error:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error,
      }));
      return null;
    }
  }, []);

  const createImage = useCallback(async (
    request: CreateImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse | null> => {
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: new Error('NEXT_PUBLIC_REVE_API_KEY is not configured'),
      }));
      return null;
    }

    const api = new ReveAPI(apiKey);
    return handleRequest(() => api.create(request, options));
  }, [handleRequest]);

  const editImage = useCallback(async (
    request: EditImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse | null> => {
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: new Error('NEXT_PUBLIC_REVE_API_KEY is not configured'),
      }));
      return null;
    }

    const api = new ReveAPI(apiKey);
    return handleRequest(() => api.edit(request, options));
  }, [handleRequest]);

  const remixImage = useCallback(async (
    request: RemixImageRequest,
    options?: { responseFormat?: ResponseFormat }
  ): Promise<ReveImageResponse | null> => {
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: new Error('NEXT_PUBLIC_REVE_API_KEY is not configured'),
      }));
      return null;
    }

    const api = new ReveAPI(apiKey);
    return handleRequest(() => api.remix(request, options));
  }, [handleRequest]);

  const editImageWithFile = useCallback(async (
    editInstruction: string,
    file: File,
    options?: Omit<EditImageRequest, 'edit_instruction' | 'reference_image'>
  ): Promise<ReveImageResponse | null> => {
    const base64 = await fileToBase64(file);
    return editImage({ edit_instruction: editInstruction, reference_image: base64, ...options });
  }, [editImage]);

  const remixImageWithFiles = useCallback(async (
    prompt: string,
    files: File[],
    options?: Omit<RemixImageRequest, 'prompt' | 'images'>
  ): Promise<ReveImageResponse | null> => {
    const images = await Promise.all(files.map(fileToBase64));
    return remixImage({ prompt, images, ...options });
  }, [remixImage]);

  return {
    ...state,
    createImage,
    editImage,
    remixImage,
    editImageWithFile,
    remixImageWithFiles,
    reset,
  };
}

export default useReveApi;
