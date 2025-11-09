import { useLanguage } from '../i18n/LanguageContext'
import './ModeSelection.css'

interface ModeSelectionProps {
  onSelectMode: (mode: 'ai' | 'structured') => void
}

export default function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  const { t, language } = useLanguage()

  return (
    <div className="mode-selection">
      <div className="mode-selection-content">
        <h1 className="mode-welcome">{t('landingWelcome')}</h1>
        <p className="mode-subtitle">{t('landingSubtitle')}</p>

        <div className="mode-options">
          <button
            className="mode-option"
            onClick={() => onSelectMode('structured')}
          >
            <div className="mode-icon">📋</div>
            <h2 className="mode-title">{t('modeKnowWhat')}</h2>
            <p className="mode-description">{t('modeKnowWhatDesc')}</p>
          </button>

          <button
            className="mode-option mode-option-ai"
            onClick={() => onSelectMode('ai')}
          >
            <div className="mode-icon">💬</div>
            <h2 className="mode-title">{t('modeHelpFigure')}</h2>
            <p className="mode-description">{t('modeHelpFigureDesc')}</p>
          </button>
        </div>

        <p className="mode-note">
          {language === 'es'
            ? 'Puedes cambiar de modo en cualquier momento'
            : 'You can switch modes anytime'}
        </p>
      </div>
    </div>
  )
}
