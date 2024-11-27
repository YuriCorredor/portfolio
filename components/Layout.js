import ThreeD from './layout/ThreeD'
import Footer from './layout/Footer'
import Nav from './layout/Nav'
import { useEffect } from 'react'

export default function Layout({ children }) {
    useEffect(() => {
        // always load at the top of the page
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Nav />
            <div className='min-h-screen w-full'>
                <ThreeD />
                <main className='absolute w-full bg-black'>
                    {children}
                    {/* <Footer /> */}
                </main>
            </div>
        </>
    )
}
