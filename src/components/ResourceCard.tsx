import { Resource } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './ResourceCard.css'

interface ResourceCardProps {
  resource: Resource
  onLearnMore?: (resource: Resource) => void
}

export default function ResourceCard({ resource, onLearnMore }: ResourceCardProps) {
  const { t, language } = useLanguage()
  
  return (
    <div className={`resource-card ${resource.urgent ? 'urgent' : ''} ${resource.priority === 'high' ? 'high-priority' : ''}`}>
      {resource.urgent && (
        <div className="urgent-badge">⚠️ {language === 'es' ? 'Urgente - Disponible Ahora' : 'Urgent - Available Now'}</div>
      )}
      <div className="resource-header">
        <h3 className="resource-name">{resource.name}</h3>
        <span className="resource-category">{resource.category}</span>
      </div>
      <p className="resource-description">{resource.description}</p>
      
      {resource.hours && (
        <div className="resource-info">
          <strong>{t('hours')}</strong> {resource.hours}
        </div>
      )}

      <div className="resource-contact">
        {resource.contact.phone && (
          <div className="contact-item">
            <strong>{t('phone')}</strong>{' '}
            <a href={`tel:${resource.contact.phone}`}>{resource.contact.phone}</a>
          </div>
        )}
        {resource.contact.email && (
          <div className="contact-item">
            <strong>{t('email')}</strong>{' '}
            <a href={`mailto:${resource.contact.email}`}>{resource.contact.email}</a>
          </div>
        )}
        {resource.contact.website && (
          <div className="contact-item">
            <strong>{t('website')}</strong>{' '}
            <a href={resource.contact.website} target="_blank" rel="noopener noreferrer">
              {resource.contact.website}
            </a>
          </div>
        )}
        {resource.contact.address && (
          <div className="contact-item">
            <strong>{t('address')}</strong> {resource.contact.address}
          </div>
        )}
      </div>

      {resource.notes && (
        <div className="resource-notes">
          <em>{resource.notes}</em>
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

