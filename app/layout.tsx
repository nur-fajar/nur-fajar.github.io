import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import SideNav from '@/components/SideNav'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.dev'),
  title: 'Nur Fajar — Builds AI Systems, Trains the Team',
  description:
    'I find the problem, build the automation with AI, and train the team to run it. Based in Tangerang, Indonesia. Available for remote roles in AI, automation, and L&D.',
  keywords: [
    'AI Automation',
    'GenAI Trainer',
    'L&D Specialist',
    'Python',
    'LLM Integration',
    'GPT-4o',
    'Prompt Engineering',
    'Nur Fajar',
  ],
  openGraph: {
    title: 'Nur Fajar — Builds AI Systems, Trains the Team',
    description:
      'I find the problem, build the automation with AI, and train the team to run it.',
    type: 'website',
    url: 'https://nurfajar.dev',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nur Fajar — Builds AI Systems, Trains the Team',
    description:
      'I find the problem, build the automation with AI, and train the team to run it.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-brand-bg text-brand-text font-sans antialiased">
        <SmoothScroll />
        <SideNav />
        {children}
      </body>
    </html>
  )
}
