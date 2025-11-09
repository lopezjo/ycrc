import { Resource } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './PotentiallyEligibleResourceCard.css'

interface PotentiallyEligibleResourceCardProps {
  resource: Resource
  missingInfo: string[]
  onLearnMore?: (resource: Resource) => void
}

export default function PotentiallyEligibleResourceCard({ resource, missingInfo, onLearnMore }: PotentiallyEligibleResourceCardProps) {
  const { t, language } = useLanguage()
  
  return (
    <div className="potentially-eligible-resource-card">
      <div className="resource-header">
        <h3 className="resource-name">{resource.name}</h3>
        <span className="resource-category">{resource.category.join(', ')}</span>
      </div>
      <p className="resource-description">{resource.description}</p>
      
      <div className="missing-info">
        <strong>💡 {t('toCheckEligibility')}</strong>
        <ul>
          {missingInfo.map((info, idx) => (
            <li key={idx}>{info}</li>
          ))}
        </ul>
      </div>

      {resource.contact.phone && resource.contact.phone.length > 0 && (
        <div className="resource-contact">
          <strong>{t('phone')}</strong>{' '}
          {resource.contact.phone.map((phone, index) => (
            <span key={index}>
              <a href={`tel:${phone}`}>{phone}</a>
              {index < resource.contact.phone!.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      {resource.hours && (
        <div className="resource-info">
          <strong>{t('hours')}</strong> {resource.hours}
        </div>
      )}

      {onLearnMore && (
        <button 
          onClick={() => onLearnMore(resource)}
          className="learn-more-btn"
        >
          {language === 'es' ? '📖 Aprender Más' : '📖 Learn More'}
        </button>
      )}
    </div>
  )
}

