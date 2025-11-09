import { Message } from '../types'
import './MessageBubble.css'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  const isContext = message.type === 'context'
  const isSupport = message.type === 'support'
  const isConsent = message.type === 'consent'

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'} ${isContext ? 'context' : ''} ${isSupport ? 'support' : ''} ${isConsent ? 'consent' : ''}`}>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  )
}

