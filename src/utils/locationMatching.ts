// Geographic regions and proximity matching for California cities

// Define Bay Area cities and their relationships
const bayAreaCities = [
  'san francisco',
  'sf',
  'oakland',
  'san jose',
  'palo alto',
  'mountain view',
  'sunnyvale',
  'santa clara',
  'fremont',
  'hayward',
  'berkeley',
  'richmond',
  'san mateo',
  'redwood city',
  'daly city',
  'south san francisco'
]

const losAngelesCities = [
  'los angeles',
  'la',
  'santa monica',
  'pasadena',
  'long beach',
  'glendale',
  'burbank',
  'inglewood',
  'compton',
  'torrance'
]

const sanDiegoCities = [
  'san diego',
  'chula vista',
  'oceanside',
  'carlsbad',
  'el cajon'
]

const sacramentoCities = [
  'sacramento',
  'elk grove',
  'roseville',
  'folsom'
]

// Distance tiers for matching
const DISTANCE_TIERS = {
  EXACT: 0,      // Same city
  NEARBY: 1,     // Same metro area (e.g., San Jose → SF)
  REGIONAL: 2,   // Same region (e.g., Bay Area)
  STATEWIDE: 3   // Anywhere in California
}

interface LocationMatch {
  matches: boolean
  distance: number
  reason?: string
}

/**
 * Check if a user's location matches a resource's location requirements
 * Uses geographic proximity and regional matching
 */
export function checkLocationMatch(
  userLocation: string,
  resourceLocations: string[]
): LocationMatch {
  const normalizedUser = userLocation.toLowerCase().trim()

  // Check for exact match first
  for (const resourceLoc of resourceLocations) {
    const normalizedResource = resourceLoc.toLowerCase().trim()

    // Exact match
    if (normalizedUser.includes(normalizedResource) ||
        normalizedResource.includes(normalizedUser)) {
      return { matches: true, distance: DISTANCE_TIERS.EXACT }
    }
  }

  // Check for metro area proximity
  const userMetro = getMetroArea(normalizedUser)

  for (const resourceLoc of resourceLocations) {
    const resourceMetro = getMetroArea(resourceLoc.toLowerCase())

    // Same metro area (e.g., San Jose user → San Francisco resource)
    if (userMetro && resourceMetro && userMetro === resourceMetro) {
      return {
        matches: true,
        distance: DISTANCE_TIERS.NEARBY,
        reason: `This resource is in ${resourceLoc} (nearby in ${userMetro} area)`
      }
    }
  }

  // Check for statewide resources
  for (const resourceLoc of resourceLocations) {
    if (resourceLoc.toLowerCase().includes('california') ||
        resourceLoc.toLowerCase() === 'statewide') {
      return {
        matches: true,
        distance: DISTANCE_TIERS.STATEWIDE,
        reason: 'This resource serves all of California'
      }
    }
  }

  // No match found
  return {
    matches: false,
    distance: Infinity,
    reason: `This resource is only available in: ${resourceLocations.join(', ')}`
  }
}

/**
 * Get the metro area for a given city
 */
function getMetroArea(city: string): string | null {
  if (bayAreaCities.some(c => city.includes(c))) {
    return 'Bay Area'
  }
  if (losAngelesCities.some(c => city.includes(c))) {
    return 'Los Angeles'
  }
  if (sanDiegoCities.some(c => city.includes(c))) {
    return 'San Diego'
  }
  if (sacramentoCities.some(c => city.includes(c))) {
    return 'Sacramento'
  }
  return null
}

/**
 * Sort resources by distance from user's location
 */
export function sortByProximity(
  resources: Array<{ resource: any; distance: number }>
): Array<{ resource: any; distance: number }> {
  return resources.sort((a, b) => {
    // First sort by distance
    if (a.distance !== b.distance) {
      return a.distance - b.distance
    }

    // Then by urgency
    if (a.resource.urgent && !b.resource.urgent) return -1
    if (!a.resource.urgent && b.resource.urgent) return 1

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const aPriority = priorityOrder[a.resource.priority || 'low']
    const bPriority = priorityOrder[b.resource.priority || 'low']

    return aPriority - bPriority
  })
}

/**
 * Get a human-readable distance description
 */
export function getDistanceLabel(distance: number): string {
  switch (distance) {
    case DISTANCE_TIERS.EXACT:
      return 'In your area'
    case DISTANCE_TIERS.NEARBY:
      return 'Nearby'
    case DISTANCE_TIERS.REGIONAL:
      return 'Regional'
    case DISTANCE_TIERS.STATEWIDE:
      return 'Statewide'
    default:
      return 'Other location'
  }
}
