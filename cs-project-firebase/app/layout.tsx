
import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'

export const metadata = { title: 'OnePage Shop', description: 'Instant digital downloads and tools' }

export default function RootLayout({ children }: { children: ReactNode }){
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <div className="container">
            <Navbar />
          </div>
        </div>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
