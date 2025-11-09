export interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  type?: 'question' | 'context' | 'response' | 'resources' | 'support' | 'consent'
  questionId?: string
  editable?: boolean
}

export interface QuestionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'includes' | 'greater_than' | 'less_than'
  value: any
}

export interface Question {
  id: string
  text: string
  context?: string
  field: string
  type: 'text' | 'yesno' | 'multiple' | 'number'
  options?: string[]
  required: boolean
  skippable?: boolean
  sensitive?: boolean
  youthFriendly?: string
  suggestedResponses?: string[] // Added for quick response buttons
  showIf?: QuestionCondition[] // Conditions to show this question
  skipIf?: QuestionCondition[] // Conditions to skip this question
}

export interface EligibilityCriteria {
  age?: { min?: number; max?: number }
  location?: string[]
  situation?: string[]
  hasId?: boolean
  hasIncome?: boolean
  inSchool?: boolean
  duration?: string
}

export interface ResourceQuestion {
  id: string
  text: string
  context?: string
  field: string
  type: 'text' | 'yesno' | 'multiple'
  options?: string[]
  barrier?: string // What barrier this question identifies
}

export interface Resource {
  id: string
  name: string
  description: string
  category: string[] // Changed to array
  eligibility: EligibilityCriteria
  contact: {
    phone?: string[] // Changed to array
    email?: string
    website?: string
    address?: string
  }
  hours?: string
  notes?: string
  priority?: 'high' | 'medium' | 'low'
  urgent?: boolean
  followUpQuestions?: ResourceQuestion[]
  whatItOffers?: string[]
  commonBarriers?: string[]
}

export interface EligibilityResult {
  eligible: boolean
  reasons?: string[]
  missingInfo?: string[]
}

export interface UserResponse {
  [key: string]: string | number | boolean
}

export interface SessionData {
  responses: UserResponse
  currentQuestionIndex: number // Legacy field for backwards compatibility
  currentQuestionId?: string // New field for current question ID
  messages: Message[]
  timestamp: number
  consentGiven: boolean
}

export interface ConsentInfo {
  whatWeCollect: string[]
  whyWeCollect: string
  howWeUse: string
  yourRights: string[]
}

