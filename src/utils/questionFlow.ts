import { Question, QuestionCondition, UserResponse } from '../types'

export function evaluateCondition(condition: QuestionCondition, responses: UserResponse): boolean {
  const value = responses[condition.field]
  
  switch (condition.operator) {
    case 'equals':
      return value === condition.value
    case 'not_equals':
      return value !== condition.value
    case 'includes':
      return Array.isArray(value) ? value.includes(condition.value) : false
    case 'greater_than':
      return typeof value === 'number' && value > condition.value
    case 'less_than':
      return typeof value === 'number' && value < condition.value
    default:
      return false
  }
}

export function shouldShowQuestion(question: Question, responses: UserResponse): boolean {
  // Check skipIf conditions first - if any are true, don't show question
  if (question.skipIf) {
    const shouldSkip = question.skipIf.some(condition => 
      evaluateCondition(condition, responses)
    )
    if (shouldSkip) return false
  }
  
  // Check showIf conditions - all must be true to show question
  if (question.showIf) {
    return question.showIf.every(condition => 
      evaluateCondition(condition, responses)
    )
  }
  
  // Default: show question if no conditions specified
  return true
}

export function getNextQuestionId(
  questionFlow: Question[], 
  responses: UserResponse, 
  currentQuestionId?: string
): string | null {
  const currentIndex = currentQuestionId 
    ? questionFlow.findIndex(q => q.id === currentQuestionId)
    : -1
  
  // Look for next eligible question after current
  for (let i = currentIndex + 1; i < questionFlow.length; i++) {
    const question = questionFlow[i]
    
    if (shouldShowQuestion(question, responses)) {
      return question.id
    }
  }
  
  return null // No more questions
}

export function getQuestionById(questionFlow: Question[], questionId: string): Question | undefined {
  return questionFlow.find(q => q.id === questionId)
}

export function getQuestionIndex(questionFlow: Question[], questionId: string): number {
  return questionFlow.findIndex(q => q.id === questionId)
}

/**
 * Get all questions that should be shown given current responses
 * Useful for progress indication and edit mode
 */
export function getEligibleQuestions(questionFlow: Question[], responses: UserResponse): Question[] {
  return questionFlow.filter(question => shouldShowQuestion(question, responses))
}

/**
 * Get all questions that have been answered
 */
export function getAnsweredQuestions(questionFlow: Question[], responses: UserResponse): Question[] {
  return questionFlow.filter(question => 
    responses[question.field] !== undefined && responses[question.field] !== null
  )
}

/**
 * Check if we're at the end of the conditional question flow
 */
export function isQuestionFlowComplete(
  questionFlow: Question[], 
  responses: UserResponse,
  currentQuestionId?: string
): boolean {
  const nextQuestionId = getNextQuestionId(questionFlow, responses, currentQuestionId)
  return nextQuestionId === null
}