import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grove — Your garden, running.',
  description: 'The garden operating system. Daily guidance, AI diagnostics, harvest tracking.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0B110E' }}>
        {children}
      </body>
    </html>
  )
}
