import { ConsentInfo } from '../types'
import { getLanguage } from '../i18n/i18n'
import { translations } from '../i18n/translations'

function getConsentInfo(): ConsentInfo {
  const lang = getLanguage()
  const t = translations[lang]

  return {
    whatWeCollect: lang === 'es' 
      ? [
          'Tu edad (para encontrar programas apropiados para tu edad)',
          'Tu ubicación (para encontrar recursos cercanos)',
          'Tu situación (para entender lo que necesitas)',
          'Si tienes identificación, ingresos o estás en la escuela (para elegibilidad)'
        ]
      : [
          'Your age (to find age-appropriate programs)',
          'Your location (to find nearby resources)',
          'Your situation (to understand what you need)',
          'Whether you have ID, income, or are in school (for eligibility)'
        ],
    whyWeCollect: lang === 'es'
      ? 'Solo preguntamos información que nos ayuda a encontrar recursos para los que eres elegible. Puedes omitir cualquier pregunta con la que no te sientas cómodo respondiendo.'
      : 'We only ask for information that helps us find resources you\'re eligible for. You can skip any question you\'re not comfortable answering.',
    howWeUse: lang === 'es'
      ? 'Tu información se mantiene privada y solo se usa para hacerte coincidir con recursos. No la compartimos con nadie sin tu permiso.'
      : 'Your information stays private and is only used to match you with resources. We don\'t share it with anyone without your permission.',
    yourRights: lang === 'es'
      ? [
          'Puedes omitir cualquier pregunta',
          'Puedes pausar y volver más tarde',
          'Puedes editar tus respuestas en cualquier momento',
          'Puedes eliminar tu información',
          'Tú controlas qué información se comparte'
        ]
      : [
          'You can skip any question',
          'You can pause and come back later',
          'You can edit your answers anytime',
          'You can delete your information',
          'You control what information is shared'
        ]
  }
}

export const consentInfo = getConsentInfo()
