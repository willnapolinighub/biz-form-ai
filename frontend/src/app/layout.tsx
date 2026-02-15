import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        <title>BizFormAI - Automated Business Formation</title>
        <meta name="description" content="AI-powered platform for automated business formation, document generation, and entity management." />
      </head>
      <body className="font-sans min-h-screen bg-background">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
