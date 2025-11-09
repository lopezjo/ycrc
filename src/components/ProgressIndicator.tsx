import { Question } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import './ProgressIndicator.css'

interface ProgressIndicatorProps {
  questions: Question[]
  currentIndex: number
  responses: { [key: string]: any }
  onQuestionClick?: (index: number) => void
  editable?: boolean
}

export default function ProgressIndicator({ 
  questions, 
  currentIndex, 
  responses,
  onQuestionClick,
  editable = false
}: ProgressIndicatorProps) {
  const { t, format } = useLanguage()
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        {format('questionOf', { current: currentIndex + 1, total: questions.length })}
      </div>
      {editable && (
        <div className="progress-edit-hint">
          {t('clickToEdit')}
        </div>
      )}
      {editable && (
        <div className="question-list">
          {questions.map((question, idx) => {
            const isAnswered = responses[question.field] !== undefined && responses[question.field] !== ''
            const isCurrent = idx === currentIndex
            return (
              <button
                key={question.id}
                onClick={() => onQuestionClick && onQuestionClick(idx)}
                className={`question-item ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                disabled={!isAnswered && !isCurrent}
              >
                <span className="question-number">{idx + 1}</span>
                <span className="question-preview">{question.text.substring(0, 40)}...</span>
                {isAnswered && <span className="checkmark">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

