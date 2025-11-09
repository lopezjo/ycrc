import { SessionData, Message, UserResponse } from '../types'

const SESSION_KEY = 'youth-navigator-session'
const CONSENT_KEY = 'youth-navigator-consent'

export function saveSession(
  responses: UserResponse,
  currentQuestionIndex: number,
  messages: Message[]
): void {
  const sessionData: SessionData = {
    responses,
    currentQuestionIndex,
    messages: messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp // Keep as Date for now, will be serialized
    })),
    timestamp: Date.now(),
    consentGiven: hasConsent()
  }

  try {
    // Convert Date objects to ISO strings for storage
    const serialized = {
      ...sessionData,
      messages: sessionData.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(serialized))
  } catch (error) {
    console.error('Failed to save session:', error)
  }
}

export function loadSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    const data = JSON.parse(stored)
    
    // Check if session is older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    if (data.timestamp < sevenDaysAgo) {
      clearSession()
      return null
    }

    // Convert ISO strings back to Date objects
    return {
      ...data,
      messages: data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to load session:', error)
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear session:', error)
  }
}

export function saveConsent(given: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ given, timestamp: Date.now() }))
  } catch (error) {
    console.error('Failed to save consent:', error)
  }
}

export function hasConsent(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return false
    const data = JSON.parse(stored)
    return data.given === true
  } catch (error) {
    return false
  }
}

