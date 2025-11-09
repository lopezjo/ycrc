import { Resource } from '../types'

export const resources: Resource[] = [
  {
    id: 'shelter-1-verified',
    name: 'HUCKLEBERRY HOUSE CRISIS SHELTER',
    description: 'Provides emergency shelter for runaway youth and youth experiencing homelessness. \nOffers case management, crisis intervention, and resolution services.',
    category: ['Housing', 'Crisis Support'],
    eligibility: {
      age: { min: 12, max: 18 },
      situation: ['homeless']
    },
    contact: {
      phone: ['(415) 621-2929', '(415) 668-2622', 'TTY: (800) 735-2929'],
      address: '1292 Page Street San Francisco, CA 94117'
    },
    hours: '24/7 for immediate needs and intake support. Mon-Fri 8am - 5pm',
    notes: 'Call for appointment. Provides meals and basic necessities.',
    urgent: true,
    priority: 'high',
    lgbtqAffirming: true,
    tags: ['24/7', 'No ID Required', 'LGBTQ+ Safe'],
    whatItOffers: [
      'Safe place to sleep',
      'Three meals a day',
      'Showers and laundry facilities',
      'Basic hygiene supplies',
      'Case management support',
      'Spanish language services available',
      'No ID required for intake',
      'LGBTQ+ affirming environment'
    ],
    commonBarriers: [
      'Transportation to the shelter',
      'Limited space'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      },
      {
        id: 'space-barrier',
        text: 'The shelter can tell you if they have space when you call. Do you want to check if there is space available?',
        context: 'Huckleberry house may have limited beds. If there is no space, we can look for other options.',
        field: 'hasSpaceAtShelter',
        type: 'yesno',
        barrier: 'Limited Space'
      }
    ]
  },
  {
    id: 'shelter-2-verif',
    name: 'NORTHERN CALIFORNIA FAMILY CENTER',
    description: 'Short term shelter options for runaway and homeless youth, crisis counseling, family mediation, transportation, referrals, and housing in foster homes',
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
    hours: '24/7',
    whatItOffers: [
      'Short term shelter',
      'Immediate foster home services',
      'Crisis counseling',
      'Family mediation',
      'Case management support',
      'transportation assistance',
      'Referrals'
    ],
    commonBarriers: [
      'Transportation to the shelter'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'The shelter offers transportation assistance. If you can\'t get there, we can help arrange a ride.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'shelter-3-verif',
    name: 'BILL WILSON CENTER',
    description: 'Provides short-term shelter for homeless and runaway youth. Offers intensive individual, group and family counseling. Helps reunite families, prevent future problems and stabilize the lives of youth.',
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
    hours: 'Mon-Fri 9am-5pm, After hours intake available',
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
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'shelter-4-verif',
    name: 'LARKIN STREET YOUTH SERVICES',
    description: 'Provides emergency shelters for youth experiencing homelessness.',
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
    hours: 'Mon-Fri 8am-5pm. Call for more information.',
    whatItOffers: [
      'Short term shelter',
      'Long term shelter',
      'Affordable housing options',
      'Supportive housing',
      'Rapid rehousing programs',
      'Transitional housing'
    ],
    commonBarriers: [
      'Transportation to the shelter'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]
  },
  {
    id: 'food-1-verif',
    name: 'AT THE CROSSROADS (ATC)',
    description: ' Offers food, clothing, hygiene items, and referrals to community resources for youth experiencing homelessness.',
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
    hours: 'Mon-Fri 11am-6pm',
    whatItOffers: [
      'Food',
      'Clothing',
      'Hygiene items',
      'Referrals'
    ],
    commonBarriers: [
      'Transportation to the shelter',
      'Identication requirements'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'Knowing how you\'d get there helps us connect you to other resources, or determine if this is realistic for you right now.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      },
      {
        id: 'ID-barrier',
        text: 'Do you have any identification? For example, a school ID, a drivers license, or a passport?',
        context: 'This program may require identification to access certain services. If you don\'t have ID, we can look for other options that don\'t require it.',
        field: 'identification',
        type: 'yesno',
        barrier: 'Transportation'
      }
    ]

  }
]




