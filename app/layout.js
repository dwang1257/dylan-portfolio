import "./globals.css";
import { SITE_URL, PERSON } from "./site";

const description =
  "Dylan Wang is a software engineer at IBM on the DB2 Analytics Accelerator team and a Computer Engineering alum of the University of Massachusetts Amherst. Previously a software engineering intern at Fidelity Investments and an ML researcher at UMass Lowell.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dylan Wang - Software Engineer at IBM",
    template: "%s | Dylan Wang",
  },
  description,
  keywords: [
    "Dylan Wang",
    "Dylan Wang software engineer",
    "Dylan Wang IBM",
    "Dylan Wang UMass Amherst",
    "Dylan Wang UMass",
    "Dylan Wang portfolio",
    "Dylan Wang Computer Engineering",
    "Dylan Wang Fidelity Investments",
    "Dylan Wang UMass Lowell",
    "IBM DB2 Analytics Accelerator",
    "software engineer Santa Clara",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  applicationName: "Dylan Wang",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Dylan",
    lastName: "Wang",
    username: "dwang1257",
    url: SITE_URL,
    siteName: "Dylan Wang",
    title: "Dylan Wang - Software Engineer at IBM",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dylan Wang - Software Engineer at IBM",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#dylan-wang`,
  name: "Dylan Wang",
  givenName: "Dylan",
  familyName: "Wang",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description,
  jobTitle: "Software Engineer",
  email: `mailto:${PERSON.email}`,
  worksFor: {
    "@type": "Organization",
    name: "IBM",
    url: "https://www.ibm.com/",
    department: {
      "@type": "Organization",
      name: "DB2 Analytics Accelerator",
    },
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Massachusetts Amherst",
      url: "https://www.umass.edu/",
      sameAs: "https://en.wikipedia.org/wiki/University_of_Massachusetts_Amherst",
    },
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
    occupationalCategory: "15-1252.00",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Clara",
    addressRegion: "CA",
    addressCountry: "US",
  },
  knowsAbout: [
    "Software Engineering",
    "Distributed Systems",
    "Databases",
    "Machine Learning",
    "Computer Engineering",
    "Full Stack Development",
  ],
  sameAs: [PERSON.github, PERSON.linkedin],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Dylan Wang",
  description,
  inLanguage: "en-US",
  publisher: { "@id": `${SITE_URL}/#dylan-wang` },
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: "Dylan Wang - Software Engineer at IBM",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#dylan-wang` },
  mainEntity: { "@id": `${SITE_URL}/#dylan-wang` },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema, profilePageSchema]),
          }}
        />
      </body>
    </html>
  );
}
