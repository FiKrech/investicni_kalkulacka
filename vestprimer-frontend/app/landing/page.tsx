import { Metadata } from 'next'
import LandingPage from './landing-page'

export const metadata: Metadata = {
  title: 'VestPrimer — Mění mrtvé registrace na aktivní investory',
  description:
    'White-label B2B onboarding engine pro brokery a banky. Psychologická vrstva, která transformuje nováčka na připraveného investora.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LandingRoute() {
  return <LandingPage />
}
