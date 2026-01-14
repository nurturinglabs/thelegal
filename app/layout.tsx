import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/providers/ClientProviders";
import { HomePageJsonLd } from "@/components/seo/JsonLd";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thelegal.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${APP_NAME} - ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: "AI-powered CLAT preparation platform with adaptive learning, practice questions, mock tests, and daily current affairs. Start your journey to top law schools today.",
  keywords: [
    "CLAT preparation",
    "CLAT 2025",
    "CLAT mock tests",
    "law entrance exam",
    "AILET preparation",
    "legal reasoning",
    "current affairs for CLAT",
    "CLAT practice questions",
    "NLU admission",
    "law school entrance",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} - ${APP_TAGLINE}`,
    description: "AI-powered CLAT preparation platform with adaptive learning, practice questions, mock tests, and daily current affairs.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - CLAT Preparation Platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - ${APP_TAGLINE}`,
    description: "AI-powered CLAT preparation platform with adaptive learning, practice questions, mock tests, and daily current affairs.",
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'education',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <HomePageJsonLd />
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientProviders>
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              {children}
            </main>
          </div>
          <MobileNav />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
