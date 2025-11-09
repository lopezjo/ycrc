import { useState, useEffect } from 'react'
import { Resource, UserResponse } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import { findResourcesForBarriers } from '../utils/barrierResources'
import ResourceCard from './ResourceCard'
import './ResourceDetailModal.css'

interface ResourceDetailModalProps {
  resource: Resource
  onClose: () => void
  onAssessmentComplete?: (assessment: { [questionId: string]: any }) => void
  userResponses?: UserResponse
}

export default function ResourceDetailModal({ resource, onClose, onAssessmentComplete, userResponses = {} }: ResourceDetailModalProps) {
  const { t, language } = useLanguage()
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: any }>({})
  const [showResults, setShowResults] = useState(false)
  
  const questions = resource.followUpQuestions || []
  const currentQuestion = questions[currentQuestionIndex]
  
  // Auto-start questions if resource has them
  useEffect(() => {
    if (questions.length > 0) {
      setShowQuestions(true)
    }
  }, [questions.length])

  const handleAnswer = (value: string | boolean) => {
    if (!currentQuestion) return

    const newResponses = {
      ...responses,
      [currentQuestion.field]: value
    }
    setResponses(newResponses)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
      // Notify parent component about completed assessment
      if (onAssessmentComplete) {
        onAssessmentComplete(newResponses)
      }
    }
  }

  const identifiedBarriers = questions
    .filter(q => {
      const response = responses[q.field]
      // If it's a yes/no question and they answered "no", it's a barrier
      if (q.type === 'yesno' && response === false) return true
      // If it's multiple choice and they selected something indicating a barrier
      if (q.type === 'multiple' && response && typeof response === 'string') {
        const barrierIndicators = ['emergency', 'urgent', 'no', 'cannot', "don't"]
        return barrierIndicators.some(indicator => response.toLowerCase().includes(indicator))
      }
      return false
    })
    .map(q => {
      const barrier = q.barrier || q.text;
      return typeof barrier === 'object' && 'en' in barrier ? barrier[language] || barrier.en : barrier;
    })

  const canUseResource = identifiedBarriers.length === 0
  
  // Find resources that can help with identified barriers
  const helpfulResources = identifiedBarriers.length > 0 
    ? findResourcesForBarriers(identifiedBarriers, resource.id, userResponses)
    : []

  return (
    <div className="resource-detail-overlay" onClick={onClose}>
      <div className="resource-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="resource-detail-close" onClick={onClose}>×</button>
        
        <div className="resource-detail-header">
          <h2>{typeof resource.name === 'object' ? resource.name[language] || resource.name.en : resource.name}</h2>
          <span className="resource-detail-category">{resource.category}</span>
        </div>

        {showQuestions && !showResults && questions.length > 0 && currentQuestion ? (
          <div className="resource-detail-questions">
            <div className="question-progress">
              {language === 'es' 
                ? `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`
                : `Question ${currentQuestionIndex + 1} of ${questions.length}`
              }
            </div>
            
            {currentQuestion.context && (
              <div className="question-context">
                {typeof currentQuestion.context === 'object'
                  ? currentQuestion.context[language] || currentQuestion.context.en
                  : currentQuestion.context}
              </div>
            )}
            
            <div className="question-text">
              {typeof currentQuestion.text === 'object'
                ? currentQuestion.text[language] || currentQuestion.text.en
                : currentQuestion.text}
            </div>

            <div className="question-options">
              {currentQuestion.type === 'yesno' ? (
                <>
                  <button onClick={() => handleAnswer(true)} className="option-btn">
                    {language === 'es' ? 'Sí' : 'Yes'}
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="option-btn"
                  >
                    {language === 'es' ? 'No' : 'No'}
                  </button>
                </>
              ) : currentQuestion.type === 'multiple' && currentQuestion.options ? (
                currentQuestion.options.map((option, index) => {
                  const optionText = typeof option === 'object' ? option[language] || option.en : option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(optionText)}
                      className="option-btn"
                    >
                      {optionText}
                    </button>
                  )
                })
              ) : null}
            </div>
          </div>
        ) : showResults ? (
          <div className="resource-detail-results">
            <div className="what-it-offers">
              <h3>{language === 'es' ? 'Lo que Ofrece' : 'What This Resource Offers'}</h3>
              {resource.whatItOffers && resource.whatItOffers.length > 0 ? (
                <ul>
                  {resource.whatItOffers.map((offer, idx) => (
                    <li key={idx}>
                      {typeof offer === 'object' && 'en' in offer
                        ? (offer[language] || offer.en)
                        : offer}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  {typeof resource.description === 'object' && 'en' in resource.description
                    ? resource.description[language] || resource.description.en
                    : resource.description}
                </p>
              )}
            </div>

            {identifiedBarriers.length > 0 && (
              <div className="identified-barriers">
                <h3>
                  {language === 'es' 
                    ? '⚠️ Posibles Desafíos Identificados'
                    : '⚠️ Possible Challenges Identified'
                  }
                </h3>
                <ul>
                  {identifiedBarriers.map((barrier, idx) => (
                    <li key={idx}>{barrier}</li>
                  ))}
                </ul>
                <div className="barrier-help">
                  <p>
                    {language === 'es'
                      ? 'Estos podrían ser desafíos para usar este recurso. Pero no te desanimes - muchos recursos pueden ayudar a superar estos obstáculos. Pregunta cuando llames.'
                      : 'These might be challenges for using this resource. But don\'t get discouraged - many resources can help overcome these barriers. Ask when you call.'
                    }
                  </p>
                </div>
              </div>
            )}

            {helpfulResources.length > 0 && (
              <div className="helpful-resources">
                <h3>
                  {language === 'es'
                    ? '💡 Recursos que Pueden Ayudar con Estos Desafíos'
                    : '💡 Resources That Can Help with These Challenges'
                  }
                </h3>
                <p className="helpful-resources-intro">
                  {language === 'es'
                    ? 'Estos recursos pueden ayudarte a superar los desafíos que identificamos:'
                    : 'These resources can help you overcome the challenges we identified:'
                  }
                </p>
                <div className="helpful-resources-list">
                  {helpfulResources.map((helpfulResource) => (
                    <ResourceCard
                      key={helpfulResource.id}
                      resource={helpfulResource}
                      onLearnMore={() => {
                        // Close current modal and let parent handle opening new one
                        onClose()
                        // Trigger a custom event that parent can listen to
                        window.dispatchEvent(new CustomEvent('openResource', { detail: helpfulResource }))
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {canUseResource && (
              <div className="resource-ready">
                <p>
                  {language === 'es'
                    ? '✅ Basado en tus respuestas, este recurso parece ser una buena opción para ti. No identificamos barreras obvias.'
                    : '✅ Based on your answers, this resource seems like a good fit for you. We didn\'t identify any obvious barriers.'
                  }
                </p>
              </div>
            )}

            <div className="resource-contact-info">
              <h3>{language === 'es' ? 'Información de Contacto' : 'Contact Information'}</h3>
              {resource.contact.phone && resource.contact.phone.length > 0 && (
                <p>
                  <strong>{t('phone')}</strong>{' '}
                  {resource.contact.phone.map((phone, index) => (
                    <span key={index}>
                      <a href={`tel:${phone}`}>{phone}</a>
                      {index < resource.contact.phone!.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              )}
              {resource.contact.email && (
                <p>
                  <strong>{t('email')}</strong>{' '}
                  <a href={`mailto:${resource.contact.email}`}>{resource.contact.email}</a>
                </p>
              )}
              {resource.contact.address && (
                <p>
                  <strong>{t('address')}</strong> {resource.contact.address}
                </p>
              )}
              {resource.hours && (
                <p>
                  <strong>{t('hours')}</strong>{' '}
                  {typeof resource.hours === 'object' && 'en' in resource.hours
                    ? resource.hours[language] || resource.hours.en
                    : resource.hours}
                </p>
              )}
            </div>

            <button onClick={onClose} className="close-results-btn">
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        ) : (
          <div className="resource-detail-info">
            <div className="what-it-offers">
              <h3>{language === 'es' ? 'Lo que Ofrece' : 'What This Resource Offers'}</h3>
              {resource.whatItOffers && resource.whatItOffers.length > 0 ? (
                <ul>
                  {resource.whatItOffers.map((offer, idx) => (
                    <li key={idx}>
                      {typeof offer === 'object' && 'en' in offer
                        ? (offer[language] || offer.en)
                        : offer}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  {typeof resource.description === 'object' && 'en' in resource.description
                    ? resource.description[language] || resource.description.en
                    : resource.description}
                </p>
              )}
            </div>

            {resource.commonBarriers && resource.commonBarriers.length > 0 && (
              <div className="common-barriers">
                <h3>
                  {language === 'es' 
                    ? 'Desafíos Comunes'
                    : 'Common Challenges'
                  }
                </h3>
                <ul>
                  {resource.commonBarriers.map((barrier, idx) => (
                    <li key={idx}>{barrier}</li>
                  ))}
                </ul>
              </div>
            )}

            {questions.length > 0 && !showQuestions && (
              <button 
                onClick={() => {
                  setShowQuestions(true)
                  setCurrentQuestionIndex(0)
                }}
                className="start-questions-btn"
              >
                {language === 'es' 
                  ? 'Verificar si Este Recurso Funciona para Mí'
                  : 'Check if This Resource Works for Me'
                }
              </button>
            )}

            <div className="resource-contact-info">
              <h3>{language === 'es' ? 'Información de Contacto' : 'Contact Information'}</h3>
              {resource.contact.phone && resource.contact.phone.length > 0 && (
                <p>
                  <strong>{t('phone')}</strong>{' '}
                  {resource.contact.phone.map((phone, index) => (
                    <span key={index}>
                      <a href={`tel:${phone}`}>{phone}</a>
                      {index < resource.contact.phone!.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              )}
              {resource.contact.email && (
                <p>
                  <strong>{t('email')}</strong>{' '}
                  <a href={`mailto:${resource.contact.email}`}>{resource.contact.email}</a>
                </p>
              )}
              {resource.contact.address && (
                <p>
                  <strong>{t('address')}</strong> {resource.contact.address}
                </p>
              )}
              {resource.hours && (
                <p>
                  <strong>{t('hours')}</strong>{' '}
                  {typeof resource.hours === 'object' && 'en' in resource.hours
                    ? resource.hours[language] || resource.hours.en
                    : resource.hours}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

