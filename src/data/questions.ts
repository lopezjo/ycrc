import { Question } from '../types'
import { getLanguage } from '../i18n/i18n'
import { translations } from '../i18n/translations'

function getQuestionFlow(): Question[] {
  const lang = getLanguage()
  const t = translations[lang].questions

  return [
    {
      id: 'initial',
      text: t.initial.text,
      context: t.initial.context,
      youthFriendly: t.initial.youthFriendly,
      field: 'situation',
      type: 'text',
      required: false,
      skippable: true,
      sensitive: true,
      suggestedResponses: [
        'Need a safe place to sleep',
        'I am homeless',
        'Looking for food',
        "Don't feel safe where I am",
        'Need help now'
      ]
    },
    {
      id: 'age',
      text: t.age.text,
      context: t.age.context,
      youthFriendly: t.age.youthFriendly,
      field: 'age',
      type: 'number',
      required: true,
      skippable: false
    },
    {
      id: 'location',
      text: t.location.text,
      context: t.location.context,
      youthFriendly: t.location.youthFriendly,
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
    {
      id: 'duration',
      text: t.duration.text,
      context: t.duration.context,
      youthFriendly: t.duration.youthFriendly,
      field: 'duration',
      type: 'multiple',
      options: t.duration.options,
      required: false,
      skippable: true,
      sensitive: true
    },
    {
      id: 'hasId',
      text: t.hasId.text,
      context: t.hasId.context,
      youthFriendly: t.hasId.youthFriendly,
      field: 'hasId',
      type: 'yesno',
      required: false,
      skippable: true
    },
    {
      id: 'inSchool',
      text: t.inSchool.text,
      context: t.inSchool.context,
      youthFriendly: t.inSchool.youthFriendly,
      field: 'inSchool',
      type: 'yesno',
      required: false,
      skippable: true
    },
    {
      id: 'hasIncome',
      text: t.hasIncome.text,
      context: t.hasIncome.context,
      youthFriendly: t.hasIncome.youthFriendly,
      field: 'hasIncome',
      type: 'yesno',
      required: false,
      skippable: true,
      sensitive: true
    }
  ]
}

export const questionFlow = getQuestionFlow()
