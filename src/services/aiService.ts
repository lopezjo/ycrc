import { UserResponse } from '../types'

interface AIAnalysisResult {
  extractedData: Partial<UserResponse>
  nextQuestion?: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  empathicResponse: string
  suggestedCategories: string[]
  needsImmediateHelp: boolean
}

// Enable logging for debugging
const DEBUG_MODE = true

// STARTUP LOG - This should appear immediately when the module loads
console.log('🚀 [AI Service] Module loaded - DEBUG_MODE:', DEBUG_MODE)
console.log('🚀 [AI Service] Anthropic key present:', !!(import.meta as any).env?.VITE_ANTHROPIC_API_KEY)
console.log('🚀 [AI Service] OpenAI key present:', !!(import.meta as any).env?.VITE_OPENAI_API_KEY)

function log(...args: any[]) {
  if (DEBUG_MODE) {
    console.log('[AI Service]', ...args)
  }
}

function logError(...args: any[]) {
  console.error('[AI Service ERROR]', ...args)
}

// For demo purposes, we'll use a mock AI that simulates intelligent extraction
// In production, replace with actual OpenAI/Anthropic API calls
export async function analyzeUserMessage(
  userMessage: string,
  currentResponses: UserResponse,
  language: 'en' | 'es' = 'en'
): Promise<AIAnalysisResult> {
  log('Analyzing message:', userMessage)
  log('Current responses:', currentResponses)
  log('Language:', language)

  // Check if AI API key is available
  const openaiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY
  const anthropicKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY

  log('OpenAI key present:', !!openaiKey)
  log('Anthropic key present:', !!anthropicKey)

  if (anthropicKey) {
    log('Using Anthropic Claude API')
    return await callAnthropicAI(userMessage, currentResponses, language)
  } else if (openaiKey) {
    log('Using OpenAI API')
    return await callOpenAI(userMessage, currentResponses, language)
  } else {
    log('No API key found, using mock AI')
    // Intelligent mock for demo
    return mockAIAnalysis(userMessage, currentResponses, language)
  }
}

async function callAnthropicAI(
  userMessage: string,
  _currentResponses: UserResponse,
  language: 'en' | 'es'
): Promise<AIAnalysisResult> {
  const apiKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    logError('Anthropic API key not found')
    return mockAIAnalysis(userMessage, _currentResponses, language)
  }

  try {
    log('Calling proxy server for Anthropic API...')
    const response = await fetch('http://localhost:3001/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        currentResponses: _currentResponses,
        language: language
      })
    })

    log('Proxy API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      logError('Proxy API error:', errorText)
      return mockAIAnalysis(userMessage, _currentResponses, language)
    }

    const result = await response.json()
    log('Proxy API result:', result)

    return {
      extractedData: result.extractedData || {},
      urgencyLevel: result.urgencyLevel || 'medium',
      empathicResponse: result.empathicResponse || '',
      suggestedCategories: result.suggestedCategories || [],
      needsImmediateHelp: result.needsImmediateHelp || false,
      nextQuestion: result.nextQuestion
    }
  } catch (error) {
    logError('Proxy API call failed:', error)
    return mockAIAnalysis(userMessage, _currentResponses, language)
  }
}

async function callOpenAI(
  userMessage: string,
  _currentResponses: UserResponse,
  language: 'en' | 'es'
): Promise<AIAnalysisResult> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY

  if (!apiKey) {
    logError('OpenAI API key not found')
    return mockAIAnalysis(userMessage, _currentResponses, language)
  }

  const systemPrompt = `You are a compassionate intake specialist helping homeless youth find resources. Extract structured information from their messages to match them with services.

Your role:
- Be warm, empathetic, and non-judgmental
- Recognize urgency and crisis situations
- Extract key information: age, location, housing situation, needs
- Suggest related resources they might not know about
- Use simple, youth-friendly language

Extract and return JSON with:
{
  "extractedData": {object with any fields you can determine},
  "urgencyLevel": "low|medium|high|critical",
  "empathicResponse": "your warm, brief response",
  "suggestedCategories": ["Housing", "Food", etc],
  "needsImmediateHelp": boolean
}

Available fields to extract:
- age (number)
- location (string)
- situation (one of: "Need shelter/housing", "Need food", "Mental health support", "Education help", "Legal help")
- safePlaceTonight (boolean)
- housingDuration ("just-started"|"short-term"|"long-term")
- inSchool (boolean)
- hasId (boolean)
- hasIncome (boolean)`

  try {
    log('Calling OpenAI API...')
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User said: "${userMessage}"\n\nPrevious responses: ${JSON.stringify(_currentResponses)}\n\nLanguage: ${language}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 500
      })
    })

    log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      logError('OpenAI API error:', errorText)
      return mockAIAnalysis(userMessage, _currentResponses, language)
    }

    const data = await response.json()
    log('OpenAI API raw response:', data)

    const result = JSON.parse(data.choices[0].message.content)
    log('Parsed result:', result)

    return {
      extractedData: result.extractedData || {},
      urgencyLevel: result.urgencyLevel || 'medium',
      empathicResponse: result.empathicResponse || '',
      suggestedCategories: result.suggestedCategories || [],
      needsImmediateHelp: result.needsImmediateHelp || false,
      nextQuestion: result.nextQuestion
    }
  } catch (error) {
    logError('OpenAI API call failed:', error)
    return mockAIAnalysis(userMessage, _currentResponses, language)
  }
}

