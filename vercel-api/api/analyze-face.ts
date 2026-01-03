// Vercel Serverless Function for Grok Face Analysis
// Deploy this to Vercel - add XAI_API_KEY to environment variables

export const config = {
  runtime: 'edge',
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

const ANALYSIS_PROMPT = `You are an expert PSL (Pretty Scale Level) facial aesthetics analyst specializing in looksmaxxing. Analyze the provided front and side profile images using objective facial harmony principles.

SCORING PHILOSOPHY:
- Use the TRUE PSL scale where 5.0 is genuinely average. Most people score 4.0-6.0.
- Be CRITICAL on current scores - identify genuine areas for improvement. Don't inflate.
- Be GENEROUS on potential scores - show what's achievable with proper looksmaxxing.
- The gap between current and potential should motivate action (typically 1.5-3.0 points difference).
- Score each category independently based on objective criteria.

PSL TIER SCALE:
- 1.0-3.9: Below Average (significant asymmetry, recession, or harmony issues)
- 4.0-5.4: Average (typical features, room for softmaxxing improvements)
- 5.5-6.4: Above Average (good base, minor refinements needed)
- 6.5-7.9: Attractive (strong features, approaching model-tier with optimization)
- 8.0-10.0: Very Attractive (elite tier, minimal improvements possible)

CATEGORY ANALYSIS CRITERIA:

1. JAWLINE & LOWER THIRD: Assess mandibular definition, gonial angle, chin projection (Marlon-tier features). Look for recession, weak masseter development, submental fat.

2. EYE AREA: Evaluate canthal tilt, under-eye support, orbital rim projection, interpupillary harmony, hunter vs prey eye assessment. Check for upper eyelid exposure, scleral show.

3. SKIN QUALITY: Analyze texture, clarity, collagen quality, hyperpigmentation, acne scarring, pore visibility. Consider age-appropriate expectations.

4. FACIAL HARMONY & SYMMETRY: Measure thirds ratio, facial width-to-height, midline alignment, feature proportions. Identify asymmetries.

5. MIDFACE & CHEEKBONES: Evaluate zygomatic projection, infraorbital support, midface length ratio, ogee curve. Look for flat or recessed cheekbones.

6. OVERALL IMPRESSION (HALO): The gestalt effect - how features combine. First impression impact, phenotype harmony, standout features vs failo.

Return a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "currentScore": <number 1-10, one decimal - BE CRITICAL>,
  "potentialScore": <number 1-10, one decimal - BE OPTIMISTIC, always 1.5-3.0 higher than current>,
  "currentTier": "<BELOW AVERAGE|AVERAGE|ABOVE AVERAGE|ATTRACTIVE|VERY ATTRACTIVE>",
  "potentialTier": "<same scale, based on looksmaxxing potential>",
  "metrics": [
    {
      "id": "jawline",
      "label": "Jawline & Lower Third",
      "score": <1-10, critical assessment>,
      "potential": <1-10, after mewing/training>,
      "insights": "<PSL-informed observation using terms like gonial angle, mandible, chin projection>",
      "improvements": ["<specific looksmaxxing technique>", "<another actionable step>"]
    },
    {
      "id": "eyes",
      "label": "Eye Area",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<assessment of canthal tilt, orbital area, hunter eyes potential>",
      "improvements": ["<specific improvement>", "<technique or treatment>"]
    },
    {
      "id": "skin",
      "label": "Skin Quality",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<texture, clarity, collagen assessment>",
      "improvements": ["<skincare protocol>", "<treatment option>"]
    },
    {
      "id": "facial_harmony",
      "label": "Facial Harmony & Symmetry",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<thirds ratio, symmetry analysis>",
      "improvements": ["<corrective approach>", "<optimization technique>"]
    },
    {
      "id": "midface",
      "label": "Midface & Cheekbones",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<zygomatic projection, infraorbital assessment>",
      "improvements": ["<enhancement method>", "<technique>"]
    },
    {
      "id": "overall_impression",
      "label": "Overall Impression",
      "score": <1-10>,
      "potential": <1-10>,
      "insights": "<halo effect, standout features, areas holding back overall rating>",
      "improvements": ["<highest impact change>", "<secondary focus>"]
    }
  ],
  "summary": "<2-3 sentences using looksmaxxing terminology. Be direct about current level, enthusiastic about potential. Mention their biggest 'failo' and biggest 'halo'>",
  "priorityActions": ["<#1 looksmaxxing priority>", "<#2 priority>", "<#3 priority>"]
}

User context:
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
  console.log('[API] Request received:', req.method);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('[API] Handling OPTIONS preflight');
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    console.log('[API] Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    console.log('[API] Parsing request body...');
    const body: AnalysisRequest = await req.json();
    const { frontImage, sideImage, userData } = body;

    console.log('[API] Front image length:', frontImage?.length || 0);
    console.log('[API] Side image length:', sideImage?.length || 0);
    console.log('[API] User data:', JSON.stringify(userData));

    if (!frontImage || !sideImage) {
      console.log('[API] Missing images');
      return new Response(
        JSON.stringify({ success: false, error: 'Both front and side images are required' }),
        { status: 400, headers }
      );
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      console.error('[API] XAI_API_KEY not configured!');
      return new Response(
        JSON.stringify({ success: false, error: 'API configuration error - missing API key' }),
        { status: 500, headers }
      );
    }
    console.log('[API] API key found, length:', apiKey.length);

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
    console.log('[API] Calling Grok API...');
    const grokStartTime = Date.now();
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

    console.log('[API] Grok response received in', Date.now() - grokStartTime, 'ms');
    console.log('[API] Grok response status:', grokResponse.status);

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('[API] Grok API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Analysis service error: ${grokResponse.status}` }),
        { status: 500, headers }
      );
    }

    const grokData = await grokResponse.json();
    const content = grokData.choices?.[0]?.message?.content;
    
    // Token usage logging
    const usage = grokData.usage;
    if (usage) {
      console.log('[API] Token Usage - Prompt:', usage.prompt_tokens, '| Completion:', usage.completion_tokens, '| Total:', usage.total_tokens);
      // Rough cost estimate (adjust based on actual Grok pricing)
      const estimatedCost = ((usage.prompt_tokens * 0.00001) + (usage.completion_tokens * 0.00003)).toFixed(4);
      console.log('[API] Estimated cost: $' + estimatedCost);
    }
    console.log('[API] Grok content length:', content?.length || 0);

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

    // Log detailed category breakdown
    console.log('[API] ===== ANALYSIS RESULTS =====');
    console.log('[API] Overall:', response.currentScore, '(' + response.currentTier + ') -> Potential:', response.potentialScore, '(' + response.potentialTier + ')');
    if (response.metrics && response.metrics.length > 0) {
      console.log('[API] ----- Category Scores -----');
      for (const metric of response.metrics) {
        console.log('[API]', metric.label + ':', metric.score, '->', metric.potential, '|', metric.insights?.substring(0, 60) + '...');
      }
    }
    console.log('[API] Summary:', response.summary?.substring(0, 100) + '...');
    console.log('[API] Priority Actions:', response.priorityActions?.join(' | '));
    console.log('[API] =============================');
    return new Response(JSON.stringify(response), { status: 200, headers });

  } catch (error) {
    console.error('[API] Handler error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers }
    );
  }
}

