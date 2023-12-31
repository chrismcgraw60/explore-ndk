import NavHeader from '@/app/NavHeader'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import FlowNDKProvider from "@/components/FlowNDKProvider";

const inter = Inter({ subsets: ['latin'] })
const bodyClass = `${inter} h-full w-full`

export const metadata: Metadata = {
  title: 'Explore-NDK',
  description: 'Nostr testbed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-gray-700">
      <body className={bodyClass}>
        <main className='flex flex-col h-screen'>
          <FlowNDKProvider>
            <NavHeader/>
            <div className='flex flex-1 overflow-hidden'> 
              {children}
            </div>
          </FlowNDKProvider>
        </main>
        
      </body>
    </html>
  )
}