import { ConsentInfo } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './ConsentModal.css'

interface ConsentModalProps {
  consentInfo: ConsentInfo
  onAccept: () => void
  onDecline: () => void
}

export default function ConsentModal({ consentInfo, onAccept, onDecline }: ConsentModalProps) {
  const { t } = useLanguage()

  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <h2>{t('consentTitle')}</h2>
        <p className="consent-intro">
          {t('consentIntro')}
        </p>

        <div className="consent-section">
          <h3>{t('consentWhatWeCollect')}</h3>
          <ul>
            {consentInfo.whatWeCollect.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="consent-section">
          <h3>{t('consentWhyWeCollect')}</h3>
          <p>{consentInfo.whyWeCollect}</p>
        </div>

        <div className="consent-section">
          <h3>{t('consentHowWeUse')}</h3>
          <p>{consentInfo.howWeUse}</p>
        </div>

        <div className="consent-section">
          <h3>{t('consentYourRights')}</h3>
          <ul>
            {consentInfo.yourRights.map((right, idx) => (
              <li key={idx}>{right}</li>
            ))}
          </ul>
        </div>

        <div className="consent-actions">
          <button onClick={onAccept} className="consent-button accept">
            {t('consentAccept')}
          </button>
          <button onClick={onDecline} className="consent-button decline">
            {t('consentDecline')}
          </button>
        </div>
      </div>
    </div>
  )
}

