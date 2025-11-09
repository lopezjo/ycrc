import { useState, useRef, useEffect } from 'react'
import { Message, UserResponse } from '../types'
import { analyzeUserMessage } from '../services/aiService'
import { useLanguage } from '../i18n/LanguageContext'
import MessageBubble from './MessageBubble'
import './AIChat.css'

interface AIChatProps {
  onDataExtracted: (data: UserResponse) => void
  onShowResources: () => void
  initialResponses: UserResponse
  isVisible?: boolean
}

export default function AIChat({ onDataExtracted, onShowResources, initialResponses, isVisible = true }: AIChatProps) {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [responses, setResponses] = useState<UserResponse>(initialResponses)
  const [messageCount, setMessageCount] = useState(0)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [useAI, setUseAI] = useState(false)
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Onboarding questions with quick action buttons
  const onboardingQuestions = [
    {
      en: "Hey! Welcome. I'm here to help you find resources and support that might be helpful for you.\n\nBefore we start, I'd love to know what to call you. What's your name? (You can skip this if you'd prefer not to share)",
      es: "¡Hola! Bienvenido/a. Estoy aquí para ayudarte a encontrar recursos y apoyo que puedan serte útiles.\n\nAntes de comenzar, me gustaría saber cómo llamarte. ¿Cuál es tu nombre? (Puedes omitir esto si prefieres no compartirlo)",
      field: 'name',
      optional: true,
      quickActions: null
    },
    {
      en: "Thanks{name}! To help match you with the right resources, can you share how old you are?\n\n(This helps me find programs specifically for your age group. It's okay to skip if you're not comfortable sharing)",
      es: "¡Gracias{name}! Para ayudarte a encontrar los recursos adecuados, ¿puedes compartir cuántos años tienes?\n\n(Esto me ayuda a encontrar programas específicos para tu grupo de edad. Está bien omitirlo si no te sientes cómodo/a compartiéndolo)",
      field: 'age',
      optional: true,
      quickActions: [
        { label: { en: '13-17', es: '13-17' }, value: '13-17', numericValue: 16 },
        { label: { en: '18-24', es: '18-24' }, value: '18-24', numericValue: 20 }
      ]
    },
    {
      en: "Got it. What city or area are you in right now?\n\n(This helps me show you resources that are actually nearby and available to you. You can skip this too)",
      es: "Entendido. ¿En qué ciudad o área te encuentras ahora?\n\n(Esto me ayuda a mostrarte recursos que realmente están cerca y disponibles para ti. También puedes omitir esto)",
      field: 'location',
      optional: true,
      quickActions: [
        { label: { en: 'San Francisco', es: 'San Francisco' }, value: 'San Francisco' },
        { label: { en: 'Oakland', es: 'Oakland' }, value: 'Oakland' },
        { label: { en: 'San Jose', es: 'San Jose' }, value: 'San Jose' },
        { label: { en: 'Los Angeles', es: 'Los Angeles' }, value: 'Los Angeles' }
      ]
    }
  ]

  // Detect user's location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try browser geolocation API first
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              console.log('🌍 [Location] Got coordinates:', latitude, longitude)

              // Reverse geocode to get city name
              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                )
                const data = await response.json()
                const city = data.address?.city || data.address?.town || data.address?.county
                if (city) {
                  console.log('🌍 [Location] Detected city:', city)
                  setDetectedCity(city)
                }
              } catch (err) {
                console.log('🌍 [Location] Reverse geocoding failed:', err)
              }
            },
            (error) => {
              console.log('🌍 [Location] Geolocation denied or failed:', error.message)
            },
            { timeout: 5000, enableHighAccuracy: false }
          )
        }
      } catch (err) {
        console.log('🌍 [Location] Detection failed:', err)
      }
    }

    detectLocation()
  }, [])

  useEffect(() => {
    // Initial greeting - consent is handled at App level
    const greeting: Message = {
      id: 'ai-greeting',
      text: onboardingQuestions[0][language],
      sender: 'assistant',
      timestamp: new Date(),
      type: 'question'
    }
    setMessages([greeting])
  }, [language])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus()
    }
  }, [messages, isProcessing, isVisible])

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputValue.trim()
    setInputValue('')
    setIsProcessing(true)

    await processMessage(messageText)
  }

  const processMessage = async (messageText: string) => {
    try {
      // Handle onboarding questions first
      if (!useAI && onboardingStep < onboardingQuestions.length) {
        const currentQuestion = onboardingQuestions[onboardingStep]
        const updatedResponses = { ...responses }

        // Check if user wants to skip
        const skipKeywords = ['skip', 'pass', 'next', 'saltar', 'omitir', 'siguiente']
        const isSkipping = skipKeywords.some(keyword => messageText.toLowerCase().includes(keyword))

        if (!isSkipping && messageText.trim()) {
          // Use AI to extract structured data from natural language responses
          console.log('🔵 [AIChat Onboarding] Extracting from:', messageText)
          const extraction = await analyzeUserMessage(messageText, responses, language)
          console.log('🔵 [AIChat Onboarding] Extraction result:', extraction)

          // CHECK FOR DISTRESS DURING ONBOARDING
          if (extraction.distressDetected) {
            console.log('🔴 [AIChat Onboarding] Distress detected during onboarding:', extraction.distressLevel, extraction.distressIndicators)

            // Show empathetic response immediately
            const distressResponse: Message = {
              id: `distress-response-${Date.now()}`,
              text: extraction.empathicResponse,
              sender: 'assistant',
              timestamp: new Date(),
              type: 'response'
            }
            setMessages(prev => [...prev, distressResponse])

            // Add supportive message based on distress level
            setTimeout(() => {
              let supportMessage = ''

              if (extraction.distressLevel === 'crisis' || extraction.distressLevel === 'severe') {
                supportMessage = language === 'es'
                  ? '💚 Tu bienestar es lo más importante. No necesitas responder ninguna pregunta ahora mismo. ¿Te gustaría ver recursos de crisis, o prefieres tomarte un momento? También puedes omitir cualquier pregunta.'
                  : "💚 Your wellbeing is what matters most. You don't need to answer any questions right now. Would you like to see crisis resources, or would you prefer to take a moment? You can also skip any questions."
              } else if (extraction.distressLevel === 'moderate') {
                supportMessage = language === 'es'
                  ? '💙 No hay prisa. Puedes omitir cualquier pregunta o simplemente tomarte un descanso. Estoy aquí cuando estés listo/a.'
                  : "💙 There's no rush. You can skip any questions or just take a break. I'm here when you're ready."
              } else if (extraction.distressLevel === 'mild') {
                supportMessage = language === 'es'
                  ? '💛 Está bien ir a tu propio ritmo. Puedes omitir cualquier pregunta.'
                  : "💛 It's okay to go at your own pace. You can skip any questions."
              }

              if (supportMessage) {
                const supportMsg: Message = {
                  id: `distress-support-onboarding-${Date.now()}`,
                  text: supportMessage,
                  sender: 'assistant',
                  timestamp: new Date(),
                  type: 'context'
                }
                setMessages(prev => [...prev, supportMsg])
              }
            }, 800)
          }

          // Save the response based on field type
          if (currentQuestion.field === 'age') {
            // Check if this was a quick action button with a numericValue
            const quickAction = currentQuestion.quickActions?.find(a => a.value === messageText)
            if (quickAction && 'numericValue' in quickAction) {
              // Use the numeric value for eligibility matching
              updatedResponses.age = (quickAction as any).numericValue
            } else if (extraction.extractedData.age) {
              // Try extracted age from AI
              updatedResponses.age = extraction.extractedData.age
            } else {
              // Try parsing the message directly
              const age = parseInt(messageText)
              if (!isNaN(age) && age > 0 && age < 100) {
                updatedResponses.age = age
              }
            }
          } else if (currentQuestion.field === 'name') {
            // Extract name from natural language
            // Look for patterns like "My name is X", "I'm X", "Call me X"
            let name = messageText.trim()
            const namePatterns = [
              /(?:my name is|i'm|im|call me|this is)\s+([a-z]+)/i,
              /^([a-z]+)$/i  // Just a single word
            ]

            for (const pattern of namePatterns) {
              const match = messageText.match(pattern)
              if (match) {
                name = match[1]
                break
              }
            }

            // Capitalize first letter
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            sessionStorage.setItem('userName', name)
          } else if (currentQuestion.field === 'location') {
            // Try extracted location first, fallback to raw message
            if (extraction.extractedData.location) {
              updatedResponses.location = extraction.extractedData.location
            } else {
              updatedResponses.location = messageText
            }
          }
        }

        setResponses(updatedResponses)
        onDataExtracted(updatedResponses)

        // Move to next question or transition to AI
        const nextStep = onboardingStep + 1
        setOnboardingStep(nextStep)

        if (nextStep < onboardingQuestions.length) {
          // Show next onboarding question
          setTimeout(() => {
            const userName = sessionStorage.getItem('userName')
            let questionText = onboardingQuestions[nextStep][language]

            // Personalize with name if available
            if (userName && questionText.includes('{name}')) {
              questionText = questionText.replace('{name}', ` ${userName}`)
            } else {
              questionText = questionText.replace('{name}', '')
            }

            const nextQuestion: Message = {
              id: `ai-onboarding-${nextStep}`,
              text: questionText,
              sender: 'assistant',
              timestamp: new Date(),
              type: 'question'
            }
            setMessages(prev => [...prev, nextQuestion])
            setIsProcessing(false)
          }, 800)
        } else {
          // Transition to AI-powered conversation
          setUseAI(true)
          setTimeout(() => {
            const userName = sessionStorage.getItem('userName')
            const transitionText = language === 'es'
              ? `Perfecto${userName ? `, ${userName}` : ''}. Ahora, cuéntame qué está pasando y cómo puedo ayudarte mejor.\n\n¿Qué es lo más importante que necesitas en este momento?`
              : `Perfect${userName ? `, ${userName}` : ''}. Now, tell me what's going on and how I can best help you.\n\nWhat's the most important thing you need right now?`

            const transition: Message = {
              id: 'ai-transition',
              text: transitionText,
              sender: 'assistant',
              timestamp: new Date(),
              type: 'question'
            }
            setMessages(prev => [...prev, transition])
            setIsProcessing(false)
          }, 800)
        }
        return
      }

      // AI-powered conversation (after onboarding)
      setMessageCount(prev => prev + 1)
      console.log('🔵 [AIChat] About to call analyzeUserMessage with:', messageText)
      const analysis = await analyzeUserMessage(messageText, responses, language)
      console.log('🔵 [AIChat] Got analysis result:', analysis)

      // Update responses with extracted data - filter out undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(analysis.extractedData).filter(([_, v]) => v !== undefined)
      ) as UserResponse
      const updatedResponses: UserResponse = { ...responses, ...cleanedData }
      setResponses(updatedResponses)
      onDataExtracted(updatedResponses)

      // Add AI response
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: analysis.empathicResponse,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'response'
      }
      setMessages(prev => [...prev, aiResponse])

      // Handle distress detection - add supportive message
      if (analysis.distressDetected) {
        console.log('🔴 [AIChat] Distress detected:', analysis.distressLevel, analysis.distressIndicators)

        setTimeout(() => {
          let supportMessage = ''

          if (analysis.distressLevel === 'crisis' || analysis.distressLevel === 'severe') {
            // For crisis/severe: Offer crisis resources and affirm their control
            supportMessage = language === 'es'
              ? '💚 Recuerda: puedes pausar en cualquier momento, omitir cualquier pregunta, o simplemente tomarte un descanso. No hay prisa. También puedo mostrarte recursos de crisis ahora mismo si lo necesitas.'
              : "💚 Remember: you can pause at any time, skip any questions, or just take a break. There's no rush. I can also show you crisis resources right now if you need them."
          } else if (analysis.distressLevel === 'moderate') {
            // For moderate: Gentle reminder about pacing
            supportMessage = language === 'es'
              ? '💙 Está bien ir despacio. Puedes omitir cualquier pregunta o tomar un descanso cuando lo necesites. Estoy aquí para ayudarte.'
              : "💙 It's okay to go slowly. You can skip any questions or take a break whenever you need. I'm here to help."
          } else if (analysis.distressLevel === 'mild') {
            // For mild: Brief acknowledgment
            supportMessage = language === 'es'
              ? '💛 Recuerda que puedes ir a tu propio ritmo. No hay presión.'
              : "💛 Remember you can go at your own pace. No pressure."
          }

          if (supportMessage) {
            const supportMsg: Message = {
              id: `distress-support-${Date.now()}`,
              text: supportMessage,
              sender: 'assistant',
              timestamp: new Date(),
              type: 'context'
            }
            setMessages(prev => [...prev, supportMsg])
          }
        }, 1000) // Delay to let the empathic response be read first
      }

      // If urgent or enough info collected, offer to show resources
      if (analysis.needsImmediateHelp || messageCount >= 2) {
        setTimeout(() => {
          const resourceText = analysis.needsImmediateHelp
            ? (language === 'es'
              ? "Déjame mostrarte los recursos más urgentes disponibles ahora mismo. También hay soporte disponible 24/7 si necesitas hablar con alguien."
              : "Let me show you the most urgent resources available right now. There's also 24/7 support available if you need to talk to someone.")
            : (language === 'es'
              ? "Tengo suficiente información para mostrarte algunos recursos que podrían ayudarte. ¿Te gustaría verlos ahora, o hay algo más que quieras contarme primero?"
              : "I have enough information to show you some resources that might help. Would you like to see them now, or is there anything else I can help you with?")
          const resourcePrompt: Message = {
            id: `ai-resources-${Date.now()}`,
            text: resourceText,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'question'
          }
          setMessages(prev => [...prev, resourcePrompt])
        }, 500)
      } else if (analysis.nextQuestion) {
        // AI suggested a follow-up question
        setTimeout(() => {
          const followUp: Message = {
            id: `ai-followup-${Date.now()}`,
            text: analysis.nextQuestion || '',
            sender: 'assistant',
            timestamp: new Date(),
            type: 'question'
          }
          setMessages(prev => [...prev, followUp])
        }, 500)
      } else if (analysis.suggestedCategories.length > 0 && messageCount === 1) {
        // Suggest additional needs
        setTimeout(() => {
          const suggestion: Message = {
            id: `ai-suggestion-${Date.now()}`,
            text: language === 'es'
              ? `Además de ${analysis.suggestedCategories.length > 0 ? analysis.suggestedCategories[0] : 'tu situación'}, muchas personas también necesitan ayuda con cosas como comida, transporte o educación. ¿Hay algo más con lo que pueda ayudarte?`
              : `Besides ${analysis.suggestedCategories.length > 0 ? analysis.suggestedCategories[0] : 'your situation'}, many people also need help with things like food, transportation, or education. Is there anything else I can help you with?`,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'question'
          }
          setMessages(prev => [...prev, suggestion])
        }, 500)
      }

    } catch (error) {
      console.error('Error analyzing message:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: language === 'es'
          ? "Lo siento, tuve un problema. ¿Puedes intentar decirme de nuevo qué necesitas?"
          : "I'm sorry, I had a hiccup. Can you try telling me again what you need?",
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickResponse = async (response: string) => {
    // Directly send the response without updating input value
    if (isProcessing) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: response,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    // Handle onboarding or AI response
    await processMessage(response)
  }

  return (
    <div className="ai-chat">
      <div className="ai-chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isProcessing && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input">
        {/* Quick action buttons for onboarding */}
        {!useAI && onboardingStep < onboardingQuestions.length && onboardingQuestions[onboardingStep].quickActions && (
          <div className="quick-actions onboarding-actions">
            {/* Show detected location first if available and this is the location question */}
            {onboardingQuestions[onboardingStep].field === 'location' && detectedCity && (
              <button
                onClick={() => handleQuickResponse(detectedCity)}
                className="quick-action-btn detected-location"
                disabled={isProcessing}
              >
                📍 {detectedCity} {language === 'es' ? '(tu ubicación)' : '(your location)'}
              </button>
            )}
            {/* Filter out detected city from preset quick actions to avoid duplicates */}
            {onboardingQuestions[onboardingStep].quickActions!
              .filter(action => !(onboardingQuestions[onboardingStep].field === 'location' && detectedCity && action.value.toLowerCase() === detectedCity.toLowerCase()))
              .map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickResponse(action.value)}
                  className="quick-action-btn"
                  disabled={isProcessing}
                >
                  {action.label[language]}
                </button>
              ))}
          </div>
        )}

        {/* Skip button during onboarding */}
        {!useAI && onboardingStep < onboardingQuestions.length && (
          <button
            onClick={() => handleQuickResponse(language === 'es' ? 'omitir' : 'skip')}
            className="skip-btn"
            disabled={isProcessing}
          >
            {language === 'es' ? 'Omitir →' : 'Skip →'}
          </button>
        )}

        {/* Quick action buttons for AI conversation - common needs */}
        {useAI && messages.length <= 5 && (
          <div className="quick-actions">
            <button
              onClick={() => handleQuickResponse(language === 'es' ? 'Necesito un lugar para dormir esta noche' : 'I need a place to sleep tonight')}
              className="quick-action-btn urgent"
            >
              🏠 {language === 'es' ? 'Necesito refugio' : 'Need shelter'}
            </button>
            <button
              onClick={() => handleQuickResponse(language === 'es' ? 'Necesito comida' : 'I need food')}
              className="quick-action-btn"
            >
              🍽️ {language === 'es' ? 'Necesito comida' : 'Need food'}
            </button>
            <button
              onClick={() => handleQuickResponse(language === 'es' ? 'Necesito ayuda con la escuela' : 'I need help with school')}
              className="quick-action-btn"
            >
              📚 {language === 'es' ? 'Ayuda escolar' : 'School help'}
            </button>
            <button
              onClick={() => handleQuickResponse(language === 'es' ? 'Necesito ayuda con salud mental' : 'I need mental health support')}
              className="quick-action-btn"
            >
              💚 {language === 'es' ? 'Salud mental' : 'Mental health'}
            </button>
          </div>
        )}

        {/* Show resources button if we have data */}
        {messageCount >= 1 && Object.keys(responses).length > 0 && (
          <button
            onClick={onShowResources}
            className="show-resources-btn"
          >
            {language === 'es' ? '✨ Ver recursos disponibles' : '✨ See available resources'}
          </button>
        )}

        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isProcessing
              ? (language === 'es' ? 'Pensando...' : 'Thinking...')
              : (language === 'es' ? 'Escribe tu mensaje aquí...' : 'Type your message here...')
            }
            disabled={isProcessing}
            rows={2}
            className="ai-chat-textarea"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            className="ai-send-button"
          >
            {language === 'es' ? 'Enviar' : 'Send'}
          </button>
        </div>

        <p className="ai-chat-hint">
          💬 {language === 'es'
            ? 'Habla libremente - puedes omitir cualquier cosa con la que no te sientas cómodo'
            : 'Speak freely - you can skip anything you\'re not comfortable with'}
        </p>
      </div>
    </div>
  )
}
