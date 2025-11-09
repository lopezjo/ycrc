import { UserResponse, Resource } from '../types'
import { questionFlow } from '../data/questions'

export interface ProviderDataExport {
  // Metadata
  exportDate: string
  exportVersion: string
  youthId?: string // Optional anonymized ID
  
  // Basic Demographics
  demographics: {
    age?: number
    location?: string
    situation?: string
    durationOfSituation?: string
  }
  
  // Eligibility Information
  eligibility: {
    hasId?: boolean
    hasIncome?: boolean
    inSchool?: boolean
  }
  
  // Resource-Specific Responses (if they went through follow-up questions)
  resourceAssessments?: {
    [resourceId: string]: {
      resourceName: string
      barriers?: string[]
      responses: { [questionId: string]: any }
      assessedDate: string
    }
  }
  
  // Selected Resources
  selectedResources?: Array<{
    resourceId: string
    resourceName: string
    category: string
    contact: {
      phone?: string
      email?: string
      address?: string
    }
  }>
  
  // Privacy & Consent
  consent: {
    dataShared: boolean
    shareWithProviders: boolean
    exportDate: string
  }
}

export function generateProviderExport(
  responses: UserResponse,
  selectedResources?: Resource[],
  resourceAssessments?: { [resourceId: string]: { [questionId: string]: any } }
): ProviderDataExport {
  const exportData: ProviderDataExport = {
    exportDate: new Date().toISOString(),
    exportVersion: '1.0',
    
    demographics: {
      age: responses.age ? Number(responses.age) : undefined,
      location: responses.location ? String(responses.location) : undefined,
      situation: responses.situation ? String(responses.situation) : undefined,
      durationOfSituation: responses.duration ? String(responses.duration) : undefined
    },
    
    eligibility: {
      hasId: responses.hasId !== undefined ? (responses.hasId === true || responses.hasId === 'yes') : undefined,
      hasIncome: responses.hasIncome !== undefined ? (responses.hasIncome === true || responses.hasIncome === 'yes') : undefined,
      inSchool: responses.inSchool !== undefined ? (responses.inSchool === true || responses.inSchool === 'yes') : undefined
    },
    
    consent: {
      dataShared: true,
      shareWithProviders: true,
      exportDate: new Date().toISOString()
    }
  }
  
  // Add selected resources if provided
  if (selectedResources && selectedResources.length > 0) {
    exportData.selectedResources = selectedResources.map(resource => ({
      resourceId: resource.id,
      resourceName: resource.name,
      category: resource.category,
      contact: {
        phone: resource.contact.phone,
        email: resource.contact.email,
        address: resource.contact.address
      }
    }))
  }
  
  // Add resource-specific assessments if provided
  if (resourceAssessments) {
    exportData.resourceAssessments = {}
    Object.keys(resourceAssessments).forEach(resourceId => {
      const resource = selectedResources?.find(r => r.id === resourceId)
      if (resource) {
        exportData.resourceAssessments![resourceId] = {
          resourceName: resource.name,
          responses: resourceAssessments[resourceId],
          assessedDate: new Date().toISOString()
        }
      }
    })
  }
  
  return exportData
}

export function downloadJSON(data: ProviderDataExport, filename: string = 'youth-resource-data.json'): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// HMIS-compatible format (simplified version)
export interface HMISExport {
  PersonalInformation: {
    Name?: string // Optional - privacy first
    DateOfBirth?: string
    Age?: number
    Gender?: string
  }
  ResidencePrior: {
    LengthOfStay?: string
    LivingSituation?: string
  }
  DisablingCondition?: boolean
  ProjectEntry: {
    EntryDate: string
    HouseholdID?: string
  }
  IncomeAndSources: {
    IncomeFromAnySource?: boolean
    TotalMonthlyIncome?: number
  }
  NonCashBenefits?: {
    SNAP?: boolean
    WIC?: boolean
    Medicaid?: boolean
  }
  HealthInsurance?: {
    HasHealthInsurance?: boolean
    InsuranceType?: string
  }
  DomesticViolence?: {
    CurrentlyFleeing?: boolean
  }
}

export function generateHMISFormat(responses: UserResponse): HMISExport {
  return {
    PersonalInformation: {
      Age: responses.age ? Number(responses.age) : undefined
    },
    ResidencePrior: {
      LengthOfStay: responses.duration ? String(responses.duration) : undefined,
      LivingSituation: responses.situation ? String(responses.situation) : undefined
    },
    ProjectEntry: {
      EntryDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    },
    IncomeAndSources: {
      IncomeFromAnySource: responses.hasIncome !== undefined 
        ? (responses.hasIncome === true || responses.hasIncome === 'yes') 
        : undefined
    }
  }
}

