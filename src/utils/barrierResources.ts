import { Resource } from '../types'
import { resources } from '../data/resources'
import { checkEligibilityDetailed } from './eligibility'
import { UserResponse } from '../types'

/**
 * Maps barriers to resource categories/IDs that can help
 */
const barrierResourceMap: { [key: string]: string[] } = {
  'Transportation': ['transport-1', 'multi-1'],
  'transportation to the shelter': ['transport-1', 'multi-1'],
  'transportation to food bank': ['transport-1', 'multi-1'],
  'transportation to center': ['transport-1', 'multi-1'],
  'Documentation requirements': ['id-1', 'multi-1'],
  'Documentation': ['id-1', 'multi-1'],
  'Curfew requirements': ['multi-1', 'crisis-1'],
  'Food storage': ['food-2', 'multi-1'],
  'Availability during center hours': ['crisis-1', 'multi-1'],
  'Timing/urgency': ['crisis-1', 'transport-1'],
  'Type of transportation need': ['transport-1']
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
      resourceIds.add('transport-1')
      resourceIds.add('multi-1')
    }

    // Check for documentation/ID barriers
    if (normalizedBarrier.includes('documentation') || normalizedBarrier.includes('id') || normalizedBarrier.includes('identification')) {
      resourceIds.add('id-1')
      resourceIds.add('multi-1')
    }

    // Check for food-related barriers
    if (normalizedBarrier.includes('food') || normalizedBarrier.includes('storage')) {
      resourceIds.add('food-2')
      resourceIds.add('multi-1')
    }

    // Check for time/availability barriers
    if (normalizedBarrier.includes('curfew') || normalizedBarrier.includes('hours') || normalizedBarrier.includes('time') || normalizedBarrier.includes('available')) {
      resourceIds.add('multi-1')
      resourceIds.add('crisis-1')
    }
  })

  // Get the actual resources and check eligibility
  resourceIds.forEach(id => {
    const resource = resources.find(r => r.id === id)
    if (resource) {
      const eligibility = checkEligibilityDetailed(resource, userResponses)
      // Include if eligible or potentially eligible (missing info only, no hard disqualifiers)
      if (eligibility.eligible || (eligibility.missingInfo && eligibility.missingInfo.length > 0 && !eligibility.reasons)) {
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

