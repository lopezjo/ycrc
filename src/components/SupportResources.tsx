import { useLanguage } from '../i18n/LanguageContext'
import './SupportResources.css'

interface SupportResourcesProps {
  onClose: () => void
}

export default function SupportResources({ onClose }: SupportResourcesProps) {
  const { t } = useLanguage()
  
  return (
    <div className="support-overlay">
      <div className="support-modal">
        <button className="support-close" onClick={onClose}>×</button>
        <h2>{t('supportTitle')}</h2>
        <p className="support-intro">
          {t('supportIntro')}
        </p>

        <div className="support-resources">
          <div className="support-item">
            <h3>National Suicide Prevention Lifeline</h3>
            <p className="support-phone">
              <a href="tel:988">988</a> or <a href="tel:1-800-273-8255">1-800-273-8255</a>
            </p>
            <p className="support-desc">Free, confidential support 24/7</p>
          </div>

          <div className="support-item">
            <h3>Crisis Text Line</h3>
            <p className="support-phone">Text <strong>HOME</strong> to <a href="sms:741741">741741</a></p>
            <p className="support-desc">Free crisis support via text message</p>
          </div>

          <div className="support-item">
            <h3>National Runaway Safeline</h3>
            <p className="support-phone">
              <a href="tel:1-800-786-2929">1-800-RUNAWAY</a> (1-800-786-2929)
            </p>
            <p className="support-desc">Confidential help for youth in crisis</p>
          </div>

          <div className="support-item">
            <h3>National Domestic Violence Hotline</h3>
            <p className="support-phone">
              <a href="tel:1-800-799-7233">1-800-799-SAFE</a> (1-800-799-7233)
            </p>
            <p className="support-desc">24/7 support for domestic violence</p>
          </div>
        </div>

        <div className="support-note">
          <p>{t('supportRemember')}</p>
        </div>
      </div>
    </div>
  )
}

