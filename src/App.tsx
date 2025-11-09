import ChatInterface from './components/ChatInterface'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import LanguageSwitcher from './components/LanguageSwitcher'
import './App.css'

function AppContent() {
  const { t } = useLanguage()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>{t('appTitle')}</h1>
          <LanguageSwitcher />
        </div>
        <p>{t('appSubtitle')}</p>
      </header>
      <ChatInterface />
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

