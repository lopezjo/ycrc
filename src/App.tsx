import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import AIChat from './components/AIChat'
import ResourcesDisplay from './components/ResourcesDisplay'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageSwitcher from './components/LanguageSwitcher'
import { UserResponse, Resource } from './types'
import './App.css'

type IntakeMode = 'ai' | 'structured'

function AppContent() {
  const { t, language } = useLanguage()
  const [mode, setMode] = useState<IntakeMode>('ai')
  const [aiResponses, setAIResponses] = useState<UserResponse>({})
  const [showAIResources, setShowAIResources] = useState(false)
  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [resourceAssessments, setResourceAssessments] = useState<{ [resourceId: string]: { [questionId: string]: any } }>({})

  const handleModeSwitch = (newMode: IntakeMode) => {
    if (confirm(language === 'es'
      ? '¿Cambiar de modo? Tu progreso se guardará.'
      : 'Switch modes? Your progress will be saved.')) {
      setMode(newMode)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>{t('appTitle')}</h1>
          <div className="header-controls">
            <div className="mode-switcher">
              <button
                className={`mode-btn ${mode === 'ai' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('ai')}
                title={language === 'es' ? 'Modo conversacional con IA' : 'AI Conversational Mode'}
              >
                💬 {language === 'es' ? 'IA' : 'AI'}
              </button>
              <button
                className={`mode-btn ${mode === 'structured' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('structured')}
                title={language === 'es' ? 'Modo de preguntas estructuradas' : 'Structured Questions Mode'}
              >
                📋 {language === 'es' ? 'Estructurado' : 'Structured'}
              </button>
            </div>
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
          <div style={{ display: showAIResources ? 'none' : 'block' }}>
            <AIChat
              initialResponses={aiResponses}
              onDataExtracted={setAIResponses}
              onShowResources={() => setShowAIResources(true)}
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

