// Vercel Serverless Function for Grok Face Analysis
// Deploy this to Vercel - add XAI_API_KEY to environment variables

export const config = {
  maxDuration: 60, // Allow up to 60 seconds for Grok reasoning
};

interface AnalysisRequest {
  frontImage: string; // base64 encoded
  sideImage: string; // base64 encoded
  userData?: {
    name?: string;
    gender?: string;
    ageRange?: string;
    focusAreas?: string[];
  };
}

interface FacialMetric {
  id: string;
  label: string;
  score: number;
  potential: number;
  insights: string;
  improvements: string[];
}

interface AnalysisResponse {
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

const ANALYSIS_PROMPT = `You are an expert facial aesthetics analyst. Analyze the provided front and side profile images to evaluate facial features.

IMPORTANT: Provide honest, constructive analysis. Be encouraging but realistic.

Return a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "currentScore": <number 1-10, one decimal>,
  "potentialScore": <number 1-10, one decimal, always higher than currentScore>,
  "currentTier": "<BELOW AVERAGE|AVERAGE|ABOVE AVERAGE|ATTRACTIVE|VERY ATTRACTIVE>",
  "potentialTier": "<same scale, based on potential>",
  "metrics": [
    {
      "id": "jawline",
      "label": "Jawline & Lower Third",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<brief current state observation>",
      "improvements": ["<specific actionable improvement>", "<another improvement>"]
    },
    {
      "id": "eyes",
      "label": "Eye Area",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<observation>",
      "improvements": ["<improvement>", "<improvement>"]
    },
    {
      "id": "skin",
      "label": "Skin Quality",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<observation>",
      "improvements": ["<improvement>", "<improvement>"]
    },
    {
      "id": "facial_harmony",
      "label": "Facial Harmony & Symmetry",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<observation>",
      "improvements": ["<improvement>", "<improvement>"]
    },
    {
      "id": "midface",
      "label": "Midface & Cheekbones",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<observation>",
      "improvements": ["<improvement>", "<improvement>"]
    },
    {
      "id": "overall_impression",
      "label": "Overall Impression",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<observation>",
      "improvements": ["<improvement>", "<improvement>"]
    }
  ],
  "summary": "<2-3 sentence personalized summary of their potential and key focus areas>",
  "priorityActions": ["<top priority action>", "<second priority>", "<third priority>"]
}

User context (if provided):
- Gender: {{gender}}
- Age Range: {{ageRange}}
- Focus Areas: {{focusAreas}}

Analyze the images now and return ONLY the JSON response, no other text.`;

function getTierFromScore(score: number): string {
  if (score < 4) return 'BELOW AVERAGE';
  if (score < 5.5) return 'AVERAGE';
  if (score < 7) return 'ABOVE AVERAGE';
  if (score < 8.5) return 'ATTRACTIVE';
  return 'VERY ATTRACTIVE';
}

export default async function handler(req: Request): Promise<Response> {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body: AnalysisRequest = await req.json();
    const { frontImage, sideImage, userData } = body;

    if (!frontImage || !sideImage) {
      return new Response(
        JSON.stringify({ success: false, error: 'Both front and side images are required' }),
        { status: 400, headers }
      );
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      console.error('XAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'API configuration error' }),
        { status: 500, headers }
      );
    }

    // Prepare the prompt with user context
    let prompt = ANALYSIS_PROMPT;
    if (userData) {
      prompt = prompt
        .replace('{{gender}}', userData.gender || 'Not specified')
        .replace('{{ageRange}}', userData.ageRange || 'Not specified')
        .replace('{{focusAreas}}', userData.focusAreas?.join(', ') || 'General improvement');
    } else {
      prompt = prompt
        .replace('{{gender}}', 'Not specified')
        .replace('{{ageRange}}', 'Not specified')
        .replace('{{focusAreas}}', 'General improvement');
    }

    // Call Grok API with vision
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4-1-fast-reasoning-latest',
        messages: [
          {
            role: 'system',
            content: 'You are an expert facial aesthetics analyst. Always respond with valid JSON only, no markdown formatting.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: frontImage.startsWith('data:') ? frontImage : `data:image/jpeg;base64,${frontImage}`,
                },
              },
              {
                type: 'image_url',
                image_url: {
                  url: sideImage.startsWith('data:') ? sideImage : `data:image/jpeg;base64,${sideImage}`,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Analysis service error' }),
        { status: 500, headers }
      );
    }

    const grokData = await grokResponse.json();
    const content = grokData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: 'No analysis generated' }),
        { status: 500, headers }
      );
    }

    // Parse the JSON response from Grok
    let analysisResult;
    try {
      // Clean up potential markdown formatting
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      analysisResult = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse Grok response:', content);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse analysis' }),
        { status: 500, headers }
      );
    }

    // Validate and ensure required fields
    const response: AnalysisResponse = {
      success: true,
      currentScore: analysisResult.currentScore || 5.5,
      potentialScore: analysisResult.potentialScore || 8.0,
      currentTier: analysisResult.currentTier || getTierFromScore(analysisResult.currentScore || 5.5),
      potentialTier: analysisResult.potentialTier || getTierFromScore(analysisResult.potentialScore || 8.0),
      metrics: analysisResult.metrics || [],
      summary: analysisResult.summary || 'Analysis complete.',
      priorityActions: analysisResult.priorityActions || [],
    };

    return new Response(JSON.stringify(response), { status: 200, headers });

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}