// Intelligent mock AI for demo purposes
function mockAIAnalysis(
  userMessage: string,
  _currentResponses: UserResponse,
  language: 'en' | 'es'
): AIAnalysisResult {
  log('Using mock AI analysis')
  const lowerMessage = userMessage.toLowerCase()
  const extractedData: Partial<UserResponse> = {}
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  let empathicResponse = ''
  const suggestedCategories: string[] = []
  let needsImmediateHelp = false

  // Extract age
  const ageMatch = lowerMessage.match(/\b(\d{1,2})\s*(years?\s*old|y\.?o\.?|yr)?\b/)
  if (ageMatch && parseInt(ageMatch[1]) >= 10 && parseInt(ageMatch[1]) <= 25) {
    extractedData.age = parseInt(ageMatch[1])
  }

  // Detect housing situation
  if (lowerMessage.match(/\b(homeless|no\s*where|sleeping\s*(in|on)|car|street|couch|shelter)\b/)) {
    extractedData.situation = 'Need shelter/housing'
    suggestedCategories.push('Housing')

    if (lowerMessage.match(/\b(tonight|today|now|urgent|nowhere|street|car)\b/)) {
      extractedData.safePlaceTonight = false
      urgencyLevel = 'critical'
      needsImmediateHelp = true
      empathicResponse = language === 'es'
        ? 'Entiendo que necesitas un lugar seguro esta noche. Déjame mostrarte las opciones más urgentes primero.'
        : "I understand you need a safe place tonight. Let me show you the most urgent options first."
    } else {
      urgencyLevel = 'high'
      empathicResponse = language === 'es'
        ? 'Encontrar una vivienda estable es realmente importante. Estoy aquí para ayudarte.'
        : "Finding stable housing is really important. I'm here to help you with that."
    }

    // Always suggest food for housing insecurity
    suggestedCategories.push('Food')
  }

  // Detect food insecurity
  if (lowerMessage.match(/\b(food|hungry|eat|meal|starving|haven't\s*eaten)\b/)) {
    if (!extractedData.situation) {
      extractedData.situation = 'Need food'
    }
    suggestedCategories.push('Food')
    urgencyLevel = urgencyLevel === 'critical' ? 'critical' : 'high'

    if (!empathicResponse) {
      empathicResponse = language === 'es'
        ? 'Te ayudaré a encontrar comida hoy. Hay recursos disponibles.'
        : "I'll help you find food today. There are resources available."
    }
  }

  // Detect mental health needs
  if (lowerMessage.match(/\b(depressed|anxious|suicide|mental\s*health|therapy|counseling|stressed|overwhelmed)\b/)) {
    if (!extractedData.situation) {
      extractedData.situation = 'Mental health support'
    }
    suggestedCategories.push('Mental Health')

    if (lowerMessage.match(/\b(suicide|kill\s*myself|end\s*my\s*life|hurt\s*myself)\b/)) {
      urgencyLevel = 'critical'
      needsImmediateHelp = true
      empathicResponse = language === 'es'
        ? 'Me preocupa tu seguridad. Hay personas disponibles 24/7 que quieren ayudarte. Por favor, considera contactar la línea de crisis.'
        : "I'm concerned about your safety. There are people available 24/7 who want to help you. Please consider reaching out to a crisis line."
    } else if (!empathicResponse) {
      empathicResponse = language === 'es'
        ? 'Cuidar tu salud mental es importante. Déjame mostrarte algunas opciones de apoyo.'
        : "Taking care of your mental health is important. Let me show you some support options."
    }
  }

  // Detect school-related
  if (lowerMessage.match(/\b(school|college|student|class|education|dropout)\b/)) {
    suggestedCategories.push('Education')

    if (lowerMessage.match(/\b(in\s*school|going\s*to\s*school|student)\b/)) {
      extractedData.inSchool = true
    }
  }

  // Extract location
  const locationMatch = lowerMessage.match(/\b(san\s*francisco|sf|los\s*angeles|la|oakland|sacramento|fresno|san\s*diego|san\s*jose)\b/)
  if (locationMatch) {
    const cityMap: Record<string, string> = {
      'sf': 'San Francisco',
      'la': 'Los Angeles',
      'san francisco': 'San Francisco',
      'los angeles': 'Los Angeles',
      'oakland': 'Oakland',
      'sacramento': 'Sacramento',
      'fresno': 'Fresno',
      'san diego': 'San Diego',
      'san jose': 'San Jose'
    }
    extractedData.location = cityMap[locationMatch[1].replace(/\s+/g, ' ')] || locationMatch[1]
  }

  // Duration detection
  if (lowerMessage.match(/\b(just\s*(started|began)|few\s*days|week|recently)\b/)) {
    extractedData.housingDuration = 'just-started'
  } else if (lowerMessage.match(/\b(months?|while|some\s*time)\b/)) {
    extractedData.housingDuration = 'short-term'
  } else if (lowerMessage.match(/\b(years?|long\s*time|forever)\b/)) {
    extractedData.housingDuration = 'long-term'
  }

  // Default empathic response if none set
  if (!empathicResponse) {
    empathicResponse = language === 'es'
      ? 'Gracias por compartir eso conmigo. Estoy aquí para ayudarte a encontrar los recursos que necesitas.'
      : "Thanks for sharing that with me. I'm here to help you find the resources you need."
  }

  // Suggest related categories based on primary need
  if (suggestedCategories.includes('Housing') && !suggestedCategories.includes('Food')) {
    suggestedCategories.push('Food')
  }
  if (suggestedCategories.includes('Housing') && extractedData.inSchool !== false) {
    suggestedCategories.push('Education')
  }

  const result = {
    extractedData,
    urgencyLevel,
    empathicResponse,
    suggestedCategories,
    needsImmediateHelp
  }

  log('Mock AI result:', result)
  return result
}
