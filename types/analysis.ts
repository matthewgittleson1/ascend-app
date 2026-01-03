// Types for face analysis

export interface FacialMetric {
  id: string;
  label: string;
  score: number;
  potential: number;
  insights: string;
  improvements: string[];
}

export interface AnalysisResult {
  success: boolean;
  currentScore: number;
  potentialScore: number;
  currentTier: string;
  potentialTier: string;
  metrics: FacialMetric[];
  summary: string;
  priorityActions: string[];
  error?: string;
}

export interface AnalysisRequest {
  frontImage: string; // base64 encoded with data URI prefix
  sideImage: string; // base64 encoded with data URI prefix
  userData?: {
    name?: string;
    gender?: string;
    ageRange?: string;
    focusAreas?: string[];
  };
}

// Image data stored in context
export interface CapturedImages {
  frontImage: string | null; // base64 data URI
  sideImage: string | null; // base64 data URI
}

