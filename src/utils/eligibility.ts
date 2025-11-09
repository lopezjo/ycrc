import { Resource, UserResponse, EligibilityResult } from '../types'

export function checkEligibility(resource: Resource, responses: UserResponse): boolean {
  const result = checkEligibilityDetailed(resource, responses)
  return result.eligible
}

export function checkEligibilityDetailed(resource: Resource, responses: UserResponse): EligibilityResult {
  const criteria = resource.eligibility
  const reasons: string[] = []
  const missingInfo: string[] = []

  // Check age
  if (criteria.age) {
    const age = Number(responses.age)
    if (isNaN(age) || !responses.age) {
      missingInfo.push('age')
    } else {
      if (criteria.age.min !== undefined && age < criteria.age.min) {
        reasons.push(`You need to be at least ${criteria.age.min} years old (you're ${age})`)
      }
      if (criteria.age.max !== undefined && age > criteria.age.max) {
        reasons.push(`This program is for people up to ${criteria.age.max} years old (you're ${age})`)
      }
    }
  }

  // Check location
  if (criteria.location && criteria.location.length > 0) {
    const userLocation = String(responses.location || '').toLowerCase()
    if (!userLocation) {
      missingInfo.push('location')
    } else {
      const matches = criteria.location.some(loc => 
        userLocation.includes(loc.toLowerCase())
      )
      if (!matches) {
        reasons.push(`This program is only available in: ${criteria.location.join(', ')}`)
      }
    }
  }

  // Check situation - more flexible matching
  if (criteria.situation && criteria.situation.length > 0) {
    const userSituation = String(responses.situation || '').toLowerCase()
    if (!userSituation) {
      missingInfo.push('situation')
    } else {
      const matches = criteria.situation.some(sit => {
        const sitLower = sit.toLowerCase()
        // Direct match
        if (userSituation.includes(sitLower)) return true
        // Related terms
        if (sitLower === 'car' && (userSituation.includes('vehicle') || userSituation.includes('sleeping in'))) return true
        if (sitLower === 'homeless' && (userSituation.includes('no place') || userSituation.includes('nowhere') || userSituation.includes('couch'))) return true
        if (sitLower === 'at-risk' && (userSituation.includes('unsafe') || userSituation.includes('dangerous'))) return true
        return false
      })
      if (!matches) {
        reasons.push(`This program is for people who are: ${criteria.situation.join(' or ')}`)
      }
    }
  }

  // Check hasId
  if (criteria.hasId !== undefined) {
    if (responses.hasId === undefined || responses.hasId === '') {
      missingInfo.push('ID status')
    } else {
      const userHasId = responses.hasId === true || responses.hasId === 'yes'
      if (criteria.hasId !== userHasId) {
        reasons.push(criteria.hasId 
          ? 'This program requires a valid ID' 
          : 'This program is for people who do not have an ID')
      }
    }
  }

  // Check hasIncome
  if (criteria.hasIncome !== undefined) {
    if (responses.hasIncome === undefined || responses.hasIncome === '') {
      missingInfo.push('income status')
    } else {
      const userHasIncome = responses.hasIncome === true || responses.hasIncome === 'yes'
      if (criteria.hasIncome !== userHasIncome) {
        reasons.push(criteria.hasIncome 
          ? 'This program is for people who have income' 
          : 'This program is for people who do not have income')
      }
    }
  }

  // Check inSchool
  if (criteria.inSchool !== undefined) {
    if (responses.inSchool === undefined || responses.inSchool === '') {
      missingInfo.push('school enrollment status')
    } else {
      const userInSchool = responses.inSchool === true || responses.inSchool === 'yes'
      if (criteria.inSchool !== userInSchool) {
        reasons.push(criteria.inSchool 
          ? 'This program is for people currently enrolled in school' 
          : 'This program is for people not currently in school')
      }
    }
  }

  // Check duration
  if (criteria.duration) {
    const userDuration = String(responses.duration || '').toLowerCase()
    if (!userDuration) {
      missingInfo.push('duration of situation')
    } else {
      if (!userDuration.includes(criteria.duration.toLowerCase())) {
        reasons.push(`This program is for people who have been in this situation for: ${criteria.duration}`)
      }
    }
  }

  // If we have reasons, they're ineligible
  if (reasons.length > 0) {
    return { eligible: false, reasons, missingInfo: missingInfo.length > 0 ? missingInfo : undefined }
  }

  // If we have missing info but no reasons, they might be eligible
  if (missingInfo.length > 0) {
    return { eligible: false, missingInfo }
  }

  // All checks passed
  return { eligible: true }
}

export function filterEligibleResources(resources: Resource[], responses: UserResponse): Resource[] {
  const eligible = resources.filter(resource => checkEligibility(resource, responses))
  
  // Sort by priority: urgent/high priority first, then by category relevance
  return eligible.sort((a, b) => {
    // Urgent resources first
    if (a.urgent && !b.urgent) return -1
    if (!a.urgent && b.urgent) return 1
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = priorityOrder[a.priority || 'low']
    const bPriority = priorityOrder[b.priority || 'low']
    if (aPriority !== bPriority) return aPriority - bPriority
    
    // Then by category (prioritize multi-service, then housing, food, transport)
    const categoryOrder: { [key: string]: number } = {
      'Multi-Service': 0,
      'Crisis Support': 1,
      'Housing': 2,
      'Food': 3,
      'Transportation': 4,
      'Education': 5,
      'Benefits': 6,
      'Healthcare': 7,
      'Employment': 8,
      'Legal': 9,
      'Documentation': 10
    }
    
    // For resources with multiple categories, use the highest priority (lowest number)
    const getHighestPriorityCategory = (categories: string[]): number => {
      return Math.min(...categories.map(cat => categoryOrder[cat] ?? 99))
    }
    
    const aCat = getHighestPriorityCategory(a.category)
    const bCat = getHighestPriorityCategory(b.category)
    return aCat - bCat
  })
}

export interface ResourceClassification {
  eligible: Resource[]
  ineligible: Array<{ resource: Resource; reasons: string[] }>
  potentiallyEligible: Array<{ resource: Resource; missingInfo: string[] }>
}

export function classifyAllResources(resources: Resource[], responses: UserResponse): ResourceClassification {
  const eligible: Resource[] = []
  const ineligible: Array<{ resource: Resource; reasons: string[] }> = []
  const potentiallyEligible: Array<{ resource: Resource; missingInfo: string[] }> = []

  resources.forEach(resource => {
    const result = checkEligibilityDetailed(resource, responses)
    
    if (result.eligible) {
      eligible.push(resource)
    } else if (result.reasons && result.reasons.length > 0) {
      // They're ineligible for a specific reason
      ineligible.push({ resource, reasons: result.reasons })
    } else if (result.missingInfo && result.missingInfo.length > 0) {
      // We don't have enough info - they might be eligible
      potentiallyEligible.push({ resource, missingInfo: result.missingInfo })
    } else {
      // Fallback - shouldn't happen but just in case
      potentiallyEligible.push({ resource, missingInfo: ['additional information'] })
    }
  })

  // Sort eligible resources
  eligible.sort((a, b) => {
    if (a.urgent && !b.urgent) return -1
    if (!a.urgent && b.urgent) return 1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = priorityOrder[a.priority || 'low']
    const bPriority = priorityOrder[b.priority || 'low']
    if (aPriority !== bPriority) return aPriority - bPriority
    return 0
  })

  return { eligible, ineligible, potentiallyEligible }
}

