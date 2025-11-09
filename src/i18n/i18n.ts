import { translations, Language, Translations } from './translations'

let currentLanguage: Language = 'en'

export function setLanguage(lang: Language): void {
  currentLanguage = lang
  try {
    localStorage.setItem('youth-navigator-language', lang)
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
}

export function getLanguage(): Language {
  try {
    const saved = localStorage.getItem('youth-navigator-language')
    if (saved === 'en' || saved === 'es') {
      return saved
    }
  } catch (error) {
    console.error('Failed to load language preference:', error)
  }
  return 'en'
}

export function t(key: keyof Translations): string {
  const lang = getLanguage()
  const translation = translations[lang][key]
  return translation || translations.en[key] || key
}

export function formatTranslation(key: keyof Translations, params: { [key: string]: string | number }): string {
  let text = t(key)
  
  // Replace placeholders like {count} and {plural}
  Object.keys(params).forEach(param => {
    const value = params[param]
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value))
  })
  
  // Handle pluralization for {plural}
  if (params.count !== undefined) {
    const count = Number(params.count)
    const plural = count === 1 ? '' : 's'
    text = text.replace(/\{plural\}/g, plural)
  }
  
  return text
}

// Initialize language on load
if (typeof window !== 'undefined') {
  currentLanguage = getLanguage()
}

