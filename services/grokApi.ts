// Grok Face Analysis API Service

import { API_CONFIG, getAnalyzeUrl } from '@/config/api';
import { AnalysisRequest, AnalysisResult } from '@/types/analysis';

export async function analyzeFace(request: AnalysisRequest): Promise<AnalysisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const apiUrl = getAnalyzeUrl();
  console.log('[analyzeFace] Starting analysis...');
  console.log('[analyzeFace] API URL:', apiUrl);
  console.log('[analyzeFace] Request userData:', JSON.stringify(request.userData));
  console.log('[analyzeFace] Front image length:', request.frontImage?.length || 0);
  console.log('[analyzeFace] Side image length:', request.sideImage?.length || 0);

  try {
    console.log('[analyzeFace] Sending POST request...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[analyzeFace] Response status:', response.status);
    console.log('[analyzeFace] Response ok:', response.ok);
    console.log('[analyzeFace] Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[analyzeFace] Error response body:', errorText);
      
      // Try to parse as JSON, otherwise use the text
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If not JSON, check if it's an HTML 404 page
        if (response.status === 404) {
          errorMessage = 'API endpoint not found (404). Please check if the Vercel API is deployed.';
        }
      }
      throw new Error(errorMessage);
    }

    const result: AnalysisResult = await response.json();
    console.log('[analyzeFace] Analysis successful, score:', result.score);
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[analyzeFace] Caught error:', error);
    
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

