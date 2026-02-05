export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  specialty: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  emergencyServices: boolean;
  hematologyDept: boolean;
  description: string;
  image: string;
}

export const hospitals: Hospital[] = [
  {
   id: 'Dharan Cancer Hospital',
  name: 'Dharan Cancer Hospital',
  address: 'Seelanickanpatti Bye Pass, Salem 636201, Tamil Nadu, India',
  phone: '0427-2281717 / 0427-2281xxx',  // approximate
  distance: 'varies depending on your location in Salem',
  rating: 4.1,  // not found
  specialty: ['Hematology / Hemato-Oncology', 'Oncology', 'Laboratory Diagnostics', 'General Medicine'],
  coordinates: { lat:40.7589  , lng: 77.6546 },  // approximate
  website: 'http://www.dharancancerhospital.org/',
  emergencyServices: true,  // assumed for cancer hospital
  hematologyDept: true,
  description: 'Dedicated center for hemato-oncology; treats blood cancers, anemia, platelets & clotting disorders etc. in both adults and children. Every major hematologic disease addressed. '  ,
  image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
     id: 'Shanmuga Hospitals And Salem Cancer Institute',
  name: 'Shanmuga Hospitals & Salem Cancer Institute',
  address: '24 Saradha College Road, LRN Colony, Chinna Pudur, Salem, Tamil Nadu 636007, India',
  phone: '0427-2315293 etc.', 
  distance: 'depends on your location in Salem',
  rating: 4.0,
  specialty: ['Oncology', 'Hematology', 'Critical Care', 'CT Scanning', 'General & Surgical Medicine'],
  coordinates: { lat:40.7589  , lng: 77.6546 },
  website: 'shanmugahospital.com',  // multispeciality with hematology wing   :contentReference[oaicite:1]{index=1}
  emergencyServices: true,
  hematologyDept: true,
  description: 'First & leading cancer hospital in Salem; has a well-equipped hematology lab and offers hemato-oncology services.  ',
  image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Regional Blood & Cancer Institute',
    address: '9012 Specialty Dr, Medical Park, City 12347',
    phone: '+1 (555) 345-6789',
    distance: '6.8 km',
    rating: 4.9,
    specialty: ['Hematology', 'Oncology', 'Blood Disorders', 'Transfusion Medicine'],
    coordinates: { lat: 40.6892, lng: -74.0445 },
    website: 'https://bloodcancerinstitute.com',
    emergencyServices: false,
    hematologyDept: true,
    description: 'Specialized institute focusing exclusively on blood disorders, anemia treatment, and hematological conditions.',
    image: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'University Teaching Hospital',
    address: '3456 Academic Way, University District, City 12348',
    phone: '+1 (555) 456-7890',
    distance: '8.2 km',
    rating: 4.7,
    specialty: ['Research', 'Hematology', 'Internal Medicine', 'Teaching Hospital'],
    coordinates: { lat: 40.8176, lng: -73.9782 },
    website: 'https://universityhospital.edu',
    emergencyServices: true,
    hematologyDept: true,
    description: 'Academic medical center with cutting-edge research facilities and comprehensive hematology services.',
    image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Community Health Clinic',
    address: '7890 Community St, Neighborhood, City 12349',
    phone: '+1 (555) 567-8901',
    distance: '3.5 km',
    rating: 4.3,
    specialty: ['Family Practice', 'Preventive Care', 'Laboratory Services', 'Health Screenings'],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    website: 'https://communityhealthclinic.org',
    emergencyServices: false,
    hematologyDept: false,
    description: 'Affordable community clinic providing basic health services and blood testing for anemia screening.',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Women\'s Health Specialists',
    address: '2468 Women\'s Way, Health Plaza, City 12350',
    phone: '+1 (555) 678-9012',
    distance: '5.7 km',
    rating: 4.8,
    specialty: ['Women\'s Health', 'Gynecology', 'Pregnancy Care', 'Iron Deficiency'],
    coordinates: { lat: 40.7282, lng: -73.9942 },
    website: 'https://womenshealthspecialists.com',
    emergencyServices: false,
    hematologyDept: false,
    description: 'Specialized care for women with focus on pregnancy-related anemia and iron deficiency treatment.',
    image: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];