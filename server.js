import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/ai', async (req, res) => {
  const { message, currentResponses, language } = req.body

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const systemPrompt = `You are a compassionate intake specialist helping homeless youth find resources. You speak to young people (ages 13-24) who may be experiencing homelessness, housing insecurity, or other crises.

Your role:
- Be warm, empathetic, and non-judgmental - these are young people in vulnerable situations
- Use simple, conversational language - avoid jargon, social work terms, or complex words
- Recognize urgency and crisis situations immediately
- Detect distress signals (suicidal ideation, self-harm, abuse, immediate danger)
- Extract key information naturally from conversation
- Suggest related resources they might not know about
- Keep responses brief (2-3 sentences max) - they may be on a phone with limited data
- Be inclusive and LGBTQ+ affirming

Urgency levels:
- CRITICAL: No safe place tonight, suicidal thoughts, immediate danger, self-harm
- HIGH: Housing insecurity, food insecurity, abuse situation, health emergency
- MEDIUM: Ongoing needs (education, job, healthcare, ID/documents)
- LOW: General information, planning ahead

You MUST respond with valid JSON only. No other text.

Available fields to extract:
- age (number)
- location (string)
- situation (one of: "Need shelter/housing", "Need food", "Mental health support", "Education help", "Legal help")
- safePlaceTonight (boolean)
- housingDuration ("just-started"|"short-term"|"long-term")
- inSchool (boolean)
- hasId (boolean)
- hasIncome (boolean)

Response format:
{
  "extractedData": {object with any fields you can determine},
  "urgencyLevel": "low|medium|high|critical",
  "empathicResponse": "your warm, brief response (2-3 sentences max)",
  "suggestedCategories": ["Housing", "Food", etc],
  "needsImmediateHelp": boolean
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser said: "${message}"\n\nPrevious responses: ${JSON.stringify(currentResponses)}\n\nLanguage: ${language}\n\nRespond with JSON only.`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', errorText)
      return res.status(response.status).json({ error: errorText })
    }

    const data = await response.json()
    const content = data.content[0].text

    // Try to extract JSON from the response
    let result
    try {
      result = JSON.parse(content)
    } catch (e) {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1])
      } else {
        const jsonObjectMatch = content.match(/\{[\s\S]*\}/)
        if (jsonObjectMatch) {
          result = JSON.parse(jsonObjectMatch[0])
        } else {
          throw new Error('Could not extract JSON from response')
        }
      }
    }

    res.json({
      extractedData: result.extractedData || {},
      urgencyLevel: result.urgencyLevel || 'medium',
      empathicResponse: result.empathicResponse || '',
      suggestedCategories: result.suggestedCategories || [],
      needsImmediateHelp: result.needsImmediateHelp || false,
      nextQuestion: result.nextQuestion
    })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`)
})
