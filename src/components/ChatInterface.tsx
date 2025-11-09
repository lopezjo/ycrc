import { useState, useRef, useEffect } from 'react'
import { Message, UserResponse, Resource } from '../types'
import { questionFlow } from '../data/questions'
import { resources } from '../data/resources'
import { classifyAllResources } from '../utils/eligibility'
import { saveSession, loadSession, clearSession, hasConsent, getUserId } from '../utils/session'
import { 
  getNextQuestionId, 
  getQuestionById, 
  getQuestionIndex, 
  isQuestionFlowComplete,
  getEligibleQuestions
} from '../utils/questionFlow'
import { getPrimarySituation } from '../utils/situationMapping'
import { useLanguage } from '../i18n/LanguageContext'
import MessageBubble from './MessageBubble'
import ResourcesDisplay from './ResourcesDisplay'
import ProgressIndicator from './ProgressIndicator'
import SupportResources from './SupportResources'
import DataExportModal from './DataExportModal'
import './ChatInterface.css'

// Distress detection patterns
const DISTRESS_PATTERNS = [
  'suicidal', 'kill myself', 'kill me', 'hurt myself', 'self harm', 'abuse', 'abused',
  'want to die', 'wanna die', 'wish i was dead', 'end my life', 'ending my life',
  'unsafe', "don't feel safe", 'no where to go', 'scared', 'alone', 'depressed', 'panic', 'overwhelmed',
  'crisis', 'need help now', 'hopeless', "can't go on", 'runaway',
  // Spanish
  'suicida', 'quiero morir', 'no quiero vivir', 'me siento solo', 'me siento mal', 'necesito ayuda', 'crisis', 'abuso', 'abusado', 'miedo', 'asustado', 'no estoy seguro', 'pánico'
];
function detectDistress(text: string): boolean {
  const lower = (text || '').toLowerCase();
  return DISTRESS_PATTERNS.some(pattern => lower.includes(pattern));
}

