import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import AIChat from './components/AIChat'
import ResourcesDisplay from './components/ResourcesDisplay'
import ConsentModal from './components/ConsentModal'
import ModeSelection from './components/ModeSelection'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageSwitcher from './components/LanguageSwitcher'
import { UserResponse, Resource } from './types'
import { saveConsent, hasConsent } from './utils/session'
import { consentInfo } from './data/consent'
import './App.css'

type IntakeMode = 'ai' | 'structured' | null

function AppContent() {
  const { t, language } = useLanguage()
  const [mode, setMode] = useState<IntakeMode>(null)
  const [aiResponses, setAIResponses] = useState<UserResponse>({})
  const [showAIResources, setShowAIResources] = useState(false)
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [resourceAssessments, setResourceAssessments] = useState<{ [resourceId: string]: { [questionId: string]: any } }>({})
  const [showConsent, setShowConsent] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  // Check for consent on mount - only once for the entire app
  useEffect(() => {
    if (!hasConsent()) {
      setShowConsent(true)
    }
    setConsentChecked(true)
  }, [])

  const handleModeSwitch = (newMode: IntakeMode) => {
    setMode(newMode)
  }

  const handleBackToModeSelection = () => {
    setMode(null)
  }

  const handleConsentAccept = () => {
    saveConsent(true)
    setShowConsent(false)
  }

  const handleConsentDecline = () => {
    alert(language === 'es'
      ? 'Entendemos. Puedes volver cuando estés listo.'
      : 'We understand. You can come back when you\'re ready.')
  }

  // Don't render anything until consent check is complete
  if (!consentChecked) {
    return null
  }

  return (
    <div className="app">
      {showConsent && (
        <ConsentModal
          consentInfo={consentInfo}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      )}

      {/* Show mode selection if no mode is chosen */}
      {mode === null ? (
        <>
          <header className="app-header">
            <div className="header-top">
              <h1>{t('appTitle')}</h1>
              <div className="header-controls">
                <LanguageSwitcher />
              </div>
            </div>
          </header>
          <ModeSelection onSelectMode={setMode} />
        </>
      ) : (
        <>
          <header className="app-header">
            <div className="header-top">
              <h1>{t('appTitle')}</h1>
              <div className="header-controls">
                <button
                  className="mode-btn switch-mode-btn"
                  onClick={handleBackToModeSelection}
                  title={language === 'es' ? 'Cambiar al otro modo' : 'Switch to the other mode'}
                >
                  🔄 {t('switchMode')}
                </button>
                <LanguageSwitcher />
              </div>
            </div>
            <p>{t('appSubtitle')}</p>
            {mode === 'ai' && (
              <div className="mode-description">
                ✨ {language === 'es'
                  ? 'Modo Conversacional: Habla libremente sobre tu situación. La IA te ayudará a encontrar recursos.'
                  : 'Conversational Mode: Speak freely about your situation. AI will help you find resources.'}
              </div>
            )}
          </header>

          {mode === 'ai' && (
        <>
          <div className={showAIResources ? 'hidden-view' : ''}>
            <AIChat
              initialResponses={aiResponses}
              onDataExtracted={setAIResponses}
              onShowResources={() => setShowAIResources(true)}
              isVisible={!showAIResources}
            />
          </div>

          {showAIResources && (
            <div className="ai-resources-view">
              <div className="back-to-chat">
                <button onClick={() => setShowAIResources(false)} className="back-btn">
                  ← {language === 'es' ? 'Volver a la conversación' : 'Back to conversation'}
                </button>
              </div>
              <ResourcesDisplay
                responses={aiResponses}
                selectedResources={selectedResources}
                setSelectedResources={setSelectedResources}
                resourceAssessments={resourceAssessments}
                setResourceAssessments={setResourceAssessments}
              />
            </div>
          )}
        </>
      )}

          {mode === 'structured' && <ChatInterface />}
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App

