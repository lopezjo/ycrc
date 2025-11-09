import { UserResponse } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './CategorySuggestions.css'

interface CategorySuggestionsProps {
  responses: UserResponse
  onCategoryExplore: (category: string) => void
}

interface CategorySuggestion {
  category: string
  icon: string
  title: { en: string; es: string }
  description: { en: string; es: string }
  reasons: { en: string; es: string }
}

export default function CategorySuggestions({ responses, onCategoryExplore }: CategorySuggestionsProps) {
  const { language } = useLanguage()

  // Determine which categories to suggest based on their situation
  const suggestedCategories: CategorySuggestion[] = []

  const primarySituation = responses.situation as string

  // Always suggest food for housing insecurity
  if (primarySituation === 'Need shelter/housing') {
    suggestedCategories.push({
      category: 'Food',
      icon: '🍽️',
      title: { en: 'Food Assistance', es: 'Asistencia Alimentaria' },
      description: {
        en: 'Free meals, food pantries, and nutrition programs',
        es: 'Comidas gratuitas, despensas y programas de nutrición'
      },
      reasons: {
        en: 'Many people experiencing housing insecurity also need help with food',
        es: 'Muchas personas con problemas de vivienda también necesitan ayuda con comida'
      }
    })
  }

  // Suggest education resources for youth in/near school age
  if (responses.age && (responses.age as number) <= 24) {
    suggestedCategories.push({
      category: 'Education',
      icon: '📚',
      title: { en: 'Education Support', es: 'Apoyo Educativo' },
      description: {
        en: 'McKinney-Vento rights, school supplies, tutoring, and college resources',
        es: 'Derechos McKinney-Vento, útiles escolares, tutoría y recursos universitarios'
      },
      reasons: {
        en: 'You may qualify for special educational support and accommodations',
        es: 'Puedes calificar para apoyo educativo especial y adaptaciones'
      }
    })
  }

  // Suggest transportation for those needing shelter
  if (primarySituation === 'Need shelter/housing' || responses.transportToShelter === false) {
    suggestedCategories.push({
      category: 'Transportation',
      icon: '🚌',
      title: { en: 'Transportation Help', es: 'Ayuda de Transporte' },
      description: {
        en: 'Bus passes, gas cards, and transportation vouchers',
        es: 'Pases de autobús, tarjetas de gasolina y cupones de transporte'
      },
      reasons: {
        en: 'Getting to resources and services is often a major barrier',
        es: 'Llegar a los recursos y servicios suele ser una gran barrera'
      }
    })
  }

  // Suggest legal help for those in complex situations
  if (responses.age && (responses.age as number) < 18) {
    suggestedCategories.push({
      category: 'Legal',
      icon: '⚖️',
      title: { en: 'Legal Rights & Advocacy', es: 'Derechos Legales y Defensoría' },
      description: {
        en: 'Know your rights, emancipation, and legal protection',
        es: 'Conoce tus derechos, emancipación y protección legal'
      },
      reasons: {
        en: 'As a minor, you have specific legal protections and rights',
        es: 'Como menor, tienes protecciones y derechos legales específicos'
      }
    })
  }

  // Suggest job training for those 16+
  if (responses.age && (responses.age as number) >= 16 && primarySituation === 'Need shelter/housing') {
    suggestedCategories.push({
      category: 'Employment',
      icon: '💼',
      title: { en: 'Job Training & Employment', es: 'Capacitación Laboral y Empleo' },
      description: {
        en: 'Job training, resume help, and employment programs',
        es: 'Capacitación laboral, ayuda con currículum y programas de empleo'
      },
      reasons: {
        en: 'Building employment skills can lead to long-term stability',
        es: 'Desarrollar habilidades laborales puede conducir a estabilidad a largo plazo'
      }
    })
  }

  // Suggest healthcare for everyone
  if (!primarySituation || primarySituation !== 'Mental health support') {
    suggestedCategories.push({
      category: 'Healthcare',
      icon: '🏥',
      title: { en: 'Healthcare & Medical', es: 'Atención Médica' },
      description: {
        en: 'Free clinics, insurance enrollment, and medical care',
        es: 'Clínicas gratuitas, inscripción de seguro y atención médica'
      },
      reasons: {
        en: 'Staying healthy is important, and there are free options available',
        es: 'Mantenerse saludable es importante, y hay opciones gratuitas disponibles'
      }
    })
  }

  if (suggestedCategories.length === 0) {
    return null
  }

  return (
    <div className="category-suggestions">
      <div className="suggestions-header">
        <h3>
          💡 {language === 'es'
            ? 'También puedes necesitar ayuda con...'
            : 'You might also need help with...'}
        </h3>
        <p className="suggestions-subtitle">
          {language === 'es'
            ? 'Basado en tu situación, estos recursos adicionales podrían ser útiles:'
            : 'Based on your situation, these additional resources might be helpful:'}
        </p>
      </div>

      <div className="suggestions-grid">
        {suggestedCategories.map((suggestion) => (
          <div key={suggestion.category} className="suggestion-card">
            <div className="suggestion-icon">{suggestion.icon}</div>
            <h4 className="suggestion-title">
              {suggestion.title[language]}
            </h4>
            <p className="suggestion-description">
              {suggestion.description[language]}
            </p>
            <p className="suggestion-reason">
              <em>{suggestion.reasons[language]}</em>
            </p>
            <button
              onClick={() => onCategoryExplore(suggestion.category)}
              className="explore-category-btn"
            >
              {language === 'es' ? 'Explorar recursos' : 'Explore resources'}
            </button>
          </div>
        ))}
      </div>

      <div className="suggestions-footer">
        <p>
          {language === 'es'
            ? '💬 Recuerda: Puedes acceder a múltiples tipos de ayuda. No tienes que elegir solo uno.'
            : '💬 Remember: You can access multiple types of help. You don\'t have to choose just one.'}
        </p>
      </div>
    </div>
  )
}
