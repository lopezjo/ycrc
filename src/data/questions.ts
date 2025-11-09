import { Question } from '../types'
import { getLanguage } from '../i18n/i18n'
import { translations } from '../i18n/translations'

function getQuestionFlow(): Question[] {
  const lang = getLanguage()
  const t = translations[lang]

  return [
    {
      id: 'initial',
      text: t.questions.initial.text,
      context: t.questions.initial.context,
      youthFriendly: t.questions.initial.youthFriendly,
      field: 'situation',
      type: 'multiple',
      options: t.questions.initial.options,
      required: false,
      skippable: true,
      sensitive: true
    },
    {
      id: 'age',
      text: t.questions.age.text,
      context: t.questions.age.context,
      youthFriendly: t.questions.age.youthFriendly,
      field: 'age',
      type: 'number',
      required: true,
      skippable: false
    },
    
    // Housing-specific questions
    {
      id: 'housingDuration',
      text: t.questions.housingDuration.text,
      context: t.questions.housingDuration.context,
      youthFriendly: t.questions.housingDuration.youthFriendly,
      field: 'housingDuration',
      type: 'multiple',
      options: t.questions.housingDuration.options,
      required: false,
      skippable: true,
      sensitive: true,
      showIf: [{ field: 'situation', operator: 'equals', value: 'Need shelter/housing' }]
    },
    {
      id: 'safePlaceTonight',
      text: t.questions.safePlaceTonight.text,
      context: t.questions.safePlaceTonight.context,
      youthFriendly: t.questions.safePlaceTonight.youthFriendly,
      field: 'safePlaceTonight',
      type: 'yesno',
      required: false,
      skippable: true,
      showIf: [{ field: 'situation', operator: 'equals', value: 'Need shelter/housing' }]
    },
    
    // Food-specific questions
    {
      id: 'foodFrequency',
      text: t.questions.foodFrequency.text,
      context: t.questions.foodFrequency.context,
      youthFriendly: t.questions.foodFrequency.youthFriendly,
      field: 'foodFrequency',
      type: 'multiple',
      options: t.questions.foodFrequency.options,
      required: false,
      skippable: true,
      showIf: [{ field: 'situation', operator: 'equals', value: 'Need food' }]
    },
    
    // Mental health path
    {
      id: 'crisisLevel',
      text: t.questions.crisisLevel.text,
      context: t.questions.crisisLevel.context,
      youthFriendly: t.questions.crisisLevel.youthFriendly,
      field: 'crisisLevel',
      type: 'yesno',
      required: false,
      skippable: true,
      showIf: [{ field: 'situation', operator: 'equals', value: 'Mental health support' }]
    },
    
    // School questions - only for youth who might be students  
    {
      id: 'inSchool',
      text: t.questions.inSchool.text,
      context: t.questions.inSchool.context,
      youthFriendly: t.questions.inSchool.youthFriendly,
      field: 'inSchool',
      type: 'yesno',
      required: false,
      skippable: true,
      showIf: [{ field: 'age', operator: 'less_than', value: 25 }]
    },
    {
      id: 'schoolType',
      text: t.questions.schoolType.text,
      context: t.questions.schoolType.context,
      youthFriendly: t.questions.schoolType.youthFriendly,
      field: 'schoolType',
      type: 'multiple',
      options: t.questions.schoolType.options,
      required: false,
      skippable: true,
      showIf: [{ field: 'inSchool', operator: 'equals', value: true }]
    },
    
    // Location - asked for most situations
    {
      id: 'location',
      text: t.questions.location.text,
      context: t.questions.location.context,
      youthFriendly: t.questions.location.youthFriendly,
      field: 'location',
      type: 'text',
      required: false,
      skippable: true,
      suggestedResponses: [
        'San Francisco',
        'Los Angeles',
        'Fresno',
        'Not sure'
      ]
    },
    
    // General support questions - asked when relevant
    {
      id: 'hasId',
      text: t.questions.hasId.text,
      context: t.questions.hasId.context,
      youthFriendly: t.questions.hasId.youthFriendly,
      field: 'hasId',
      type: 'yesno',
      required: false,
      skippable: true,
      // Skip ID questions for crisis situations to reduce cognitive load
      skipIf: [{ field: 'crisisLevel', operator: 'equals', value: true }]
    },
    {
      id: 'hasIncome',
      text: t.questions.hasIncome.text,
      context: t.questions.hasIncome.context,
      youthFriendly: t.questions.hasIncome.youthFriendly,
      field: 'hasIncome',
      type: 'yesno',
      required: false,
      skippable: true,
      sensitive: true,
      // Skip income questions for crisis situations
      skipIf: [{ field: 'crisisLevel', operator: 'equals', value: true }]
    },
    
    // Legacy duration question - now used for general situations
    {
      id: 'duration',
      text: t.questions.duration.text,
      context: t.questions.duration.context,
      youthFriendly: t.questions.duration.youthFriendly,
      field: 'duration',
      type: 'multiple',
      options: t.questions.duration.options,
      required: false,
      skippable: true,
      sensitive: true,
      // Only ask general duration if not housing-specific
      skipIf: [{ field: 'situation', operator: 'equals', value: 'Need shelter/housing' }]
    }
  ]
}

export const questionFlow = getQuestionFlow()
