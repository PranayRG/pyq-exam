import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UGC NET Mock Test Platform',
  description: 'Practice UGC NET exams online with realistic CBT interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
