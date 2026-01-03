# Ascend Face Analysis API

Vercel serverless function for facial analysis using Grok 4.1.

## Deployment Instructions

### 1. Navigate to the vercel-api folder
```bash
cd vercel-api
```

### 2. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Link to your existing project
Since you already created the project `ascend-app-phi`, link to it:
```bash
vercel link
```
Select "Link to existing project" and choose `ascend-app-phi`.

### 5. Add the XAI API Key
Go to https://vercel.com/your-username/ascend-app-phi/settings/environment-variables

Add a new environment variable:
- **Name:** `XAI_API_KEY`
- **Value:** Your xAI API key (starts with `xai-`)
- **Environment:** Production, Preview, Development

### 6. Deploy
```bash
vercel --prod
```

## API Endpoint

After deployment, your endpoint will be:
```
https://ascend-app-phi.vercel.app/api/analyze-face
```

## Testing

Test with curl:
```bash
curl -X POST https://ascend-app-phi.vercel.app/api/analyze-face \
  -H "Content-Type: application/json" \
  -d '{
    "frontImage": "data:image/jpeg;base64,...",
    "sideImage": "data:image/jpeg;base64,...",
    "userData": {
      "gender": "male",
      "ageRange": "25-34"
    }
  }'
```

## Response Format

```json
{
  "success": true,
  "currentScore": 6.2,
  "potentialScore": 8.5,
  "currentTier": "ABOVE AVERAGE",
  "potentialTier": "ATTRACTIVE",
  "metrics": [
    {
      "id": "jawline",
      "label": "Jawline & Lower Third",
      "score": 6.5,
      "potential": 8.8,
      "insights": "Good bone structure...",
      "improvements": ["Mewing exercises", "Reduce body fat"]
    }
  ],
  "summary": "Your analysis summary...",
  "priorityActions": ["Action 1", "Action 2", "Action 3"]
}
```

