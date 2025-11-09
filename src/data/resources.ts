import { Resource } from '../types'

export const resources: Resource[] = [
  {
    id: 'shelter-1-verified',
    name: {
      en: 'HUCKLEBERRY HOUSE CRISIS SHELTER',
      es: 'REFUGIO DE CRISIS HUCKLEBERRY HOUSE'
    },
    description: {
      en: 'Provides emergency shelter for runaway youth and youth experiencing homelessness. \nOffers case management, crisis intervention, and resolution services.',
      es: 'Proporciona refugio de emergencia para jóvenes fugitivos y jóvenes sin hogar. \nOfrece gestión de casos, intervención en crisis y servicios de resolución.'
    },
    category: ['Housing', 'Crisis Support'],
    eligibility: {
      age: { min: 12, max: 18 },
      situation: ['homeless']
    },
    contact: {
      phone: ['(415) 621-2929', '(415) 668-2622', 'TTY: (800) 735-2929'],
      address: '1292 Page Street San Francisco, CA 94117'
    },
    hours: {
      en: '24/7 for immediate needs and intake support. Mon-Fri 8am - 5pm',
      es: '24/7 para necesidades inmediatas y apoyo inicial. Lunes a Viernes 8am - 5pm'
    },
    notes: 'Call for appointment. Provides meals and basic necessities.',
    urgent: true,
    priority: 'high',
    lgbtqAffirming: true,
    tags: ['24/7', 'No ID Required', 'LGBTQ+ Safe'],
    whatItOffers: [
      'Lugar seguro para dormir / Safe place to sleep',
      'Tres comidas al día / Three meals a day',
      'Duchas e instalaciones de lavandería / Showers and laundry facilities',
      'Artículos básicos de higiene / Basic hygiene supplies',
      'Apoyo de manejo de casos / Case management support',
      'Servicios disponibles en español / Spanish language services available',
      'No se requiere identificación / No ID required for intake',
      'Ambiente afirmativo LGBTQ+ / LGBTQ+ affirming environment'
    ],
    commonBarriers: [
      'Transportation to the shelter',
      'Limited space'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: {
          en: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
          es: '¿Tienes cómo llegar al refugio? (Autobús, transporte, distancia caminando, etc.)'
        },
        context: {
          en: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
          es: 'Saber cómo llegar allí nos ayuda a conectarte con otros recursos o a determinar si esto es realista para ti en este momento.'
        },
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      },
      {
        id: 'space-barrier',
        text: 'The shelter can tell you if they have space when you call. Do you want to check if there is space available?',
        context: {
          en: 'Huckleberry house may have limited beds. If there is no space, we can look for other options.',
          es: 'La casa Huckleberry puede tener camas limitadas. Si no hay espacio, podemos buscar otras opciones.'
        },
        field: 'hasSpaceAtShelter',
        type: 'yesno',
        barrier: 'Limited Space'
      }
    ]
  },
  {
    id: 'shelter-2-verif',
    name: {
      en: 'NORTHERN CALIFORNIA FAMILY CENTER',
      es: 'CENTRO FAMILIAR DEL NORTE DE CALIFORNIA'
    },
    description: {
      en: 'Short term shelter options for runaway and homeless youth, crisis counseling, family mediation, transportation, referrals, and housing in foster homes',
      es: 'Opciones de refugio a corto plazo para jóvenes fugitivos y sin hogar, consejería de crisis, mediación familiar, transporte, referencias y alojamiento en hogares de acogida'
    },
    category: ['Housing', 'Crisis Support', 'Family Services', 'Transportation', 'Case Management'],
    eligibility: {
      age: { min: 0, max: 17 },
      duration: 'short-term'
    },
    contact: {
      phone: ['(800) 718-4357', '(925) 370-1990'],
      address: '2244 Pacheco Boulevard Martinez, CA 94553',
      website: 'https://ncfc.us'
    },
    hours: {
      en: '24/7',
      es: '24/7'
    },
    whatItOffers: [
      {
        en: 'Short term shelter',
        es: 'Refugio a corto plazo'
      },
      {
        en: 'Immediate foster home services',
        es: 'Servicios inmediatos de hogares de acogida'
      },
      {
        en: 'Crisis counseling',
        es: 'Consejería de crisis'
      },
      {
        en: 'Family mediation',
        es: 'Mediación familiar'
      },
      {
        en: 'Case management support',
        es: 'Apoyo de manejo de casos'
      },
      {
        en: 'Transportation assistance',
        es: 'Asistencia de transporte'
      },
      {
        en: 'Referrals',
        es: 'Referencias'
      }
    ],
    commonBarriers: [
      'Transportation to the shelter'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: {
          en: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
          es: '¿Tienes cómo llegar al refugio? (Autobús, transporte, distancia caminando, etc.)'
        },
        context: {
          en: 'The shelter offers transportation assistance. If you can\'t get there, we can help arrange a ride.',
          es: 'El refugio ofrece ayuda con el transporte. Si no puedes llegar allí, podemos ayudarte a organizar un traslado.'
        },
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'shelter-3-verif',
    name: {
      en: 'BILL WILSON CENTER',
      es: 'CENTRO BILL WILSON'
    },
    description: {
      en: 'Provides short-term shelter for homeless and runaway youth. Offers intensive individual, group and family counseling. Helps reunite families, prevent future problems and stabilize the lives of youth.',
      es: 'Proporciona refugio a corto plazo para jóvenes sin hogar y fugitivos. Ofrece consejería intensiva individual, grupal y familiar. Ayuda a reunir familias, prevenir problemas futuros y estabilizar la vida de los jóvenes.'
    },
    category: ['Housing', 'Individual counseling', 'Family Services'],
    eligibility: {
      age: { min: 12, max: 17 },
      duration: 'short-term'
    },
    contact: {
      phone: ['Intake (After Hours): (408) 850-6164', 'Intake (Monday-Friday 9am-5pm): (408) 243-0222'],
      address: '3490 The Alameda Santa Clara, CA 95050',
      website: 'http://www.billwilsoncenter.org/'
    },
    hours: {
      en: 'Mon-Fri 9am-5pm, After hours intake available',
      es: 'Lunes a Viernes 9am-5pm, Admisión disponible fuera de horario'
    },
    whatItOffers: [
      'Short term shelter',
      'Crisis counseling',
      'Family mediation',
      'Referrals'
    ],
    commonBarriers: [
      'Transportation to the shelter'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: {
          en: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
          es: '¿Tienes cómo llegar al refugio? (Autobús, transporte, distancia caminando, etc.)'
        },
        context: {
          en: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
          es: 'Saber cómo llegar allí nos ayuda a conectarte con otros recursos o a determinar si esto es realista para ti en este momento.'
        },
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'shelter-4-verif',
    name: {
      en: 'LARKIN STREET YOUTH SERVICES',
      es: 'SERVICIOS PARA JÓVENES DE LARKIN STREET'
    },
    description: {
      en: 'Provides emergency shelters for youth experiencing homelessness.',
      es: 'Proporciona refugios de emergencia para jóvenes sin hogar.'
    },
    category: ['Navigation & Youth Access Points', 'Supportive housing', 'Transitional housing', 'Rapid Rehousing Programs'],
    eligibility: {
      age: { min: 18, max: 27 },
      duration: 'long-term'
    },
    contact: {
      phone: ['1 (800) 669-6196', '1 (800) 447-8223'],
      address: '869 Ellis Street San Francisco, CA 94109 and 536 Central Avenue San Francisco, CA 94117',
      website: 'https://larkinstreetyouth.org'
    },
    hours: {
      en: 'Mon-Fri 8am-5pm. Call for more information.',
      es: 'Lunes a Viernes 8am-5pm. Llame para más información.'
    },
    whatItOffers: [
      {
        en: 'Short term shelter',
        es: 'Refugio a corto plazo'
      },
      {
        en: 'Long term shelter',
        es: 'Refugio a largo plazo'
      },
      {
        en: 'Affordable housing options',
        es: 'Opciones de vivienda asequible'
      },
      {
        en: 'Supportive housing',
        es: 'Vivienda con servicios de apoyo'
      },
      {
        en: 'Rapid rehousing programs',
        es: 'Programas de realojamiento rápido'
      },
      {
        en: 'Transitional housing',
        es: 'Vivienda transitoria'
      }
    ],
    commonBarriers: [
      'Transportation to the shelter'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: {
          en: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
          es: '¿Tienes cómo llegar al refugio? (Autobús, transporte, distancia caminando, etc.)'
        },
        context: {
          en: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
          es: 'Saber cómo llegar allí nos ayuda a conectarte con otros recursos o a determinar si esto es realista para ti en este momento.'
        },
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'food-1-verif',
    name: {
      en: 'AT THE CROSSROADS (ATC)',
      es: 'AT THE CROSSROADS (ATC)'
    },
    description: {
      en: 'Offers food, clothing, hygiene items, and referrals to community resources for youth experiencing homelessness.',
      es: 'Ofrece comida, ropa, artículos de higiene y referencias a recursos comunitarios para jóvenes sin hogar.'
    },
    category: ['Food', 'clothing', 'Hygiene', 'Case Management'],
    eligibility: {
      age: {min:0, max:1000 },
      situation: ['homeless']
    },
    contact: {
      phone: ['(415) 487-0691,  (415) 273-9824'],
      address: '167 Jessie Street San Francisco, CA 94105',
      website: 'https://atthecrossroads.org'
    },
    hours: {
      en: 'Mon-Fri 11am-6pm',
      es: 'Lunes a Viernes 11am-6pm'
    },
    whatItOffers: [
      'Comida / Food',
      'Ropa / Clothing',
      'Artículos de higiene / Hygiene items',
      'Referencias / Referrals'
    ],
    commonBarriers: [
      'Transportation to the shelter',
      'Identication requirements'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: {
          en: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
          es: '¿Tienes cómo llegar al refugio? (Autobús, transporte, distancia caminando, etc.)'
        },
        context: {
          en: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
          es: 'Saber cómo llegarías nos ayuda a conectarte con otros recursos o determinar si es una opción realista para ti en este momento.'
        },
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      },
      {
        id: 'ID-barrier',
        text: 'Do you have any identification? For example, a school ID, a drivers license, or a passport?',
        context: {
          en: 'This program may require identification to access certain services. If you don\'t have ID, we can look for other options that don\'t require it.',
          es: 'Este programa puede requerir identificación para acceder a ciertos servicios. Si no tienes identificación, podemos buscar otras opciones que no la requieran.'
        },
        field: 'identification',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]

  }
]




