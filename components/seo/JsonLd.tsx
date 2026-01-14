import { APP_NAME, APP_TAGLINE } from '@/utils/constants';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thelegal.in';

interface JsonLdProps {
  type?: 'organization' | 'website' | 'course';
}

export default function JsonLd({ type = 'organization' }: JsonLdProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: APP_NAME,
    description: 'AI-powered CLAT preparation platform with adaptive learning, practice questions, mock tests, and daily current affairs.',
    url: baseUrl,
    logo: `${baseUrl}/og-image.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    alternateName: APP_TAGLINE,
    url: baseUrl,
    description: 'AI-powered CLAT preparation platform for law entrance exam aspirants.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/current-affairs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'CLAT Preparation Course',
    description: 'Comprehensive CLAT preparation covering Legal Reasoning, Logical Reasoning, English Language, Quantitative Techniques, and Current Affairs.',
    provider: {
      '@type': 'EducationalOrganization',
      name: APP_NAME,
      url: baseUrl,
    },
    educationalLevel: 'Undergraduate Entrance',
    teaches: [
      'Legal Reasoning',
      'Logical Reasoning',
      'English Language',
      'Quantitative Techniques',
      'Current Affairs',
    ],
    coursePrerequisites: 'Class 12 or equivalent',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT6M', // Part-time 6 months
    },
  };

  const schemas = {
    organization: organizationSchema,
    website: websiteSchema,
    course: courseSchema,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas[type]),
      }}
    />
  );
}

// Combined schema for the homepage
export function HomePageJsonLd() {
  const combinedSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: APP_NAME,
      description: 'AI-powered CLAT preparation platform with adaptive learning, practice questions, mock tests, and daily current affairs.',
      url: baseUrl,
      logo: `${baseUrl}/og-image.png`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: APP_NAME,
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/current-affairs?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'CLAT Preparation Course',
      description: 'Comprehensive CLAT preparation covering all five sections of the exam.',
      provider: {
        '@type': 'EducationalOrganization',
        name: APP_NAME,
      },
      educationalLevel: 'Undergraduate Entrance',
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema),
      }}
    />
  );
}
