import { Resource } from '../types'
import { resources } from '../data/resources'
import { checkEligibilityDetailed } from './eligibility'
import { UserResponse } from '../types'

/**
 * Maps barriers to resource categories/IDs that can help
 */
const barrierResourceMap: { [key: string]: string[] } = {
  'Transportation': ['shelter-2-verif'], // NORTHERN CALIFORNIA FAMILY CENTER offers transportation assistance
  'transportation to the shelter': ['shelter-2-verif'],
  'transportation to food bank': ['shelter-2-verif'],
  'transportation to center': ['shelter-2-verif'],
  'Documentation requirements': ['food-1-verif'], // AT THE CROSSROADS has "No ID required" 
  'Documentation': ['food-1-verif'],
  'Identication requirements': ['food-1-verif'],
  'Limited space': ['shelter-2-verif', 'shelter-3-verif', 'shelter-4-verif'], // Alternative shelters
  'Limited Space': ['shelter-2-verif', 'shelter-3-verif', 'shelter-4-verif']
}

/**
 * Find resources that can help with identified barriers
 */
export function findResourcesForBarriers(
  barriers: string[],
  currentResourceId: string,
  userResponses: UserResponse
): Resource[] {
  const helpfulResources: Resource[] = []
  const resourceIds = new Set<string>()

  // Collect all relevant resource IDs based on barriers
  barriers.forEach(barrier => {
    const normalizedBarrier = barrier.toLowerCase()
    
    // Check direct matches
    Object.keys(barrierResourceMap).forEach(key => {
      if (normalizedBarrier.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedBarrier)) {
        barrierResourceMap[key].forEach(id => {
          if (id !== currentResourceId) {
            resourceIds.add(id)
          }
        })
      }
    })

    // Check for transportation-related barriers
    if (normalizedBarrier.includes('transport') || normalizedBarrier.includes('get to') || normalizedBarrier.includes('way to')) {
      resourceIds.add('shelter-2-verif') // NORTHERN CALIFORNIA FAMILY CENTER
    }

    // Check for documentation/ID barriers  
    if (normalizedBarrier.includes('documentation') || normalizedBarrier.includes('id') || normalizedBarrier.includes('identification')) {
      resourceIds.add('food-1-verif') // AT THE CROSSROADS (No ID required)
    }

    // Check for space/capacity barriers
    if (normalizedBarrier.includes('space') || normalizedBarrier.includes('capacity') || normalizedBarrier.includes('full')) {
      resourceIds.add('shelter-2-verif') // NORTHERN CALIFORNIA FAMILY CENTER
      resourceIds.add('shelter-3-verif') // BILL WILSON CENTER  
      resourceIds.add('shelter-4-verif') // LARKIN STREET YOUTH SERVICES
    }
  })

  // Get the actual resources and check eligibility
  resourceIds.forEach(id => {
    const resource = resources.find(r => r.id === id)
    if (resource) {
      const eligibility = checkEligibilityDetailed(resource, userResponses)
      // Be more permissive for barrier resources - include if eligible, potentially eligible, 
      // or if the only barrier is age/duration (since barrier resources might still be helpful)
      if (eligibility.eligible || 
          (eligibility.missingInfo && eligibility.missingInfo.length > 0) ||
          (eligibility.reasons && eligibility.reasons.length === 1 && 
           (eligibility.reasons[0].includes('age') || eligibility.reasons[0].includes('duration')))) {
        helpfulResources.push(resource)
      }
    }
  })

  // Remove duplicates and sort by priority
  let uniqueResources = Array.from(
    new Map(helpfulResources.map(r => [r.id, r])).values()
  )

  uniqueResources = uniqueResources.filter(r => r.id !== currentResourceId)

  uniqueResources.sort((a, b) => {
    if (a.urgent && !b.urgent) return -1
    if (!a.urgent && b.urgent) return 1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = priorityOrder[a.priority || 'low']
    const bPriority = priorityOrder[b.priority || 'low']
    if (aPriority !== bPriority) return aPriority - bPriority
    return 0
  })

  return uniqueResources
}

