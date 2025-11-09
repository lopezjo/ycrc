# Youth Resource Navigator

An AI-powered, trauma-informed intake system designed to help homeless youth find resources through compassionate, adaptive conversations. Built for the California Homeless Youth Project (CHYP) hackathon.

## 🌟 Key Features

### 💬 AI-Powered Conversational Mode
- **Natural Language Understanding**: Speak freely about your situation - no forms to fill out
- **Intelligent Data Extraction**: AI automatically understands what you need from natural conversation
- **Empathetic Responses**: Warm, non-judgmental AI that adapts to your emotional state
- **Quick Action Buttons**: One-click access to urgent needs (shelter, food, crisis support)
- **Multi-Session Support**: Come back anytime and pick up where you left off

### 🎯 Urgency-Based Resource Prioritization
- **Critical Resources First**: Urgent 24/7 resources appear at the top with visual emphasis
- **Smart Categorization**: Resources organized by urgency, priority, and relevance
- **Animated Alerts**: Pulsing effects draw attention to time-sensitive help

### 🧠 Proactive Multi-Category Suggestions
- **Discover Hidden Needs**: AI suggests related resources you might not know about
- **Contextual Recommendations**: If you need housing, we also suggest food, transportation, education
- **Visual Category Explorer**: Interactive cards showing what each resource type offers

### 🔒 Data Privacy & Transparency Dashboard
- **See Exactly What's Shared**: Visual dashboard shows every piece of information collected
- **Granular Control**: Toggle individual fields on/off before exporting
- **Sensitivity Indicators**: Clear marking of sensitive vs. basic information
- **Field-by-Field Permissions**: You control what providers see

### 🏳️‍🌈 LGBTQ+ Affirming Resources
- **Safe Space Indicators**: Resources explicitly marked as LGBTQ+ affirming
- **Visual Pride Badges**: Easy-to-spot rainbow flags on supportive resources
- **Inclusive Language**: Respectful, affirming communication throughout

### 🌍 Trauma-Informed Design
- **Skip Anything**: No question is required - share only what feels safe
- **Distress Detection**: Automatic recognition of crisis language with immediate support
- **Edit Anytime**: Go back and change answers without starting over
- **24/7 Support Resources**: Crisis hotlines always one click away
- **Bilingual Support**: Full English and Spanish translations

### 📊 System Integration
- **HMIS Export**: Compatible with Homeless Management Information System
- **Standard JSON Export**: Easy-to-use format for any provider
- **Resource Assessments**: Detailed barrier analysis for each program
- **Provider Preview**: See exactly what case workers will receive

## 🚀 Quick Start

**TL;DR**: `make dev` → Open http://localhost:5173 → Start chatting!

See [QUICKSTART.md](./QUICKSTART.md) for a step-by-step guide.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Optional: Anthropic API key for real AI (works without it in demo mode)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/ycrc.git
cd ycrc
```

2. Install dependencies:
```bash
make install
# or: npm install
```

3. (Optional) Configure AI:
```bash
cp .env.example .env
# Add your VITE_ANTHROPIC_API_KEY (recommended) or VITE_OPENAI_API_KEY in .env
# See DEBUGGING_GUIDE.md for troubleshooting
```

4. Start all development servers (frontend + proxy):
```bash
make dev
# or: make run
```

This starts:
- 📱 Frontend: http://localhost:5173
- 🔌 Proxy server: http://localhost:3001

5. Open your browser to `http://localhost:5173`

**Other useful commands:**
```bash
make stop      # Stop all servers
make build     # Build for production
make clean     # Clean dependencies and build files
make help      # Show all available commands
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How It Works

### AI Conversational Mode (Default)
1. Youth describes their situation in natural language
2. AI extracts key information (age, location, needs) automatically
3. System provides empathetic, contextual responses
4. AI suggests related needs (e.g., housing → also food, transportation)
5. Quick access button to view all matching resources
6. Categorized resources with urgency prioritization

### Structured Question Mode (Alternative)
1. System asks clarifying questions with context
2. Answers are used to check eligibility for various resources
3. Eligible resources are presented with contact information
4. Users can click "Learn More" on any resource to:
   - See what the resource offers
   - Answer follow-up questions about barriers
   - Get personalized assessment
5. Users can export their data as JSON to share with providers

### Switching Modes
Use the mode switcher in the header to toggle between AI and Structured modes at any time.

## Data Export

The app can generate JSON files in two formats:

1. **Standard Format**: Simple, easy-to-use format with all user responses and selected resources
2. **HMIS Format**: Compatible with Homeless Management Information System standards

Users can:
- Preview the data before exporting
- Choose what to include (selected resources, assessments, etc.)
- Download as JSON file to share with providers
- Avoid filling out duplicate forms at multiple agencies

## Project Structure

- `src/components/` - React components (ChatInterface, MessageBubble, ResourceCard, ResourceDetailModal, DataExportModal)
- `src/data/` - Question flow and resource database
- `src/utils/` - Eligibility checking logic and data export utilities
- `src/i18n/` - Translation system (English & Spanish)
- `src/types.ts` - TypeScript type definitions

## Customization

- **Resources**: Edit `src/data/resources.ts` to add/modify resources
- **Questions**: Edit `src/data/questions.ts` to modify the question flow
- **Eligibility Logic**: Edit `src/utils/eligibility.ts` to change matching criteria
- **Translations**: Edit `src/i18n/translations.ts` to add/modify translations

## Technologies

- React 18
- TypeScript
- Vite
- OpenAI GPT-4 (optional, works in demo mode without API key)
- CSS3 with animations

## Alignment with CHYP Challenge Criteria

### ✅ Human-Centered Design
- Adaptive AI questioning based on capacity and urgency
- Empathetic, conversational tone throughout
- Pause, skip, and edit capabilities
- Non-linear, multi-session completion

### ✅ Understanding and Agency
- Plain-language explanations for every question
- Visual data privacy dashboard showing exactly what's shared
- Granular data-sharing controls (field-by-field)
- Transparent consent summaries

### ✅ System Integration
- Auto-populates HMIS-compatible export format
- Portable, youth-controlled digital profiles
- Ready for integration with service provider databases
- JSON export reduces redundant intake across agencies

### ✅ Trauma-Informed Principles
- Distress detection with immediate support resources
- Pause options during difficult questions
- Non-linear completion (skip anything)
- LGBTQ+ affirming resource indicators

### ✅ Innovation
- AI-powered natural language understanding
- Proactive multi-category resource discovery
- Urgency-based resource prioritization
- Real-time empathetic response generation

## Privacy & Data Control

- **Local-First**: All data stored in browser, never sent to servers
- **User-Controlled Export**: You choose what to share and when
- **Granular Permissions**: Toggle individual fields before export
- **Visual Transparency**: See exactly what information you've provided
- **Clear Anytime**: Delete all your data with one click
- **No Accounts Required**: Anonymous, accessible to everyone

## Demo Features

The AI service includes an intelligent mock mode that works without API keys:
- Pattern-based intent recognition
- Keyword extraction for age, location, needs
- Urgency level detection
- Empathetic response generation
- Multi-category suggestions

For production use, add an Anthropic Claude or OpenAI API key for enhanced natural language understanding.

## Debugging & Troubleshooting

The app includes comprehensive debug logging. Open your browser console (F12) to see:
- `[AI Service]` logs for all AI operations
- `[AI Service ERROR]` logs for any failures
- Automatic fallback to mock AI on errors

See **DEBUGGING_GUIDE.md** for detailed troubleshooting steps, common issues, and test scenarios.
