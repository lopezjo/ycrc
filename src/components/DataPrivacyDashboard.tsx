import { UserResponse } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './DataPrivacyDashboard.css'

interface DataPrivacyDashboardProps {
  responses: UserResponse
  onFieldToggle?: (field: string, include: boolean) => void
  selectedFields?: Set<string>
}

interface DataField {
  key: string
  label: { en: string; es: string }
  value: any
  sensitive: boolean
  category: string
}

export default function DataPrivacyDashboard({
  responses,
  onFieldToggle,
  selectedFields = new Set(Object.keys(responses))
}: DataPrivacyDashboardProps) {
  const { language } = useLanguage()

  // Map response fields to user-friendly labels
  const dataFields: DataField[] = Object.entries(responses).map(([key, value]) => {
    const fieldMap: Record<string, { label: { en: string; es: string }; sensitive: boolean; category: string }> = {
      age: {
        label: { en: 'Age', es: 'Edad' },
        sensitive: false,
        category: 'Basic Info'
      },
      location: {
        label: { en: 'Location', es: 'Ubicación' },
        sensitive: false,
        category: 'Basic Info'
      },
      situation: {
        label: { en: 'Primary Need', es: 'Necesidad Principal' },
        sensitive: true,
        category: 'Situation'
      },
      safePlaceTonight: {
        label: { en: 'Safe Place Tonight', es: 'Lugar Seguro Esta Noche' },
        sensitive: true,
        category: 'Situation'
      },
      housingDuration: {
        label: { en: 'Housing Duration', es: 'Duración de Vivienda' },
        sensitive: true,
        category: 'Situation'
      },
      inSchool: {
        label: { en: 'Currently in School', es: 'Actualmente en la Escuela' },
        sensitive: false,
        category: 'Education'
      },
      schoolType: {
        label: { en: 'School Type', es: 'Tipo de Escuela' },
        sensitive: false,
        category: 'Education'
      },
      hasId: {
        label: { en: 'Has ID', es: 'Tiene Identificación' },
        sensitive: false,
        category: 'Documentation'
      },
      hasIncome: {
        label: { en: 'Has Income', es: 'Tiene Ingresos' },
        sensitive: true,
        category: 'Financial'
      },
      foodFrequency: {
        label: { en: 'Food Access', es: 'Acceso a Comida' },
        sensitive: true,
        category: 'Situation'
      },
      crisisLevel: {
        label: { en: 'Crisis Level', es: 'Nivel de Crisis' },
        sensitive: true,
        category: 'Mental Health'
      }
    }

    const fieldInfo = fieldMap[key] || {
      label: { en: key, es: key },
      sensitive: false,
      category: 'Other'
    }

    return {
      key,
      ...fieldInfo,
      value
    }
  })

  // Group by category
  const categories = Array.from(new Set(dataFields.map(f => f.category)))

  const formatValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? (language === 'es' ? 'Sí' : 'Yes') : (language === 'es' ? 'No' : 'No')
    }
    return String(value)
  }

  return (
    <div className="data-privacy-dashboard">
      <div className="dashboard-header">
        <h3>
          🔒 {language === 'es' ? 'Panel de Privacidad de Datos' : 'Data Privacy Dashboard'}
        </h3>
        <p className="dashboard-subtitle">
          {language === 'es'
            ? 'Aquí está exactamente qué información has compartido. Puedes controlar qué se incluye en la exportación.'
            : 'Here\'s exactly what information you\'ve shared. You can control what gets included in the export.'}
        </p>
      </div>

      <div className="data-summary">
        <div className="summary-stat">
          <span className="stat-number">{dataFields.length}</span>
          <span className="stat-label">
            {language === 'es' ? 'Campos totales' : 'Total fields'}
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{dataFields.filter(f => f.sensitive).length}</span>
          <span className="stat-label sensitive">
            {language === 'es' ? 'Sensibles' : 'Sensitive'}
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{selectedFields.size}</span>
          <span className="stat-label included">
            {language === 'es' ? 'Incluidos' : 'Included'}
          </span>
        </div>
      </div>

      <div className="data-categories">
        {categories.map(category => {
          const categoryFields = dataFields.filter(f => f.category === category)

          return (
            <div key={category} className="data-category">
              <h4 className="category-title">{category}</h4>
              <div className="category-fields">
                {categoryFields.map(field => (
                  <div key={field.key} className={`data-field ${field.sensitive ? 'sensitive' : ''}`}>
                    <div className="field-info">
                      <div className="field-header">
                        <span className="field-label">
                          {field.label[language]}
                          {field.sensitive && (
                            <span className="sensitive-badge" title={language === 'es' ? 'Información sensible' : 'Sensitive information'}>
                              🔒
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="field-value">{formatValue(field.value)}</span>
                    </div>
                    {onFieldToggle && (
                      <label className="field-toggle">
                        <input
                          type="checkbox"
                          checked={selectedFields.has(field.key)}
                          onChange={(e) => onFieldToggle(field.key, e.target.checked)}
                        />
                        <span className="toggle-label">
                          {language === 'es' ? 'Incluir' : 'Include'}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="privacy-notice">
        <strong>🛡️ {language === 'es' ? 'Tu privacidad:' : 'Your privacy:'}</strong>{' '}
        {language === 'es'
          ? 'Solo tú controlas qué se comparte. Los datos nunca se envían sin tu permiso explícito.'
          : 'Only you control what gets shared. Data is never sent without your explicit permission.'}
      </div>
    </div>
  )
}
