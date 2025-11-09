import { useLanguage } from '../i18n/LanguageContext'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  // Only show the alternative language option
  const alternativeLanguage = language === 'en' ? 'es' : 'en'
  const alternativeLabel = alternativeLanguage === 'es' ? 'Español' : 'English'

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage(alternativeLanguage)}
        className="lang-button"
        title={`Switch to ${alternativeLabel}`}
      >
        {alternativeLabel}
      </button>
    </div>
  )
}

