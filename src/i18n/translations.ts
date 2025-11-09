export interface Translations {
  // App
  appTitle: string
  appSubtitle: string
  
  // Consent
  consentTitle: string
  consentIntro: string
  consentWhatWeCollect: string
  consentWhyWeCollect: string
  consentHowWeUse: string
  consentYourRights: string
  consentAccept: string
  consentDecline: string
  
  // Support Resources
  supportTitle: string
  supportIntro: string
  supportRemember: string
  
  // Questions
  welcomeMessage: string
  questions: {
    initial: {
      text: string
      context: string
      youthFriendly: string
      options: string[]
    }
    age: {
      text: string
      context: string
      youthFriendly: string
    }
    location: {
      text: string
      context: string
      youthFriendly: string
    }
    duration: {
      text: string
      context: string
      youthFriendly: string
      options: string[]
    }
    hasId: {
      text: string
      context: string
      youthFriendly: string
    }
    inSchool: {
      text: string
      context: string
      youthFriendly: string
    }
    hasIncome: {
      text: string
      context: string
      youthFriendly: string
    }
    // Housing-specific questions
    housingDuration: {
      text: string
      context: string
      youthFriendly: string
      options: string[]
    }
    safePlaceTonight: {
      text: string
      context: string
      youthFriendly: string
    }
    // Food-specific questions
    foodFrequency: {
      text: string
      context: string
      youthFriendly: string
      options: string[]
    }
    // Mental health questions
    crisisLevel: {
      text: string
      context: string
      youthFriendly: string
    }
    // Education questions
    schoolType: {
      text: string
      context: string
      youthFriendly: string
      options: string[]
    }
  }
  
  // UI
  skip: string
  skipQuestion: string
  send: string
  edit: string
  exitEdit: string
  clear: string
  needSupport: string
  processing: string
  typeResponse: string
  yes: string
  no: string
  yesNo: string
  enterNumber: string
  canSkip: string
  
  // Resource Display
  resourcesFound: string
  urgentResources: string
  highPriorityResources: string
  rememberMultiple: string
  resourcesMightBeAvailable: string
  needMoreInfo: string
  resourcesNotAvailable: string
  showIneligible: string
  resourcesEligible: string
  resourcesPotentiallyEligible: string
  resourcesIneligible: string
  
  // Resource Cards
  hours: string
  phone: string
  email: string
  website: string
  address: string
  whyNotAvailable: string
  toCheckEligibility: string
  editAnswers: string
  exportData: string
  resourcesComplete: string
  
  // Progress
  questionOf: string
  clickToEdit: string
  
  
  // Clear data
  clearDataConfirm: string
}

