import { Resource } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './IneligibleResourceCard.css'

interface IneligibleResourceCardProps {
  resource: Resource
  reasons: string[]
}

export default function IneligibleResourceCard({ resource, reasons }: IneligibleResourceCardProps) {
  const { t } = useLanguage()
  
  return (
    <div className="ineligible-resource-card">
      <div className="resource-header">
        <h3 className="resource-name">{resource.name}</h3>
        <span className="resource-category">{resource.category.join(', ')}</span>
      </div>
      <p className="resource-description">{resource.description}</p>
      
      <div className="ineligible-reasons">
        <strong>{t('whyNotAvailable')}</strong>
        <ul>
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
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
    </div>
  )
}

