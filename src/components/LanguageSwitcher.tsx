import { useLanguage } from '../i18n/LanguageContext'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  // Only show the alternative language option
  const alternativeLanguage = language === 'en' ? 'es' : 'en'
  const alternativeLabel = alternativeLanguage === 'es' ? 'ES' : 'EN'
  const alternativeFull = alternativeLanguage === 'es' ? 'Español' : 'English'
  const flagEmoji = alternativeLanguage === 'es' ? '🇲🇽' : '🇺🇸'

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage(alternativeLanguage)}
        className="lang-button"
        title={`Switch to ${alternativeFull}`}
      >
        <span className="flag-icon">{flagEmoji}</span>
        <span className="lang-code">{alternativeLabel}</span>
      </button>
    </div>
  )
}

