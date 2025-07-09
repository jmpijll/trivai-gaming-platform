import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TrivAI - AI-Powered Gaming Platform',
  description:
    'Experience the future of gaming with TrivAI - an open-source AI-driven multiplayer trivia platform powered by Large Language Models.',
  keywords: [
    'AI gaming',
    'trivia',
    'multiplayer',
    'LLM',
    'artificial intelligence',
    'gaming platform',
    'open source',
  ],
  authors: [{ name: 'Jamie Matthew van der Pijll', url: 'https://trivai.nl' }],
  creator: 'Jamie Matthew van der Pijll',
  publisher: 'TrivAI Gaming Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trivai.nl',
    siteName: 'TrivAI',
    title: 'TrivAI - AI-Powered Gaming Platform',
    description: 'Experience the future of gaming with AI-powered multiplayer trivia',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TrivAI Gaming Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrivAI - AI-Powered Gaming Platform',
    description: 'Experience the future of gaming with AI-powered multiplayer trivia',
    creator: '@trivai_platform',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 font-sans text-white antialiased">
        <div className="min-h-screen bg-black/20">
          {children}
        </div>
      </body>
    </html>
  );
} 