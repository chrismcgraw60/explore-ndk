import NavHeader from '@/app/NavHeader'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
            <NavHeader/>
            <div className='flex flex-1 overflow-hidden'> 
              {children}
            </div>
        </main>
        
      </body>
    </html>
  )
}


{/*
<main class="flex flex-col h-screen">
  <div class="flex bg-gray-300 h-16 p-4">Header</div>
  <div class="flex flex-1 overflow-hidden">
    <div class="flex bg-gray-100 w-32 p-4">Sidebar</div>
    <div class="flex flex-1 flex-col">
      <div class="flex flex-1 bg-blue-300 overflow-y-auto paragraph px-4">
        Creative Writing Generating random paragraphs can be an excellent way for writers to get their creative ...
      </div>
    </div>
  </div>
  <div class="flex">Footer</div>
</main>
*/}