import ThreeD from './layout/ThreeD'
import Nav from './layout/Nav'
import { useEffect, useRef, useState } from 'react'

export default function Layout({ children }) {
    const [blackHoleStage, setBlackHoleStage] = useState('idle')
    const [easterEggVisible, setEasterEggVisible] = useState(false)
    const stageRef = useRef('idle')
    const finaleTimerRef = useRef()

    const startFinale = () => {
        if (stageRef.current !== 'idle') return

        stageRef.current = 'consuming'
        setEasterEggVisible(false)
        setBlackHoleStage('consuming')
        document.documentElement.classList.add('black-hole-running')

        finaleTimerRef.current = window.setTimeout(() => {
            stageRef.current = 'complete'
            setBlackHoleStage('complete')
            document.documentElement.classList.add('black-hole-complete')
        }, 5600)
    }

    const resetFinale = () => {
        window.clearTimeout(finaleTimerRef.current)
        stageRef.current = 'idle'
        setBlackHoleStage('idle')
        setEasterEggVisible(true)
        document.documentElement.classList.remove('black-hole-running', 'black-hole-complete')
    }

    useEffect(() => {
        // always load at the top of the page
        window.scrollTo(0, 0)

        const handleFinalScroll = () => {
            const scrollBottom = window.scrollY + window.innerHeight
            const pageBottom = document.documentElement.scrollHeight
            const nearBottom = pageBottom > window.innerHeight && scrollBottom >= pageBottom - 180

            if (stageRef.current === 'idle') setEasterEggVisible(nearBottom)
        }

        window.addEventListener('scroll', handleFinalScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleFinalScroll)
            window.clearTimeout(finaleTimerRef.current)
            document.documentElement.classList.remove('black-hole-running', 'black-hole-complete')
        }
    }, [])

    return (
        <div className={`portfolio-shell black-hole-${blackHoleStage}`}>
            <Nav />
            <div className='min-h-screen w-full'>
                <ThreeD blackHoleStage={blackHoleStage} />
                <main className='portfolio-content absolute w-full'>
                    {children}
                </main>
            </div>
            {easterEggVisible && blackHoleStage === 'idle' && (
                <button
                    type="button"
                    className="black-hole-trigger"
                    onClick={startFinale}
                    aria-label="Reveal the black hole easter egg"
                >
                    <span className="anomaly-core" aria-hidden="true" />
                    <span className="anomaly-hint">Touch the anomaly</span>
                </button>
            )}
            {blackHoleStage !== 'idle' && (
                <div className="black-hole-finale" aria-live="polite">
                    <div className="black-hole-vignette" />
                    <a
                        className="cv-survivor"
                        href="/Yuri_Corredor_ENG.docx.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span>View CV</span>
                        <span aria-hidden="true">{'\u2197'}</span>
                    </a>
                    <button type="button" className="universe-reset" onClick={resetFinale}>
                        <span aria-hidden="true">{'\u21BA'}</span>
                        <span>Reset universe</span>
                    </button>
                </div>
            )}
        </div>
    )
}
