import {
  BadgeCheck,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers3,
  MessageSquareText,
  ServerCog,
  ShieldCheck,
  Smartphone,
  Workflow
} from 'lucide-react';

export const profile = {
  name: 'Naveen Nadimpalli',
  title: 'Java Full Stack Developer',
  experience: '4.5+ Years Experience',
  summary:
    'Java Full Stack Developer with 4.5+ years of experience in designing and developing enterprise applications using Java, Spring Boot, Microservices, Kafka, AWS, React JS, and PostgreSQL.',
  email: 'nadimpallinaveen2@gmail.com',
  location: 'India',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '#',
  github: import.meta.env.VITE_GITHUB_URL || '#',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || ''
};

export const techStack = [
  'Java 8',
  'Java 17',
  'Java 21',
  'Spring Boot',
  'Spring MVC',
  'Microservices',
  'Apache Kafka',
  'AWS',
  'Hibernate',
  'Spring Data JPA',
  'React JS',
  'React Native',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'REST APIs',
  'Docker',
  'Git',
  'GitHub',
  'GitLab',
  'Maven',
  'Gradle'
];

export const technologyLogos = [
  'Java',
  'Spring Boot',
  'Kafka',
  'AWS',
  'React',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'GitHub',
  'Maven'
];

export const highlights = [
  { label: 'Enterprise systems', value: '4 domains', icon: BriefcaseBusiness },
  { label: 'Backend depth', value: 'Java + Spring', icon: ServerCog },
  { label: 'Cloud delivery', value: 'AWS services', icon: Cloud },
  { label: 'Modern UI', value: 'React apps', icon: Layers3 }
];

export const experiences = [
  {
    company: 'Accenture',
    role: 'Java Full Stack Developer',
    period: 'Enterprise Delivery',
    summary:
      'Worked on scalable enterprise systems using Java, Spring Boot, REST APIs, persistence layers, and cloud-ready delivery practices.',
    icon: Building2
  },
  {
    company: 'UpwardIQ',
    role: 'Full Stack Developer',
    period: 'Product Engineering',
    summary:
      'Delivered backend APIs and React-based user experiences with a focus on reliable workflows, integrations, and maintainable feature delivery.',
    icon: CalendarDays
  },
  {
    company: 'BO IT Solutions',
    role: 'Java Developer',
    period: 'Application Development',
    summary:
      'Built Java and Spring modules, supported database-backed application features, and collaborated across development and release activities.',
    icon: BriefcaseBusiness
  }
];

export const journey = [
  'Built resilient APIs and business workflows for enterprise application platforms.',
  'Integrated microservices, Kafka messaging, and persistence layers for high-volume business use cases.',
  'Delivered frontend experiences using React JS and mobile-capable solutions with React Native.',
  'Worked across cloud deployments, observability, databases, version control, and build automation.'
];

export const expertise = [
  'Java 8, Java 17, Java 21 and Spring ecosystem development',
  'REST API design, Spring Security, JWT, validation, and exception handling',
  'Microservices communication, Kafka event flows, and transactional persistence',
  'AWS EC2, S3, RDS, Lambda, CloudWatch, IAM and production troubleshooting',
  'React JS component systems, responsive UI, and API integration'
];

export const education = [
  'Bachelor degree in Computer Science or related engineering discipline',
  'Continuous learning in cloud-native Java, system design, and frontend engineering'
];

export const certifications = [
  'AWS cloud fundamentals and hands-on service experience',
  'Java, Spring Boot, Microservices, React, and database training through project delivery'
];

export const skillGroups = [
  {
    title: 'Backend',
    icon: Code2,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Hibernate', 'JPA']
  },
  {
    title: 'Frontend',
    icon: Smartphone,
    skills: ['React JS', 'React Native', 'JavaScript', 'HTML', 'CSS']
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    skills: ['AWS', 'Docker', 'Git', 'Maven', 'Gradle']
  },
  {
    title: 'Database',
    icon: Database,
    skills: ['MySQL', 'PostgreSQL', 'MongoDB']
  }
];

export const projects = [
  {
    name: 'OEMI Modernization',
    description:
      'Modernized OEM integration workflows with service-oriented backend modules, API contracts, and reliable enterprise data exchange.',
    technologies: ['Java', 'Spring Boot', 'Spring MVC', 'JPA', 'MySQL', 'REST APIs'],
    responsibilities: [
      'Developed backend modules for integration flows',
      'Implemented REST APIs and data persistence layers',
      'Improved maintainability through clean service boundaries'
    ],
    achievements: ['Reduced manual integration effort', 'Improved reliability of OEM data workflows'],
    screenshotLabel: 'OEM integration command center',
    icon: Workflow
  },
  {
    name: 'BECTRAN',
    description:
      'Delivered credit management capabilities for business users handling applications, approvals, customer records, and operational reporting.',
    technologies: ['Java', 'Spring Boot', 'Hibernate', 'PostgreSQL', 'React JS', 'AWS'],
    responsibilities: [
      'Built credit application APIs and validation rules',
      'Integrated frontend screens with backend services',
      'Supported production issue analysis and enhancements'
    ],
    achievements: ['Streamlined credit application processing', 'Improved user visibility across workflows'],
    screenshotLabel: 'Credit workflow dashboard',
    icon: ShieldCheck
  },
  {
    name: 'IR STING Shipment Tracking',
    description:
      'Built shipment tracking features with event-driven updates, status visibility, and operational workflows for logistics teams.',
    technologies: ['Java', 'Spring Boot', 'Kafka', 'MongoDB', 'React JS', 'Docker'],
    responsibilities: [
      'Implemented shipment event ingestion and status APIs',
      'Worked on Kafka-based asynchronous processing',
      'Delivered responsive UI integrations for tracking data'
    ],
    achievements: ['Improved shipment traceability', 'Reduced tracking latency through event-driven processing'],
    screenshotLabel: 'Shipment tracking board',
    icon: Boxes
  },
  {
    name: 'Cooperative Strategies',
    description:
      'Developed survey management platform features for questionnaire flows, data collection, and reporting-oriented user experiences.',
    technologies: ['Spring Boot', 'React JS', 'Spring Data JPA', 'MySQL', 'GitLab CI'],
    responsibilities: [
      'Created survey and response management APIs',
      'Built reusable React components for survey workflows',
      'Collaborated on releases and code reviews'
    ],
    achievements: ['Improved survey workflow efficiency', 'Delivered maintainable modules for future enhancements'],
    screenshotLabel: 'Survey management workspace',
    icon: MessageSquareText
  }
];

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin', to: '/admin' }
];

export const values = [
  { title: 'API-first delivery', icon: BrainCircuit },
  { title: 'Secure resume access', icon: BadgeCheck },
  { title: 'Cloud-ready systems', icon: Cloud },
  { title: 'Versioned teamwork', icon: GitBranch }
];