export const translations = {
  en: {
    appTitle: 'Youth Resource Navigator',
    appSubtitle: 'Tell us about your situation, and we\'ll help you find the right resources',
    
    consentTitle: 'Your Privacy Matters',
    consentIntro: 'Before we start, here\'s what you need to know about how we use your information:',
    consentWhatWeCollect: 'What We Collect',
    consentWhyWeCollect: 'Why We Ask',
    consentHowWeUse: 'How We Use Your Information',
    consentYourRights: 'Your Rights',
    consentAccept: 'I Understand, Let\'s Continue',
    consentDecline: 'I Need More Time',
    
    supportTitle: 'Need Support Right Now?',
    supportIntro: 'If you\'re in crisis or need immediate help, here are resources available 24/7:',
    supportRemember: 'Remember: It\'s okay to take a break. You can come back anytime when you\'re ready. Your well-being comes first.',
    
    welcomeMessage: 'Hey there. I\'m here to help you find resources that might work for you. Can you tell me a bit about what\'s going on right now? (For example: sleeping in your car, need a place to stay, looking for food, etc.)',
    
    questions: {
      initial: {
        text: 'Hey there. I\'m here to help you find resources that might work for you. What\'s your main situation right now?',
        context: 'I\'m asking this so I can understand what you\'re dealing with and find the best resources for your situation. You can share as much or as little as you\'re comfortable with. I\'ll help you find multiple types of resources - not just one thing.',
        youthFriendly: 'This helps me understand what you need so I can find the right help for you. I\'ll look for housing, food, transportation, and other resources all at once.',
        options: [
          'Need shelter/housing',
          'Need food',
          'Mental health support', 
          'Education help',
          'Job training/employment',
          'Other/Multiple needs'
        ]
      },
      age: {
        text: 'How old are you? (You can skip this if you prefer)',
        context: 'Different programs have different age requirements. For example, some programs are for people 18-24, while others are for teens. Knowing your age helps me show you programs you can actually use.',
        youthFriendly: 'This helps me find programs that match your age group.'
      },
      location: {
        text: 'What city or area are you in right now?',
        context: 'Resources are different depending on where you are. Some programs are only in certain cities or neighborhoods. This helps me find what\'s actually available near you.',
        youthFriendly: 'This helps me find resources close to where you are.'
      },
      duration: {
        text: 'How long have you been dealing with this?',
        context: 'Some programs are for emergencies (like if you need a place to stay tonight), while others are for longer-term help (like finding stable housing). This helps me figure out what kind of help you need most right now.',
        youthFriendly: 'This helps me understand if you need immediate help or longer-term support.',
        options: [
          'Just started - less than a week',
          'A few weeks (1-4 weeks)',
          'A few months (1-6 months)',
          'A long time - more than 6 months'
        ]
      },
      hasId: {
        text: 'Do you have an ID right now? Like a driver\'s license, state ID, or passport?',
        context: 'Some programs need to see an ID to sign you up. But don\'t worry - if you don\'t have one, I can also help you find places that can help you get an ID. This is totally normal and there\'s help available.',
        youthFriendly: 'Some programs need ID, but we can help you get one if you don\'t have it.'
      },
      inSchool: {
        text: 'Are you going to school right now, or working on a GED?',
        context: 'There are special programs just for students, and some resources can help with school stuff like supplies, transportation, or tutoring. Even if you\'re not in school, there are programs that can help you get back into school if you want.',
        youthFriendly: 'There are special resources for students, and help to get back into school if you want.'
      },
      hasIncome: {
        text: 'Do you have any money coming in right now? Like from a job, benefits, or family helping out?',
        context: 'This helps me understand your situation better. If you don\'t have income, I can find programs that help with jobs, job training, or financial assistance. If you do have some income, I can find programs that work with your budget.',
        youthFriendly: 'This helps me find the right financial help or job programs for you.'
      },
      // Housing-specific questions
      housingDuration: {
        text: 'How long have you needed housing?',
        context: 'This helps me understand if you need emergency shelter tonight or longer-term housing support. Different programs help with different timeframes.',
        youthFriendly: 'This helps me find the right housing help for you.',
        options: [
          'Tonight only',
          'A few days',
          'Weeks',
          'Months'
        ]
      },
      safePlaceTonight: {
        text: 'Do you have somewhere safe to stay tonight?',
        context: 'If you don\'t have a safe place tonight, I\'ll prioritize emergency shelter resources. If you do, I can focus on longer-term housing options.',
        youthFriendly: 'This helps me know if you need emergency help tonight or can focus on other housing options.'
      },
      // Food-specific questions
      foodFrequency: {
        text: 'How often do you need food assistance?',
        context: 'Some programs provide meals daily, others give groceries weekly, and some help with emergency food. This helps me find what matches your needs.',
        youthFriendly: 'This helps me find food programs that work for your schedule.',
        options: [
          'Right now',
          'Daily',
          'Weekly',
          'Monthly'
        ]
      },
      // Mental health questions
      crisisLevel: {
        text: 'Is this an emergency situation where you need help right away?',
        context: 'If you\'re in crisis, I\'ll connect you with 24/7 support immediately. If not, I can help you find ongoing mental health resources.',
        youthFriendly: 'This helps me know if you need emergency help or ongoing support.'
      },
      // Education questions
      schoolType: {
        text: 'What type of school are you in?',
        context: 'Different schools have different support programs available. This helps me find resources specific to your education situation.',
        youthFriendly: 'This helps me find school-specific support for you.',
        options: [
          'High school',
          'College',
          'Trade school',
          'GED program'
        ]
      }
    },
    
    skip: 'Skip',
    skipQuestion: 'Skip this question',
    send: 'Send',
    edit: '✏️ Edit',
    exitEdit: '✏️ Exit Edit',
    clear: '🗑️ Clear',
    needSupport: '💙 Need Support?',
    processing: 'Processing...',
    typeResponse: 'Type your response...',
    yes: 'Yes',
    no: 'No',
    yesNo: '(Yes/No - or you can skip)',
    enterNumber: '(Enter a number - or skip)',
    canSkip: '(You can skip this if you prefer)',
    
    resourcesFound: 'Based on what you\'ve shared, I found {count} resource{plural} that you\'re eligible for.',
    urgentResources: '{count} urgent resource{plural} - These are available right now if you need immediate help.',
    highPriorityResources: '{count} high-priority resource{plural} - These are especially relevant to your situation.',
    rememberMultiple: 'Remember: You can access multiple types of help at once. For example, if you need housing, you might also qualify for food assistance, transportation help, and education support.',
    resourcesMightBeAvailable: '{count} resource{plural} might be available - I need a bit more information to know for sure.',
    needMoreInfo: 'I need a bit more information to know if you qualify for these. You can go back and answer more questions if you want to check.',
    resourcesNotAvailable: 'These resources don\'t match your current situation, but it\'s helpful to know what\'s out there. Your situation might change, or you might want to share this with someone else who could benefit.',
    showIneligible: 'Show resources you\'re not eligible for',
    resourcesEligible: 'Resources You\'re Eligible For ({count})',
    resourcesPotentiallyEligible: 'Resources That Might Be Available ({count})',
    resourcesIneligible: 'Resources Not Available Right Now ({count})',
    
    hours: 'Hours:',
    phone: 'Phone:',
    email: 'Email:',
    website: 'Website:',
    address: 'Address:',
    whyNotAvailable: 'Why this isn\'t available:',
    toCheckEligibility: 'To check eligibility, I need:',
    editAnswers: 'Edit My Answers',
    exportData: 'Export Data',
    resourcesComplete: 'You\'ve completed the questions! Here are your matched resources.',
    
    questionOf: 'Question {current} of {total}',
    clickToEdit: 'Click on any answered question below to edit it',
    
    
    clearDataConfirm: 'Are you sure you want to clear all your data? This cannot be undone.'
  } as Translations,
  
  es: {
    appTitle: 'Navegador de Recursos para Jóvenes',
    appSubtitle: 'Cuéntanos sobre tu situación y te ayudaremos a encontrar los recursos adecuados',
    
    consentTitle: 'Tu Privacidad Importa',
    consentIntro: 'Antes de comenzar, esto es lo que necesitas saber sobre cómo usamos tu información:',
    consentWhatWeCollect: 'Qué Recopilamos',
    consentWhyWeCollect: 'Por Qué Preguntamos',
    consentHowWeUse: 'Cómo Usamos Tu Información',
    consentYourRights: 'Tus Derechos',
    consentAccept: 'Entiendo, Continuemos',
    consentDecline: 'Necesito Más Tiempo',
    
    supportTitle: '¿Necesitas Apoyo Ahora Mismo?',
    supportIntro: 'Si estás en crisis o necesitas ayuda inmediata, aquí hay recursos disponibles las 24 horas:',
    supportRemember: 'Recuerda: Está bien tomar un descanso. Puedes pausar en cualquier momento y volver cuando estés listo. Tu bienestar es lo primero.',
    
    welcomeMessage: 'Hola. Estoy aquí para ayudarte a encontrar recursos que puedan funcionar para ti. ¿Puedes contarme un poco sobre lo que está pasando ahora mismo? (Por ejemplo: durmiendo en tu auto, necesitas un lugar para quedarte, buscando comida, etc.)',
    
    questions: {
      initial: {
        text: 'Hola. Estoy aquí para ayudarte a encontrar recursos que puedan funcionar para ti. ¿Cuál es tu situación principal ahora mismo?',
        context: 'Pregunto esto para poder entender lo que estás enfrentando y encontrar los mejores recursos para tu situación. Puedes compartir tanto o tan poco como te sientas cómodo. Te ayudaré a encontrar múltiples tipos de recursos, no solo una cosa.',
        youthFriendly: 'Esto me ayuda a entender lo que necesitas para poder encontrar la ayuda adecuada para ti. Buscaré vivienda, comida, transporte y otros recursos a la vez.',
        options: [
          'Necesito refugio/vivienda',
          'Necesito comida',
          'Apoyo de salud mental',
          'Ayuda educativa',
          'Capacitación laboral/empleo',
          'Otras/Múltiples necesidades'
        ]
      },
      age: {
        text: '¿Cuántos años tienes? (Puedes omitir esto si prefieres)',
        context: 'Diferentes programas tienen diferentes requisitos de edad. Por ejemplo, algunos programas son para personas de 18-24 años, mientras que otros son para adolescentes. Saber tu edad me ayuda a mostrarte programas que realmente puedes usar.',
        youthFriendly: 'Esto me ayuda a encontrar programas que coincidan con tu grupo de edad.'
      },
      location: {
        text: '¿En qué ciudad o área estás ahora mismo?',
        context: 'Los recursos son diferentes dependiendo de dónde estés. Algunos programas solo están en ciertas ciudades o vecindarios. Esto me ayuda a encontrar lo que realmente está disponible cerca de ti.',
        youthFriendly: 'Esto me ayuda a encontrar recursos cerca de donde estás.'
      },
      duration: {
        text: '¿Cuánto tiempo has estado lidiando con esto?',
        context: 'Algunos programas son para emergencias (como si necesitas un lugar para quedarte esta noche), mientras que otros son para ayuda a largo plazo (como encontrar vivienda estable). Esto me ayuda a determinar qué tipo de ayuda necesitas más ahora mismo.',
        youthFriendly: 'Esto me ayuda a entender si necesitas ayuda inmediata o apoyo a largo plazo.',
        options: [
          'Acaba de empezar - menos de una semana',
          'Unas semanas (1-4 semanas)',
          'Unos meses (1-6 meses)',
          'Mucho tiempo - más de 6 meses'
        ]
      },
      hasId: {
        text: '¿Tienes una identificación ahora mismo? ¿Como una licencia de conducir, identificación estatal o pasaporte?',
        context: 'Algunos programas necesitan ver una identificación para inscribirte. Pero no te preocupes, si no tienes una, también puedo ayudarte a encontrar lugares que pueden ayudarte a obtener una identificación. Esto es totalmente normal y hay ayuda disponible.',
        youthFriendly: 'Algunos programas necesitan identificación, pero podemos ayudarte a obtener una si no la tienes.'
      },
      inSchool: {
        text: '¿Estás yendo a la escuela ahora mismo o trabajando en un GED?',
        context: 'Hay programas especiales solo para estudiantes, y algunos recursos pueden ayudar con cosas de la escuela como suministros, transporte o tutoría. Incluso si no estás en la escuela, hay programas que pueden ayudarte a volver a la escuela si quieres.',
        youthFriendly: 'Hay recursos especiales para estudiantes y ayuda para volver a la escuela si quieres.'
      },
      hasIncome: {
        text: '¿Tienes algún dinero entrando ahora mismo? ¿Como de un trabajo, beneficios o familia que ayuda?',
        context: 'Esto me ayuda a entender mejor tu situación. Si no tienes ingresos, puedo encontrar programas que ayudan con trabajos, capacitación laboral o asistencia financiera. Si tienes algunos ingresos, puedo encontrar programas que funcionan con tu presupuesto.',
        youthFriendly: 'Esto me ayuda a encontrar la ayuda financiera adecuada o programas de trabajo para ti.'
      },
      // Housing-specific questions
      housingDuration: {
        text: '¿Cuánto tiempo has necesitado vivienda?',
        context: 'Esto me ayuda a entender si necesitas refugio de emergencia esta noche o apoyo de vivienda a largo plazo. Diferentes programas ayudan con diferentes marcos de tiempo.',
        youthFriendly: 'Esto me ayuda a encontrar la ayuda de vivienda adecuada para ti.',
        options: [
          'Solo esta noche',
          'Unos días',
          'Semanas',
          'Meses'
        ]
      },
      safePlaceTonight: {
        text: '¿Tienes algún lugar seguro donde quedarte esta noche?',
        context: 'Si no tienes un lugar seguro esta noche, priorizaré los recursos de refugio de emergencia. Si lo tienes, puedo enfocarme en opciones de vivienda a largo plazo.',
        youthFriendly: 'Esto me ayuda a saber si necesitas ayuda de emergencia esta noche o podemos enfocarnos en otras opciones de vivienda.'
      },
      // Food-specific questions
      foodFrequency: {
        text: '¿Con qué frecuencia necesitas asistencia alimentaria?',
        context: 'Algunos programas proporcionan comidas diariamente, otros dan comestibles semanalmente, y algunos ayudan con comida de emergencia. Esto me ayuda a encontrar lo que coincida con tus necesidades.',
        youthFriendly: 'Esto me ayuda a encontrar programas de comida que funcionen con tu horario.',
        options: [
          'Ahora mismo',
          'Diariamente',
          'Semanalmente',
          'Mensualmente'
        ]
      },
      // Mental health questions
      crisisLevel: {
        text: '¿Es esta una situación de emergencia donde necesitas ayuda inmediatamente?',
        context: 'Si estás en crisis, te conectaré con apoyo 24/7 inmediatamente. Si no, puedo ayudarte a encontrar recursos de salud mental continua.',
        youthFriendly: 'Esto me ayuda a saber si necesitas ayuda de emergencia o apoyo continuo.'
      },
      // Education questions
      schoolType: {
        text: '¿En qué tipo de escuela estás?',
        context: 'Diferentes escuelas tienen diferentes programas de apoyo disponibles. Esto me ayuda a encontrar recursos específicos para tu situación educativa.',
        youthFriendly: 'Esto me ayuda a encontrar apoyo específico de la escuela para ti.',
        options: [
          'Escuela secundaria',
          'Universidad',
          'Escuela técnica',
          'Programa GED'
        ]
      }
    },
    
    skip: 'Omitir',
    skipQuestion: 'Omitir esta pregunta',
    send: 'Enviar',
    edit: '✏️ Editar',
    exitEdit: '✏️ Salir de Editar',
    clear: '🗑️ Limpiar',
    needSupport: '💙 ¿Necesitas Apoyo?',
    processing: 'Procesando...',
    typeResponse: 'Escribe tu respuesta...',
    yes: 'Sí',
    no: 'No',
    yesNo: '(Sí/No - o puedes omitir)',
    enterNumber: '(Ingresa un número - o omite)',
    canSkip: '(Puedes omitir esto si prefieres)',
    
    resourcesFound: 'Basado en lo que has compartido, encontré {count} recurso{plural} para el cual eres elegible.',
    urgentResources: '{count} recurso{plural} urgente{plural} - Estos están disponibles ahora mismo si necesitas ayuda inmediata.',
    highPriorityResources: '{count} recurso{plural} de alta prioridad - Estos son especialmente relevantes para tu situación.',
    rememberMultiple: 'Recuerda: Puedes acceder a múltiples tipos de ayuda a la vez. Por ejemplo, si necesitas vivienda, también podrías calificar para asistencia alimentaria, ayuda de transporte y apoyo educativo.',
    resourcesMightBeAvailable: '{count} recurso{plural} podría{plural} estar disponible{plural} - Necesito un poco más de información para estar seguro.',
    needMoreInfo: 'Necesito un poco más de información para saber si calificas para estos. Puedes volver y responder más preguntas si quieres verificar.',
    resourcesNotAvailable: 'Estos recursos no coinciden con tu situación actual, pero es útil saber qué hay disponible. Tu situación podría cambiar, o podrías querer compartir esto con alguien más que podría beneficiarse.',
    showIneligible: 'Mostrar recursos para los que no eres elegible',
    resourcesEligible: 'Recursos para los que Eres Elegible ({count})',
    resourcesPotentiallyEligible: 'Recursos que Podrían Estar Disponibles ({count})',
    resourcesIneligible: 'Recursos No Disponibles Ahora Mismo ({count})',
    
    hours: 'Horas:',
    phone: 'Teléfono:',
    email: 'Correo:',
    website: 'Sitio web:',
    address: 'Dirección:',
    whyNotAvailable: 'Por qué esto no está disponible:',
    toCheckEligibility: 'Para verificar la elegibilidad, necesito:',
    editAnswers: 'Editar Mis Respuestas',
    exportData: 'Exportar Datos',
    resourcesComplete: '¡Has completado las preguntas! Aquí están tus recursos coincidentes.',
    
    questionOf: 'Pregunta {current} de {total}',
    clickToEdit: 'Haz clic en cualquier pregunta respondida a continuación para editarla',
    
    clearDataConfirm: '¿Estás seguro de que quieres borrar todos tus datos? Esto no se puede deshacer.'
  } as Translations
}

export type Language = 'en' | 'es'

