import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lucky-Browser',
  description: 'Lucky100 Browser-Ina-Browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
