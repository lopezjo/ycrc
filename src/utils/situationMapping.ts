// Utility to map free-form text responses to standardized situation categories
export interface SituationMapping {
  [standardSituation: string]: string[]
}

export const situationMappings: SituationMapping = {
  'Need shelter/housing': [
    'shelter', 'housing', 'homeless', 'place to stay', 'place to sleep', 
    'nowhere to go', 'no place to live', 'couch surfing', 'couch hopping',
    'living in car', 'sleeping in car', 'vehicle', 'tent', 'camping',
    'kicked out', 'evicted', 'can\'t go home', 'unsafe home', 'dangerous home',
    'staying with friends', 'temporary housing', 'transitional housing',
    'need a roof', 'need somewhere to stay', 'need accommodation',
    'street', 'outside', 'park', 'bridge', 'underpass',
    'motel', 'hotel', 'can\'t afford rent', 'lost my place'
  ],
  
  'Need food': [
    'food', 'hungry', 'eat', 'meal', 'meals', 'breakfast', 'lunch', 'dinner',
    'groceries', 'food pantry', 'food bank', 'nutrition', 'starving',
    'can\'t afford food', 'no money for food', 'food stamps', 'snap',
    'need to eat', 'haven\'t eaten', 'food assistance', 'feed myself',
    'kitchen', 'cooking', 'snacks', 'food insecurity'
  ],
  
  'Mental health support': [
    'mental health', 'depression', 'anxiety', 'stressed', 'overwhelmed',
    'therapy', 'counseling', 'counselor', 'therapist', 'psychiatrist',
    'medication', 'meds', 'suicide', 'suicidal', 'self harm', 'cutting',
    'ptsd', 'trauma', 'abuse', 'panic attacks', 'panic disorder',
    'bipolar', 'schizophrenia', 'addiction', 'substance abuse', 'drugs',
    'alcohol', 'drinking', 'using', 'detox', 'rehab', 'recovery',
    'emotional support', 'crisis', 'emergency', 'breakdown',
    'feel hopeless', 'can\'t cope', 'need help', 'support group'
  ],
  
  'Education help': [
    'school', 'education', 'ged', 'diploma', 'college', 'university',
    'classes', 'studying', 'tutoring', 'homework', 'learning',
    'dropped out', 'finish school', 'go back to school', 'enrollment',
    'academic', 'degree', 'certificate', 'training program',
    'literacy', 'reading', 'writing', 'math', 'esl', 'english',
    'student', 'books', 'supplies', 'tuition', 'financial aid'
  ],
  
  'Job training/employment': [
    'job', 'work', 'employment', 'career', 'income', 'money',
    'job training', 'vocational', 'skills', 'resume', 'interview',
    'unemployed', 'looking for work', 'need a job', 'job search',
    'apprenticeship', 'internship', 'workplace', 'employer',
    'certification', 'trade', 'construction', 'retail', 'food service',
    'office work', 'computer skills', 'job placement', 'career counseling',
    'can\'t find work', 'laid off', 'fired', 'between jobs'
  ],
  
  'Other/Multiple needs': [
    'multiple', 'several', 'many', 'various', 'different', 'everything',
    'all of the above', 'complex', 'complicated', 'don\'t know',
    'not sure', 'other', 'something else', 'misc', 'general help'
  ]
}

/**
 * Maps free-form user input to standardized situation categories
 * @param userInput - The user's free-form text describing their situation
 * @returns Array of matching standardized situation categories
 */
export function mapUserInputToSituations(userInput: string): string[] {
  if (!userInput || typeof userInput !== 'string') {
    return []
  }

  const input = userInput.toLowerCase().trim()
  const matchedSituations: string[] = []

  // Check each standardized situation category
  for (const [standardSituation, keywords] of Object.entries(situationMappings)) {
    // Check if any keyword matches the user input
    const hasMatch = keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase()
      
      // Exact match
      if (input === keywordLower) return true
      
      // Contains match (with word boundaries for better accuracy)
      if (input.includes(keywordLower)) {
        // For single words, ensure it's a word boundary match
        if (!keywordLower.includes(' ')) {
          const wordRegex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
          return wordRegex.test(input)
        }
        return true
      }
      
      return false
    })

    if (hasMatch && !matchedSituations.includes(standardSituation)) {
      matchedSituations.push(standardSituation)
    }
  }

  return matchedSituations
}

/**
 * Gets the primary (most specific) situation from user input
 * @param userInput - The user's free-form text describing their situation
 * @returns The most relevant standardized situation category, or the original input if no match
 */
export function getPrimarySituation(userInput: string): string {
  const matchedSituations = mapUserInputToSituations(userInput)
  
  // Return the first match (could be enhanced with priority logic)
  if (matchedSituations.length > 0) {
    // Prioritize more specific situations over "Other/Multiple needs"
    const specificSituations = matchedSituations.filter(s => s !== 'Other/Multiple needs')
    if (specificSituations.length > 0) {
      return specificSituations[0]
    }
    return matchedSituations[0]
  }
  
  // Return original input if no standardized match found
  return userInput
}

/**
 * Enhanced situation matching for eligibility checking
 * @param userSituation - User's situation text
 * @param targetSituation - Resource's required situation
 * @returns Whether the user's situation matches the target
 */
export function doesSituationMatch(userSituation: string, targetSituation: string): boolean {
  if (!userSituation || !targetSituation) return false
  
  const userLower = userSituation.toLowerCase()
  const targetLower = targetSituation.toLowerCase()
  
  // Direct match
  if (userLower.includes(targetLower) || targetLower.includes(userLower)) {
    return true
  }
  
  // Check if user's input maps to the target situation
  const mappedSituations = mapUserInputToSituations(userSituation)
  const targetMappedSituations = mapUserInputToSituations(targetSituation)
  
  // Check if user situation maps to any standard situation that includes the target
  for (const mapped of mappedSituations) {
    if (mapped.toLowerCase().includes(targetLower) || targetLower.includes(mapped.toLowerCase())) {
      return true
    }
    
    // Check if the mapped situation has keywords that include the target
    const keywords = situationMappings[mapped] || []
    if (keywords.some(keyword => keyword.toLowerCase() === targetLower)) {
      return true
    }
  }
  
  // Check if target situation maps to any standard situation that the user matches
  for (const targetMapped of targetMappedSituations) {
    if (userLower.includes(targetMapped.toLowerCase()) || targetMapped.toLowerCase().includes(userLower)) {
      return true
    }
    
    // Check if the target mapped situation has keywords that match user input
    const keywords = situationMappings[targetMapped] || []
    if (keywords.some(keyword => userLower.includes(keyword.toLowerCase()))) {
      return true
    }
  }
  
  // Special case: Check if user's standard situation keywords include target
  if (situationMappings[userSituation]) {
    const userKeywords = situationMappings[userSituation]
    if (userKeywords.some(keyword => keyword.toLowerCase() === targetLower)) {
      return true
    }
  }
  
  return false
}