export default function ChatInterface() {
  const { t, format, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('initial')
  const [responses, setResponses] = useState<UserResponse>({})
  const [answerCache, setAnswerCache] = useState<UserResponse>({}) // Cache of ALL answers ever given
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Note: answerCache contains all answers ever given, even to questions that are no longer eligible
  // For now it's write-only, will be used later for restoration
  useEffect(() => {
    // Temporary: Log cache size to avoid unused variable warning
    console.debug(`Answer cache contains ${Object.keys(answerCache).length} responses`)
  }, [answerCache])

  // Utility function to clean responses - only keep answers for currently eligible questions
  const cleanResponses = (responses: UserResponse): UserResponse => {
    const eligibleQuestions = getEligibleQuestions(questionFlow, responses)
    const eligibleFields = new Set(eligibleQuestions.map(q => q.field))
    
    const cleanedResponses: UserResponse = {}
    Object.keys(responses).forEach(field => {
      if (eligibleFields.has(field)) {
        cleanedResponses[field] = responses[field]
      }
    })
    
    return cleanedResponses
  }
  const [showResources, setShowResources] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [distressDetected, setDistressDetected] = useState(false);
  const [showExport, setShowExport] = useState(false)
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [resourceAssessments, setResourceAssessments] = useState<{ [resourceId: string]: { [questionId: string]: any } }>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get current question
  const currentQuestion = getQuestionById(questionFlow, currentQuestionId)
  const currentQuestionIndex = getQuestionIndex(questionFlow, currentQuestionId)

  // Initialize user ID on app load
  useEffect(() => {
    // Generate/retrieve user ID immediately when app loads
    const userId = getUserId()
    console.log('User ID initialized:', userId)
  }, [])

  // Load session on mount
  useEffect(() => {
    const session = loadSession()
    if (session && session.consentGiven) {
      setMessages(session.messages)
      setResponses(cleanResponses(session.responses))

      // Determine the current question ID
      let currentQuestionIdFromSession = 'initial'

      // Use stored question ID if available (new format)
      if (session.currentQuestionId) {
        currentQuestionIdFromSession = session.currentQuestionId
      } else if (typeof session.currentQuestionIndex === 'number') {
        // Convert legacy index-based sessions to ID-based
        const legacyQuestion = questionFlow[session.currentQuestionIndex]
        if (legacyQuestion) {
          currentQuestionIdFromSession = legacyQuestion.id
        }
      }

      // Get the next question ID based on current responses
      const nextQuestionId = getNextQuestionId(questionFlow, session.responses, currentQuestionIdFromSession)

      // Check if we should show resources or continue with questions
      if (nextQuestionId === null || isQuestionFlowComplete(questionFlow, session.responses, currentQuestionIdFromSession)) {
        // Flow is complete - show resources/results
        console.log('Session restored: Flow complete, showing resources')
        setShowResources(true)
        setCurrentQuestionId('completed') // Set to a special state to indicate completion
      } else {
        // Continue from where they left off
        console.log('Session restored: Continuing from question', nextQuestionId)
        setCurrentQuestionId(nextQuestionId)
        askQuestionById(nextQuestionId, false)
      }
    } else {
      // No session, just initialize the chat
      // Consent is handled at App level now
      initializeChat()
    }
  }, [])

  // Save session whenever responses or progress changes
  useEffect(() => {
    if (hasConsent() && messages.length > 0) {
      // Convert questionId back to index for legacy session format
      const questionIndex = getQuestionIndex(questionFlow, currentQuestionId)
      saveSession(responses, questionIndex, messages, currentQuestionId)
    }
  }, [responses, currentQuestionId, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToEligibleResources = () => {
    // First try to scroll to the resources top (which includes export button)
    const resourcesTop = document.getElementById('resources-top')
    if (resourcesTop) {
      resourcesTop.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    
    // Fallback to eligible resources section
    const eligibleSection = document.getElementById('eligible-resources-section')
    if (eligibleSection) {
      eligibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    // Don't auto-scroll to bottom when showing resources
    if (!showResources) {
      scrollToBottom()
    }
  }, [messages, showResources])

  useEffect(() => {
    // Scroll to eligible resources when they are shown
    if (showResources) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        scrollToEligibleResources()
      }, 100)
    }
  }, [showResources])

  useEffect(() => {
    if (!showSupport) {
      inputRef.current?.focus()
    }
  }, [messages, showSupport])

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: t('welcomeMessage'),
      sender: 'assistant',
      timestamp: new Date(),
      type: 'question',
      questionId: questionFlow[0].id
    }
    setMessages([welcomeMessage])
  }

  const askQuestionById = (questionId: string, showContext = true, isManualEdit = false, fromProcessStep = false) => {
    const question = getQuestionById(questionFlow, questionId)
    if (!question) {
      showEligibleResources()
      return
    }

    // Check if we have a cached answer for this question (but not if user is manually editing or called from processStep)
    const cachedValue = answerCache[question.field]
    
    if (!isManualEdit && !fromProcessStep && cachedValue !== undefined && cachedValue !== null && cachedValue !== '') {
      // First show the question
      setMessages((prev: Message[]) => {
        const questionExists = prev.some(
          (m: Message) => m.questionId === question.id && m.type === 'question'
        )
        
        if (questionExists) {
          return prev
        }
        
        const messagesToAdd: Message[] = []
        
        if (showContext && question.context) {
          messagesToAdd.push({
            id: `context-${Date.now()}`,
            text: question.context,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'context'
          })
        }

        messagesToAdd.push({
          id: `question-${Date.now()}`,
          text: question.text,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'question',
          questionId: question.id
        })

        return [...prev, ...messagesToAdd]
      })
      
      // Then auto-answer with cached value after a short delay
      setTimeout(() => {
        const cachedAnswerText = typeof cachedValue === 'boolean' ? 
          (cachedValue ? 'yes' : 'no') : 
          String(cachedValue)
        
        const userMessage: Message = {
          id: `user-${question.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: cachedAnswerText,
          sender: 'user',
          timestamp: new Date()
        }

        setMessages((prev: Message[]) => [...prev, userMessage])
        
        // Update responses with cached value using functional update
        setResponses(prevResponses => {
          const updatedResponses = cleanResponses({
            ...prevResponses,
            [question.field]: cachedValue
          })
          
          return updatedResponses
        })
        
        // Mark this question as completed but don't continue automatically
        setCurrentQuestionId(question.id)
        setIsProcessing(false)
      }, 200) // Short delay to show the question briefly
      
      return
    }

    // No cached value - show question normally
    // Check if this question is already in the messages to prevent duplicates
    setMessages((prev: Message[]) => {
      const questionExists = prev.some(
        (m: Message) => m.questionId === question.id && m.type === 'question'
      )
      
      if (questionExists) {
        // Question already asked, don't add it again
        return prev
      }
      
      const messagesToAdd: Message[] = []
      
      if (showContext && question.context) {
        messagesToAdd.push({
          id: `context-${Date.now()}`,
          text: question.context,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'context'
        })
      }

      messagesToAdd.push({
        id: `question-${Date.now()}`,
        text: question.text,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'question',
        questionId: question.id
      })

      return [...prev, ...messagesToAdd]
    })
  }

  const handleOptionSelect = (option: string) => {
    if (isProcessing) return
    if (!distressDetected && detectDistress(option)) {
      setDistressDetected(true);
      setShowSupport(true); // optional: open the support modal immediately
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: option,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    setIsProcessing(true)

    if (currentQuestion) {
      let responseValue: string | number | boolean = option
      
      // Convert response based on question type
      if (currentQuestion.type === 'yesno') {
        responseValue = /^(yes|y|true|1)$/i.test(option)
      } else if (currentQuestion.field === 'situation') {
        responseValue = getPrimarySituation(option)  // Normalize situation responses
      }
        
      // Update both the cleaned responses and the full answer cache
      const updated = cleanResponses({
        ...responses,
        [currentQuestion.field]: responseValue
      })
      setResponses(updated)
      setAnswerCache((prev: UserResponse) => ({
        ...prev,
        [currentQuestion.field]: responseValue
      }))
      
      // Continue with updated responses
      if (editMode) {
        // In edit mode, continue with question flow instead of showing resources immediately
        setEditMode(false)
        processNextStep(updated)
      } else {
        processNextStep(updated)
      }
    } else {
      // No current question - use default flow
      if (editMode) {
        setEditMode(false)
        processNextStep()
      } else {
        processNextStep()
      }
    }
  }

  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return
    if (!distressDetected && detectDistress(inputValue)) {
      setDistressDetected(true);
      setShowSupport(true); // optional: open the support modal immediately
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, userMessage])
    const responseText = inputValue.trim()
    setInputValue('')
    setIsProcessing(true)

    const currentQuestion = questionFlow[currentQuestionIndex]
    if (currentQuestion) {
      let responseValue: string | number | boolean = responseText
      
      if (currentQuestion.type === 'number') {
        responseValue = parseInt(responseText) || 0
      } else if (currentQuestion.type === 'yesno') {
        responseValue = /^(yes|y|true|1)$/i.test(responseText)
      } else if (currentQuestion.field === 'situation') {
        // Normalize situation responses to standard categories
        responseValue = getPrimarySituation(responseText)
      }
      
      const updated = cleanResponses({ ...responses, [currentQuestion.field]: responseValue })
      setResponses(updated)
      
      // Update the answer cache with the latest response
      setAnswerCache((prev: UserResponse) => ({
        ...prev,
        [currentQuestion.field]: responseValue
      }))
      
      if (editMode) {
        // In edit mode, continue with question flow instead of showing resources immediately
        setEditMode(false)
        processNextStep(updated)
      } else {
        processNextStep(updated)
      }
      return // Early exit, as above does the work
    }
    // Fallback if no currentQuestion found
    if (!editMode) {
      processNextStep()
    }
  }

  const handleSkip = () => {
    if (isProcessing) return

    if (!currentQuestion?.skippable) return

    const skipMessage: Message = {
      id: `user-skip-${Date.now()}`,
      text: '[Skipped]',
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, skipMessage])
    setIsProcessing(true)

    if (editMode) {
      // In edit mode, just show results
      setEditMode(false)
      setIsProcessing(false)
      setShowResources(true)
    } else {
      processNextStep()
    }
  }

  const processNextStep = (overrideResponses?: typeof responses) => {
    const currentResponses = overrideResponses || responses
    const processNextQuestionRecursive = (currentId: string, currentResponsesForFlow: typeof responses) => {
      const nextQuestionId = getNextQuestionId(questionFlow, currentResponsesForFlow, currentId)
      
      if (!nextQuestionId) {
        showEligibleResources()
        return
      }
      
      // Check if the next question has a cached answer
      const nextQuestion = getQuestionById(questionFlow, nextQuestionId)
      const cachedValue = answerCache[nextQuestion?.field || '']
      
      if (cachedValue !== undefined && cachedValue !== null && cachedValue !== '') {
        // Update responses with cached value
        const updatedResponses = cleanResponses({
          ...currentResponsesForFlow,
          [nextQuestion!.field]: cachedValue
        })
        
        // Update state
        setCurrentQuestionId(nextQuestionId)
        setResponses(updatedResponses)
        
        // Continue processing with updated responses
        setTimeout(() => {
          processNextQuestionRecursive(nextQuestionId, updatedResponses)
        }, 50)
      } else {
        // This question needs user input
        setCurrentQuestionId(nextQuestionId)
        setIsProcessing(false)
        askQuestionById(nextQuestionId, true, false, true)
      }
    }
    
    processNextQuestionRecursive(currentQuestionId, currentResponses)
  }

  const showEligibleResources = () => {
    const classification = classifyAllResources(resources, responses)
    const urgentResources = classification.eligible.filter(r => r.urgent)
    const highPriority = classification.eligible.filter(r => r.priority === 'high' && !r.urgent)
    
    let responseText = ''
    if (classification.eligible.length > 0) {
      responseText = format('resourcesFound', { count: classification.eligible.length })
      
      if (urgentResources.length > 0) {
        responseText += `\n\n⚠️ **${format('urgentResources', { count: urgentResources.length })}**`
      }
      
      if (highPriority.length > 0) {
        responseText += `\n\n💚 **${format('highPriorityResources', { count: highPriority.length })}**`
      }
      
      responseText += `\n\n${t('rememberMultiple')}`
    } else {
      responseText = t('resourcesFound').replace('{count}', '0').replace('{plural}', 's')
    }
    
    if (classification.potentiallyEligible.length > 0) {
      responseText += `\n\n💡 **${format('resourcesMightBeAvailable', { count: classification.potentiallyEligible.length })}**`
    }
    
    if (classification.ineligible.length > 0) {
      responseText += `\n\n📋 ${format('resourcesNotAvailable', { count: classification.ineligible.length })}`
    }
    
    const responseMessage: Message = {
      id: `response-${Date.now()}`,
      text: responseText,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'resources'
    }

    setMessages((prev: Message[]) => [...prev, responseMessage])
    setShowResources(true)
    setIsProcessing(false)
  }

  const handleKeyPress = (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEditQuestion = (index: number) => {
    console.debug(`handleEditQuestion called with index: ${index}`)
    setEditMode(true)
    // Get the question from the eligible questions list (not the full questionFlow)
    const eligibleQuestions = getEligibleQuestions(questionFlow, responses)
    const question = eligibleQuestions[index]
    console.debug(`Editing question: ${question?.field} (${question?.text})`)
    setCurrentQuestionId(question.id)
    
    // Find the original position of this question in the question flow
    const originalQuestionIndex = questionFlow.findIndex(q => q.id === question.id)
    
    // Remove messages after this question
    const questionMessageIndex = messages.findIndex(
      (m: Message) => m.questionId === question.id && m.type === 'question'
    )
    
    if (questionMessageIndex !== -1) {
      // Check if there's a context message right before the question
      const hasContext = questionMessageIndex > 0 && 
                        messages[questionMessageIndex - 1].type === 'context'
      
      // Remove all messages from the question onwards (including context if present)
      const sliceIndex = hasContext ? questionMessageIndex - 1 : questionMessageIndex
      setMessages((prev: Message[]) => prev.slice(0, sliceIndex))
      
      console.log(`Before edit - responses:`, responses)
      console.log(`Eligible questions before edit:`, getEligibleQuestions(questionFlow, responses).map(q => q.field))
      
      // Remove responses for questions that come after this one in the flow (keep current question)
      const questionsToKeep = questionFlow.slice(0, originalQuestionIndex + 1)
      const fieldsToKeep = questionsToKeep.map(q => q.field)
      
      const filteredResponses = Object.fromEntries(
        Object.entries(responses).filter(([key]) => fieldsToKeep.includes(key))
      )
      
      console.log(`After filtering - responses:`, filteredResponses)
      console.log(`Eligible questions after filtering:`, getEligibleQuestions(questionFlow, filteredResponses).map(q => q.field))
      
      // Update only the responses (cache keeps ALL historical answers)
      setResponses(cleanResponses(filteredResponses))
      
      // Note: answerCache is NOT modified here - it preserves all historical answers
      
      setShowResources(false)
      console.log(`About to call askQuestionById for edit: questionId=${question.id}, isManualEdit=true`)
      askQuestionById(question.id, true, true) // Pass true for isManualEdit
    }
  }

  const handleClearData = () => {
    if (confirm(t('clearDataConfirm'))) {
      clearSession()
      setMessages([])
      setResponses({})
      setAnswerCache({}) // Clear the answer cache too
      setCurrentQuestionId('initial')
      setShowResources(false)
      setEditMode(false)
      initializeChat()
    }
  }

  return (
    <div className="chat-interface">
      {showSupport && (
        <SupportResources onClose={() => setShowSupport(false)} />
      )}

      {showExport && (
        <DataExportModal
          responses={responses}
          selectedResources={selectedResources}
          resourceAssessments={resourceAssessments}
          onClose={() => setShowExport(false)}
        />
      )}

      <div className="chat-header">
        <div className="header-actions">
          <button 
            onClick={() => setShowSupport(true)} 
            className="header-button support-button"
            title={t('needSupport')}
          >
            {t('needSupport')}
          </button>
          <button 
            onClick={() => setEditMode(!editMode)} 
            className={`header-button ${editMode ? 'active' : ''}`}
            title={t('edit')}
          >
            {editMode ? t('exitEdit') : t('edit')}
          </button>
          <button 
            onClick={() => setShowExport(true)}
            className="header-button export-button"
            title={t('exportData') || 'Export Data'}
          >
            📤 {t('exportData') || 'Export Data'}
          </button>
          <button 
            onClick={handleClearData} 
            className="header-button clear-button"
            title={t('clear')}
          >
            {t('clear')}
          </button>
        </div>
      </div>

      <ProgressIndicator
        questions={getEligibleQuestions(questionFlow, responses)}
        currentIndex={(() => {
          const eligibleQuestions = getEligibleQuestions(questionFlow, responses)
          const currentQuestion = questionFlow[currentQuestionIndex]
          return currentQuestion ? eligibleQuestions.findIndex(q => q.id === currentQuestion.id) : -1
        })()}
        responses={responses}
        onQuestionClick={editMode ? handleEditQuestion : undefined}
        editable={editMode}
      />

      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {showResources && (
          <ResourcesDisplay 
            responses={responses}
            selectedResources={selectedResources}
            setSelectedResources={setSelectedResources}
            resourceAssessments={resourceAssessments}
            setResourceAssessments={setResourceAssessments}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {distressDetected && (
          <div className="distress-banner">
            <b>
              {language === 'es'
                ? 'Parece que podrías necesitar apoyo adicional o ayuda urgente en este momento. Aquí hay recursos disponibles 24/7:'
                : 'It sounds like you might need extra support or urgent help right now. Here are some resources available 24/7:'}
            </b>
            <button onClick={() => setShowSupport(true)} className="support-banner-btn">
              {t('needSupport') || 'Need Support?'}
            </button>
            <button onClick={() => setDistressDetected(false)} className="dismiss-banner-btn" title="Dismiss">
              ×
            </button>
          </div>
        )}

        {currentQuestion && !showResources && (
          <>
            {currentQuestion.type === 'multiple' && currentQuestion.options && (
              <div className="options-container">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isProcessing}
                    className="option-button"
                  >
                    {option}
                  </button>
                ))}
                {currentQuestion.skippable && (
                  <button
                    onClick={handleSkip}
                    className="option-button skip-button"
                  >
                    {t('skipQuestion')}
                  </button>
                )}
              </div>
            )}

            {currentQuestion.type !== 'multiple' && (
              <>
                <div className="input-hint">
                  {currentQuestion.type === 'yesno' && t('yesNo')}
                  {currentQuestion.type === 'number' && t('enterNumber')}
                  {currentQuestion.skippable && currentQuestion.type === 'text' && t('canSkip')}
                </div>
                {/* Show Yes/No buttons for yesno questions */}
                {currentQuestion.type === 'yesno' && (
                  <div className="quick-responses-row">
                    <button
                      key="yes"
                      type="button"
                      className="quick-response-button"
                      disabled={isProcessing}
                      onClick={() => handleOptionSelect('Yes')}
                    >
                      {t('yes') || 'Yes'}
                    </button>
                    <button
                      key="no"
                      type="button"
                      className="quick-response-button"
                      disabled={isProcessing}
                      onClick={() => handleOptionSelect('No')}
                    >
                      {t('no') || 'No'}
                    </button>
                    {currentQuestion.skippable && (
                      <button
                        key="skip-yesno"
                        type="button"
                        className="quick-response-button skip-button"
                        disabled={isProcessing}
                        onClick={handleSkip}
                      >
                        {t('skip')}
                      </button>
                    )}
                  </div>
                )}
                {/* Show text input for non-yesno questions */}
                {currentQuestion.type !== 'yesno' && (
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    type={currentQuestion.type === 'number' ? 'number' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isProcessing ? t('processing') : t('typeResponse')}
                    disabled={isProcessing}
                    className="chat-input"
                  />
                  <button
                    onClick={handleSend}
                    onMouseDown={(e) => e.preventDefault()}
                    disabled={!inputValue.trim() || isProcessing}
                    className="send-button"
                  >
                    {t('send')}
                  </button>
                  {currentQuestion.skippable && (
                    <button
                      onClick={handleSkip}
                      onMouseDown={(e) => e.preventDefault()}
                      className="skip-button-text"
                      disabled={isProcessing}
                    >
                      {t('skip')}
                    </button>
                  )}
                </div>
                )}
                {/* Show suggested responses for text questions */}
                {currentQuestion.type !== 'yesno' && Array.isArray(currentQuestion.suggestedResponses) && currentQuestion.suggestedResponses.length > 0 && (
                  <div className="quick-responses-row">
                    {currentQuestion.suggestedResponses.map((response) => (
                      <button
                        key={response}
                        type="button"
                        className="quick-response-button"
                        disabled={isProcessing}
                        onClick={() => handleOptionSelect(response)}
                      >
                        {response}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {showResources && !editMode && (
          <div className="resources-complete">
            <p>{t('resourcesComplete')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
