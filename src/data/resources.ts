import { Resource } from '../types'

export const resources: Resource[] = [
  {
    id: 'shelter-1',
    name: 'Youth Emergency Shelter',
    description: '24/7 emergency shelter for youth ages 16-24',
    category: ['Housing'],
    eligibility: {
      age: { min: 16, max: 24 },
      situation: ['homeless', 'at-risk']
    },
    contact: {
      phone: ['(555) 123-4567'],
      address: '123 Main Street, City, State'
    },
    hours: '24/7',
    notes: 'Walk-ins welcome. Provides meals and basic necessities.',
    whatItOffers: [
      'Safe place to sleep',
      'Three meals a day',
      'Showers and laundry facilities',
      'Basic hygiene supplies',
      'Case management support',
      'Help finding permanent housing'
    ],
    commonBarriers: [
      'Transportation to the shelter',
      'Limited space (first come, first served)',
      'Curfew requirements',
      'Need for ID or documentation'
    ],
    followUpQuestions: [
      {
        id: 'transport-barrier',
        text: 'Do you have a way to get to the shelter? (Bus, ride, walking distance, etc.)',
        context: 'Some shelters are in specific locations. Knowing how you\'d get there helps us figure out if this is realistic for you right now.',
        field: 'transportToShelter',
        type: 'yesno',
        barrier: 'Transportation'
      },
      {
        id: 'curfew-barrier',
        text: 'Can you be at the shelter by their curfew time? (Usually around 8-9pm)',
        context: 'Most shelters have curfews to keep everyone safe. If you work late or have other commitments, this might be a challenge.',
        field: 'canMeetCurfew',
        type: 'yesno',
        barrier: 'Curfew requirements'
      },
      {
        id: 'documentation-barrier',
        text: 'Do you have any ID or documentation? (Even a school ID or birth certificate helps)',
        context: 'Some shelters need to see ID to check you in. But many will work with you even if you don\'t have it yet.',
        field: 'hasDocumentation',
        type: 'yesno',
        barrier: 'Documentation requirements'
      }
    ]
  },
  {
    id: 'shelter-2',
    name: 'Transitional Living Program',
    description: 'Long-term housing support for youth 18-21',
    category: ['Housing'],
    eligibility: {
      age: { min: 18, max: 21 },
      duration: 'long-term'
    },
    contact: {
      phone: ['(555) 234-5678'],
      email: 'tlp@example.org'
    },
    hours: 'Mon-Fri 9am-5pm'
  },
  {
    id: 'food-1',
    name: 'Youth Food Bank',
    description: 'Free meals and groceries for youth in need',
    category: ['Food'],
    eligibility: {
      age: { max: 25 }
    },
    contact: {
      phone: ['(555) 345-6789'],
      address: '456 Oak Avenue, City, State'
    },
    hours: 'Mon-Sat 10am-6pm'
  },
  {
    id: 'health-1',
    name: 'Youth Health Clinic',
    description: 'Free medical and mental health services',
    category: ['Healthcare'],
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 456-7890'],
      website: 'www.youthhealth.org'
    },
    hours: 'Mon-Fri 8am-8pm'
  },
  {
    id: 'education-1',
    name: 'Education Support Center',
    description: 'Help with school enrollment, GED prep, and college applications',
    category: ['Education'],
    eligibility: {
      inSchool: true
    },
    contact: {
      phone: ['(555) 567-8901'],
      email: 'education@example.org'
    },
    hours: 'Mon-Fri 9am-5pm'
  },
  {
    id: 'legal-1',
    name: 'Youth Legal Aid',
    description: 'Free legal assistance for youth issues',
    category: ['Legal'],
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 678-9012'],
      website: 'www.youthlegal.org'
    },
    hours: 'Mon-Fri 10am-4pm'
  },
  {
    id: 'job-1',
    name: 'Youth Employment Program',
    description: 'Job training, placement, and career counseling',
    category: ['Employment'],
    eligibility: {
      age: { min: 16, max: 24 },
      hasIncome: false
    },
    contact: {
      phone: ['(555) 789-0123'],
      email: 'jobs@example.org'
    },
    hours: 'Mon-Fri 9am-5pm'
  },
  {
    id: 'id-1',
    name: 'ID Assistance Program',
    description: 'Help obtaining identification documents',
    category: ['Documentation'],
    eligibility: {
      hasId: false
    },
    contact: {
      phone: ['(555) 890-1234'],
      address: '789 Pine Street, City, State'
    },
    hours: 'Mon-Fri 10am-3pm'
  },
  {
    id: 'transport-1',
    name: 'Transportation Assistance Program',
    description: 'Free bus passes, gas vouchers, and ride assistance for youth in crisis',
    category: ['Transportation'],
    eligibility: {
      age: { max: 24 },
      situation: ['homeless', 'at-risk', 'car', 'transportation']
    },
    contact: {
      phone: ['(555) 901-2345'],
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
    category: ['Food'],
    eligibility: {
      age: { max: 25 }
    },
    contact: {
      phone: ['(555) 012-3456'],
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
    category: ['Education'],
    eligibility: {
      age: { max: 21 }
    },
    contact: {
      phone: ['(555) 123-4560'],
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
    category: ['Housing'],
    eligibility: {
      age: { min: 18, max: 24 },
      situation: ['homeless', 'car', 'unsheltered']
    },
    contact: {
      phone: ['(555) 234-5671'],
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
    category: ['Multi-Service'],
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 345-6782'],
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
    category: ['Benefits'],
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 456-7893'],
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
    category: ['Crisis Support'],
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 567-8904'],
      website: 'www.youthcrisis.org'
    },
    hours: '24/7',
    notes: 'Available anytime. Can help with immediate safety needs, emotional support, and connecting to resources.',
    priority: 'high'
  },
  {
    id: 'comprehensive-center',
    name: 'Youth Comprehensive Support Center',
    description: 'Multi-service center providing housing assistance, food programs, and crisis support in one location',
    category: ['Housing', 'Food', 'Crisis Support'], // Multiple categories
    eligibility: {
      age: { max: 24 }
    },
    contact: {
      phone: ['(555) 999-1111', '(555) 999-2222'], // Multiple phone numbers - main and crisis line
      email: 'help@youthcenter.org',
      address: '100 Youth Support Way, City, State'
    },
    hours: 'Mon-Fri 8am-8pm, Crisis Line: 24/7',
    notes: 'Comprehensive center serving multiple needs. Call main line during business hours, crisis line anytime.',
    priority: 'high',
    urgent: false,
    whatItOffers: [
      'Emergency housing assistance',
      'Daily meals and food pantry',
      'Crisis counseling and support',
      'Case management services',
      'Resource navigation and referrals'
    ],
    commonBarriers: [
      'Transportation to center',
      'May have waiting lists for some services'
    ]
  }
]

