import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getLanguage, setLanguage as setLang, t, formatTranslation, Translations } from './i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
  format: (key: keyof Translations, params: { [key: string]: string | number }) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getLanguage())

  const handleSetLanguage = (lang: Language) => {
    setLang(lang)
    setLanguageState(lang)
    // Force re-render by reloading
    window.location.reload()
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        format: formatTranslation
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

