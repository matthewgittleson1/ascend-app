// Grok Face Analysis API Service

import { API_CONFIG, getAnalyzeUrl } from '@/config/api';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';

export async function analyzeFace(request: AnalysisRequest): Promise<AnalysisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(getAnalyzeUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result: AnalysisResult = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Analysis timed out. Please try again.');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred');
  }
}

// Utility to convert image URI to base64 data URI
export async function imageToBase64(uri: string): Promise<string> {
  // If already a data URI, return as-is
  if (uri.startsWith('data:')) {
    return uri;
  }

  // For file:// URIs (from camera/picker), we need to fetch and convert
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

