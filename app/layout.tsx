import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'
import './styles/globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
import { ViewTransitions } from 'next-view-transitions'

export const metadata = {
  title: 'Breadit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin']})

export default function RootLayout(props: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <html lang='en' className={cn('bg-white text-slate-900 antialiased light', inter.className)}>
        <body className='min-h-screen pt-12 antialiased bg-slate-50'>
          <Providers>
            <Navbar />

            {props.authModal}

            <div className='container px-4 h-full pt-12 mx-auto max-w-7xl'>
              {props.children}
            </div>

            <Toaster />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
