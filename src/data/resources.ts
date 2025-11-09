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
    whatItOffers: [
      'Safe place to sleep',
      'Three meals a day',
      'Showers and laundry facilities',
      'Basic hygiene supplies',
      'Case management support',
      'Spanish language services available',
      'No ID required for intake'
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
      'Short term shelter'
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
      age: {min:0, max:1000 }
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

  },
  {
    id: 'health-1',
    name: 'Youth Health Clinic',
    description: 'Free medical and mental health services',
    category: 'Healthcare',
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: '(555) 456-7890',
      website: 'www.youthhealth.org'
    },
    hours: 'Mon-Fri 8am-8pm'
  },
  {
    id: 'education-1',
    name: 'Education Support Center',
    description: 'Help with school enrollment, GED prep, and college applications',
    category: 'Education',
    eligibility: {
      inSchool: true
    },
    contact: {
      phone: '(555) 567-8901',
      email: 'education@example.org'
    },
    hours: 'Mon-Fri 9am-5pm'
  },
  {
    id: 'legal-1',
    name: 'Youth Legal Aid',
    description: 'Free legal assistance for youth issues',
    category: 'Legal',
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: '(555) 678-9012',
      website: 'www.youthlegal.org'
    },
    hours: 'Mon-Fri 10am-4pm'
  },
  {
    id: 'job-1',
    name: 'Youth Employment Program',
    description: 'Job training, placement, and career counseling',
    category: 'Employment',
    eligibility: {
      age: { min: 16, max: 24 },
      hasIncome: false
    },
    contact: {
      phone: '(555) 789-0123',
      email: 'jobs@example.org'
    },
    hours: 'Mon-Fri 9am-5pm'
  },
  {
    id: 'id-1',
    name: 'ID Assistance Program',
    description: 'Help obtaining identification documents',
    category: 'Documentation',
    eligibility: {
      hasId: false
    },
    contact: {
      phone: '(555) 890-1234',
      address: '789 Pine Street, City, State'
    },
    hours: 'Mon-Fri 10am-3pm'
  },
  {
    id: 'transport-1',
    name: 'Transportation Assistance Program',
    description: 'Free bus passes, gas vouchers, and ride assistance for youth in crisis',
    category: 'Transportation',
    eligibility: {
      age: { max: 24 },
      situation: ['homeless', 'at-risk', 'car', 'transportation']
    },
    contact: {
      phone: '(555) 901-2345',
      email: 'transport@youthservices.org'
    },
    hours: 'Mon-Fri 9am-5pm, Emergency: 24/7',
    notes: 'Can provide immediate bus passes and gas vouchers. No ID required for emergency assistance.',
    priority: 'high',
    whatItOffers: [
      'Free bus passes (weekly or monthly)',
      'Gas vouchers if you have a car',
      'Emergency ride assistance',
      'Help with public transportation navigation',
      'No ID required for emergency help'
    ],
    commonBarriers: [
      'Need to pick up passes in person',
      'Limited hours for non-emergency requests',
      'May need to show proof of need'
    ],
    followUpQuestions: [
      {
        id: 'transport-need',
        text: 'What kind of transportation help do you need most?',
        context: 'Different programs offer different types of help. Knowing what you need helps us make sure this is the right fit.',
        field: 'transportNeedType',
        type: 'multiple',
        options: [
          'Bus passes for public transportation',
          'Gas money/vouchers',
          'Emergency ride to a specific place',
          'Help learning the bus system',
          'Multiple types of help'
        ],
        barrier: 'Type of transportation need'
      },
      {
        id: 'transport-urgency',
        text: 'How soon do you need transportation help?',
        context: 'Some programs can help immediately, while others might take a day or two to process.',
        field: 'transportUrgency',
        type: 'multiple',
        options: [
          'Right now - emergency',
          'Today or tomorrow',
          'This week',
          'Ongoing support'
        ],
        barrier: 'Timing/urgency'
      }
    ]
  },
  {
    id: 'food-2',
    name: 'Emergency Food Assistance',
    description: 'Immediate food support - meals, groceries, and food vouchers',
    category: 'Food',
    eligibility: {
      age: { max: 25 }
    },
    contact: {
      phone: '(555) 012-3456',
      address: '321 Elm Street, City, State'
    },
    hours: 'Daily 8am-8pm',
    notes: 'Walk-ins welcome. No questions asked. Provides hot meals and take-home groceries.',
    priority: 'high',
    whatItOffers: [
      'Hot meals served daily',
      'Take-home groceries',
      'Food vouchers for local stores',
      'No questions asked - just show up',
      'No ID required',
      'Can come multiple times per week'
    ],
    commonBarriers: [
      'Transportation to the food bank',
      'Storage space for groceries (if living in car)',
      'Cooking facilities (if you need to prepare food)'
    ],
    followUpQuestions: [
      {
        id: 'food-transport',
        text: 'Can you get to the food bank location?',
        context: 'Food banks are usually in specific locations. If you can\'t get there, we can look for mobile food pantries or delivery options.',
        field: 'canGetToFoodBank',
        type: 'yesno',
        barrier: 'Transportation to food bank'
      },
      {
        id: 'food-storage',
        text: 'Do you have a place to store food? (Refrigerator, cooler, etc.)',
        context: 'Some food programs give fresh food that needs refrigeration. If you don\'t have storage, we can focus on non-perishable options or ready-to-eat meals.',
        field: 'hasFoodStorage',
        type: 'yesno',
        barrier: 'Food storage'
      }
    ]
  },
  {
    id: 'education-2',
    name: 'McKinney-Vento Education Rights',
    description: 'School enrollment help, transportation to school, and free school meals for homeless youth',
    category: 'Education',
    eligibility: {
      age: { max: 21 }
    },
    contact: {
      phone: '(555) 123-4560',
      website: 'www.schoolsupport.org',
      email: 'mckinneyvento@schools.org'
    },
    hours: 'Mon-Fri 8am-6pm',
    notes: 'Federal law guarantees immediate school enrollment and transportation even without permanent address. Can enroll same day.',
    priority: 'high'
  },
  {
    id: 'housing-3',
    name: 'Rapid Re-Housing for Youth',
    description: 'Quick housing placement with minimal barriers - helps with deposits and first month rent',
    category: 'Housing',
    eligibility: {
      age: { min: 18, max: 24 },
      situation: ['homeless', 'car', 'unsheltered']
    },
    contact: {
      phone: '(555) 234-5671',
      email: 'rapidrehousing@housing.org'
    },
    hours: 'Mon-Fri 9am-5pm',
    notes: 'Can start process over phone. Helps with housing search, applications, and move-in costs.',
    priority: 'high'
  },
  {
    id: 'multi-1',
    name: 'Youth Resource Center',
    description: 'One-stop center offering food, showers, laundry, case management, and resource navigation',
    category: 'Multi-Service',
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: '(555) 345-6782',
      address: '555 Youth Way, City, State',
      website: 'www.youthresource.org'
    },
    hours: 'Mon-Sat 9am-7pm',
    notes: 'Drop-in center. No appointment needed. Can help with multiple needs in one visit.',
    priority: 'high',
    whatItOffers: [
      'Free meals and snacks',
      'Showers and laundry facilities',
      'Case management and support',
      'Help navigating other resources',
      'Computer and internet access',
      'Basic supplies (hygiene, clothing)',
      'No appointment needed - just drop in'
    ],
    commonBarriers: [
      'Transportation to the center',
      'Limited hours (closed Sundays)',
      'May be busy during peak times'
    ],
    followUpQuestions: [
      {
        id: 'multi-transport',
        text: 'Can you get to the resource center?',
        context: 'This is a physical location. If you can\'t get there, we can look for other options or see if they have mobile services.',
        field: 'canGetToCenter',
        type: 'yesno',
        barrier: 'Transportation to center'
      },
      {
        id: 'multi-time',
        text: 'Are you available during their hours? (Mon-Sat 9am-7pm)',
        context: 'Drop-in centers have specific hours. If you work during those times or have other commitments, we might need to find alternatives.',
        field: 'availableDuringHours',
        type: 'yesno',
        barrier: 'Availability during center hours'
      }
    ]
  },
  {
    id: 'benefits-1',
    name: 'Benefits Navigation',
    description: 'Help applying for CalFresh (food stamps), Medi-Cal, and other benefits',
    category: 'Benefits',
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: '(555) 456-7893',
      email: 'benefits@youthservices.org'
    },
    hours: 'Mon-Fri 10am-4pm',
    notes: 'Can help you apply for multiple benefits at once. Phone or in-person assistance available.',
    priority: 'medium'
  },
  {
    id: 'crisis-1',
    name: '24/7 Youth Crisis Line',
    description: 'Immediate support, safety planning, and crisis intervention',
    category: 'Crisis Support',
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: '(555) 567-8904',
      website: 'www.youthcrisis.org'
    },
    hours: '24/7',
    notes: 'Available anytime. Can help with immediate safety needs, emotional support, and connecting to resources.',
    priority: 'high'
  }
]



