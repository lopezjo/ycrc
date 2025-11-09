import { SessionData, Message, UserResponse } from '../types'

const SESSION_KEY = 'youth-navigator-session'
const CONSENT_KEY = 'youth-navigator-consent'
const COOKIE_EXPIRY_DAYS = 7

// Cookie utilities
function setCookie(name: string, value: string, days: number): void {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure=${location.protocol === 'https:'}`
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export function saveSession(
  responses: UserResponse,
  currentQuestionIndex: number,
  messages: Message[],
  currentQuestionId?: string
): void {
  const sessionData: SessionData = {
    responses,
    currentQuestionIndex,
    currentQuestionId,
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
    
    const serializedString = JSON.stringify(serialized)
    
    // Save to localStorage
    localStorage.setItem(SESSION_KEY, serializedString)
    
    // Also save to cookies as backup (with size limit consideration)
    if (serializedString.length < 4000) { // Cookies have ~4KB limit
      setCookie(SESSION_KEY, serializedString, COOKIE_EXPIRY_DAYS)
    } else {
      // If data is too large for cookies, just save responses and current question
      const minimalSession = {
        responses,
        currentQuestionIndex,
        currentQuestionId,
        timestamp: Date.now(),
        consentGiven: hasConsent()
      }
      setCookie(SESSION_KEY, JSON.stringify(minimalSession), COOKIE_EXPIRY_DAYS)
    }
  } catch (error) {
    console.error('Failed to save session:', error)
  }
}

export function loadSession(): SessionData | null {
  try {
    // First try localStorage
    let stored = localStorage.getItem(SESSION_KEY)
    let source = 'localStorage'
    
    // If localStorage is empty or fails, try cookies
    if (!stored) {
      stored = getCookie(SESSION_KEY)
      source = 'cookie'
    }
    
    if (!stored) return null

    const data = JSON.parse(stored)
    
    // Check if session is older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    if (data.timestamp < sevenDaysAgo) {
      clearSession()
      return null
    }

    console.log(`Session loaded from ${source}`)

    // Convert ISO strings back to Date objects
    return {
      ...data,
      messages: data.messages ? data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })) : []
    }
  } catch (error) {
    console.error('Failed to load session:', error)
    return null
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
    deleteCookie(SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear session:', error)
  }
}

export function saveConsent(given: boolean): void {
  try {
    const consentData = JSON.stringify({ given, timestamp: Date.now() })
    localStorage.setItem(CONSENT_KEY, consentData)
    setCookie(CONSENT_KEY, consentData, COOKIE_EXPIRY_DAYS)
  } catch (error) {
    console.error('Failed to save consent:', error)
  }
}

export function hasConsent(): boolean {
  try {
    // First try localStorage
    let stored = localStorage.getItem(CONSENT_KEY)
    
    // If localStorage is empty, try cookies
    if (!stored) {
      stored = getCookie(CONSENT_KEY)
    }
    
    if (!stored) return false
    const data = JSON.parse(stored)
    return data.given === true
  } catch (error) {
    return false
  }
}

