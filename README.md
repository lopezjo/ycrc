# Youth Resource Navigator

A conversational web application designed to help homeless youth find resources by asking clarifying questions and checking eligibility requirements.

## Features

- **Conversational Interface**: Chat-like experience similar to ChatGPT
- **Contextual Questions**: Each question includes context explaining why it's being asked
- **Eligibility Checking**: Automatically filters resources based on user responses
- **Resource Presentation**: Displays relevant resources with contact information
- **Trauma-Informed Design**: Skip, edit functionality with support resources
- **Session Persistence**: Saves progress so youth can return later
- **Bilingual Support**: Full English and Spanish translations
- **Resource Detail Assessment**: Follow-up questions to identify barriers and understand what resources offer
- **Data Export**: Export information in JSON format to share with providers (reduces duplicate data entry)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How It Works

1. User describes their situation
2. System asks clarifying questions with context
3. Answers are used to check eligibility for various resources
4. Eligible resources are presented with contact information
5. Users can click "Learn More" on any resource to:
   - See what the resource offers
   - Answer follow-up questions about barriers
   - Get personalized assessment
6. Users can export their data as JSON to share with providers

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
- CSS3

## Privacy & Data Control

- All data is stored locally in the browser
- Users can clear their data at any time
- Export is optional and user-controlled
- No data is sent to servers without explicit user action
