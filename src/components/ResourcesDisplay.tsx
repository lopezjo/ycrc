import { useState, useEffect } from 'react'
import { UserResponse, Resource } from '../types'
import { resources } from '../data/resources'
import { classifyAllResources } from '../utils/eligibility'
import { useLanguage } from '../i18n/LanguageContext'
import ResourceCard from './ResourceCard'
import IneligibleResourceCard from './IneligibleResourceCard'
import PotentiallyEligibleResourceCard from './PotentiallyEligibleResourceCard'
import ResourceDetailModal from './ResourceDetailModal'
import './ResourcesDisplay.css'

interface ResourcesDisplayProps {
  responses: UserResponse
  selectedResources: Resource[]
  setSelectedResources: (value: Resource[] | ((prev: Resource[]) => Resource[])) => void
  resourceAssessments: { [resourceId: string]: { [questionId: string]: any } }
  setResourceAssessments: (value: { [resourceId: string]: { [questionId: string]: any } } | ((prev: { [resourceId: string]: { [questionId: string]: any } }) => { [resourceId: string]: { [questionId: string]: any } })) => void
}

export default function ResourcesDisplay({ 
  responses, 
  selectedResources,
  setSelectedResources,
  resourceAssessments,
  setResourceAssessments 
}: ResourcesDisplayProps) {
  const { t, format, language } = useLanguage()
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const classification = classifyAllResources(resources, responses)
  
  const handleResourceSelected = (resource: Resource) => {
    if (!selectedResources.find(r => r.id === resource.id)) {
      setSelectedResources([...selectedResources, resource])
    }
    setSelectedResource(resource)
  }
  
  const handleAssessmentComplete = (resourceId: string, assessment: { [questionId: string]: any }) => {
    setResourceAssessments({
      ...resourceAssessments,
      [resourceId]: assessment
    })
  }

  // Listen for custom event to open a resource from helpful resources list
  useEffect(() => {
    const handleOpenResource = (event: Event) => {
      const customEvent = event as CustomEvent<Resource>
      setSelectedResource(customEvent.detail)
    }

    window.addEventListener('openResource', handleOpenResource as EventListener)
    return () => {
      window.removeEventListener('openResource', handleOpenResource as EventListener)
    }
  }, [])

  return (
    <>
      <div className="resources-display" id="resources-top">
        {classification.eligible.length > 0 && (
          <div id="eligible-resources-section" className="resource-section">
            <h3 className="section-title eligible-title">
              ✅ {format('resourcesEligible', { count: classification.eligible.length })}
            </h3>
            <div className="resources-container">
              {classification.eligible.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource}
                  onLearnMore={handleResourceSelected}
                />
              ))}
            </div>
          </div>
        )}

      {classification.potentiallyEligible.length > 0 && (
        <div className="resource-section">
          <h3 className="section-title potentially-title">
            💡 {format('resourcesPotentiallyEligible', { count: classification.potentiallyEligible.length })}
          </h3>
          <p className="section-description">
            {t('needMoreInfo')}
          </p>
          <div className="resources-container">
            {classification.potentiallyEligible.map(({ resource, missingInfo }) => (
              <PotentiallyEligibleResourceCard 
                key={resource.id} 
                resource={resource} 
                missingInfo={missingInfo}
                onLearnMore={handleResourceSelected}
              />
            ))}
          </div>
        </div>
      )}

      {classification.ineligible.length > 0 && (
        <div className="resource-section">
          <h3 className="section-title ineligible-title">
            📋 {format('resourcesIneligible', { count: classification.ineligible.length })}
          </h3>
          <p className="section-description">
            {t('resourcesNotAvailable')}
          </p>
          <details className="ineligible-details">
            <summary>{t('showIneligible')}</summary>
            <div className="resources-container">
              {classification.ineligible.map(({ resource, reasons }) => (
                <IneligibleResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  reasons={reasons}
                />
              ))}
            </div>
          </details>
        </div>
      )}
      </div>

      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onAssessmentComplete={(assessment) => handleAssessmentComplete(selectedResource.id, assessment)}
          userResponses={responses}
        />
      )}
    </>
  )
}

