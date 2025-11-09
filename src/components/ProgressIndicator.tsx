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
  const answeredCount = Object.keys(responses).length
  const currentQuestionNumber = answeredCount + 1
  const progress = (currentQuestionNumber / questions.length) * 100

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        {format('questionOf', { current: currentQuestionNumber, total: questions.length })}
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
            const currentAnswer = responses[question.field]
            
            // Format the answer for display
            let answerText = ''
            if (isAnswered && currentAnswer !== undefined) {
              if (typeof currentAnswer === 'boolean') {
                answerText = currentAnswer ? 'Yes' : 'No'
              } else {
                answerText = String(currentAnswer)
                // Truncate long answers
                if (answerText.length > 30) {
                  answerText = answerText.substring(0, 30) + '...'
                }
              }
            }
            
            return (
              <button
                key={question.id}
                onClick={() => onQuestionClick && onQuestionClick(idx)}
                className={`question-item ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                disabled={!isAnswered && !isCurrent}
              >
                <div className="question-content">
                  <span className="question-number">{idx + 1}</span>
                  <span className="question-preview">{question.text}</span>
                  {isAnswered && <span className="checkmark">✓</span>}
                </div>
                {isAnswered && answerText && (
                  <div className="current-answer">
                    <span className="answer-label">Answer: </span>
                    <span className="answer-value">{answerText}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

