import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollIcon from './home/ScrollIcon'
import TypeWriter from './home/TypeWriter'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaBlogger } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'

const divVariants = {
    hidden: {
        y: 200,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
}

const innerDivVariants = {
    hidden: {
        y: 100,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delay: 0.2,
            duration: 0.5
        }
    }
}

export default function Home() {
    const controls = useAnimation()
    const { ref, inView } = useInView()
    const [alreadySeen, setAlreadySeen] = useState(false)

    useEffect(() => {
        if (inView) {
            controls.start('visible')
            setAlreadySeen(true)
        }
        if (!inView && !alreadySeen) {
            controls.start('hidden')
        }
    }, [inView, controls])

    return (
        <>
        <ScrollIcon />
        <section id="home" className='flex text-center justify-center items-center w-full mt-28 font-home max-w-[1536px] mx-auto relative'>
            <motion.div
                variants={divVariants}
                initial="hidden"
                animate={controls}
                ref={ref} 
                className='flex justify-center mx-auto w-full h-[calc(100vh-112px)] min-h-[640px] text-white relative'
            >
                <motion.div
                    variants={innerDivVariants}
                    initial="hidden"
                    animate={controls}
                    className='z-[9999] justify-center flex flex-col p-6 sm:p-8 m-4 h-fit bg-gradient-to-br from-black/90 to-gray-900/80 rounded-lg backdrop-blur-sm border border-gray-800/30 shadow-xl'
                >
                    <h1 className='text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                        Yuri Corredor
                    </h1>
                    <h3 className='text-xl sm:text-2xl text-gray-300 mt-2 h-14'>
                        <TypeWriter 
                            words={[
                                "Full Stack Developer",
                                "React Specialist",
                                "Problem Solver",
                                "Tech Enthusiast"
                            ]} 
                        />
                    </h3>
                    <div className='flex flex-col gap-4 items-center mt-6'>
                        <a
                            href="/YuriCorrector_CV.pdf"
                            download
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <HiDownload className="animate-bounce" />
                            Download CV
                        </a>
                        <div className='flex gap-4 justify-center'>
                            <a 
                                rel="noreferrer" 
                                target="_blank" 
                                href='https://github.com/YuriCorredor' 
                                className="group relative"
                            >
                                <SiGithub className="text-white hover:text-gray-300 w-8 h-8 transition-all hover:scale-125" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    GitHub
                                </span>
                            </a>
                            <a 
                                rel="noreferrer" 
                                target="_blank" 
                                href='https://www.linkedin.com/in/yuri-corredor/' 
                                className="group relative"
                            >
                                <SiLinkedin className="text-white hover:text-gray-300 w-8 h-8 transition-all hover:scale-125" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    LinkedIn
                                </span>
                            </a>
                            <a 
                                rel="noreferrer" 
                                target="_blank" 
                                href='https://blog.yuricorredor.com.br' 
                                className="group relative"
                            >
                                <FaBlogger className="text-white hover:text-gray-300 w-8 h-8 transition-all hover:scale-125" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    Blog
                                </span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
        </>
    )
}
