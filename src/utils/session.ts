import { SessionData, Message, UserResponse } from '../types'

const SESSION_KEY = 'youth-navigator-session'
const CONSENT_KEY = 'youth-navigator-consent'
const USER_ID_KEY = 'youth-navigator-uid'
const COOKIE_EXPIRY_DAYS = 7
const USER_ID_EXPIRY_YEARS = 10 // Non-expiring for practical purposes

// Generate a globally unique identifier (UUID v4 format)
function generateUniqueId(): string {
  // Use crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback to manual UUID v4 generation with crypto.getRandomValues if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer)
    
    // Set version (4) and variant bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40 // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80 // Variant 10
    
    // Convert to hex string with proper formatting
    const hex = Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }
  
  // Final fallback using Math.random (less secure but still functional)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

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

// Get or create unique user identifier
export function getUserId(): string {
  // First check if we already have a user ID in cookies
  let userId = getCookie(USER_ID_KEY)
  
  if (!userId) {
    // Check localStorage as fallback (for migration)
    try {
      userId = localStorage.getItem(USER_ID_KEY)
    } catch (error) {
      // localStorage might not be available
    }
  }
  
  if (!userId) {
    // Generate new unique ID
    userId = generateUniqueId()
  }
  
  // Store in both cookie (primary) and localStorage (backup)
  try {
    setCookie(USER_ID_KEY, userId, USER_ID_EXPIRY_YEARS * 365) // 10 years
    localStorage.setItem(USER_ID_KEY, userId)
  } catch (error) {
    console.warn('Failed to store user ID:', error)
  }
  
  return userId
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
    // Note: We intentionally do NOT clear the user ID here
    // as it should persist across session clears
  } catch (error) {
    console.error('Failed to clear session:', error)
  }
}

// Function to clear ALL data including user ID (for privacy/reset)
export function clearAllData(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(CONSENT_KEY)
    localStorage.removeItem(USER_ID_KEY)
    deleteCookie(SESSION_KEY)
    deleteCookie(CONSENT_KEY)
    deleteCookie(USER_ID_KEY)
  } catch (error) {
    console.error('Failed to clear all data:', error)
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

