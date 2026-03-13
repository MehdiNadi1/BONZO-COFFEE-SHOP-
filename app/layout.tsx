import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'BONZO | The alchemy of perfect extraction',
    description: 'Premium, precision-focused coffeeshop.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#050505] text-white/90 antialiased overflow-x-hidden`}>{children}</body>
        </html>
    )
}
