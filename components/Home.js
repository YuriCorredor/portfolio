import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollIcon from './home/ScrollIcon'

const divVariants = {
    hidden: {
        y: 200,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delay: 0.3,
            duration: 1
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
            delay: 1,
            duration: 1.5
        }
    }
}

export default function Home() {
    const controls = useAnimation()
    const { ref, inView } = useInView()
    const [alreadySeen, setAlreadySeen] = useState(false)

    useEffect(() => {
        if (inView) {
            console.log(`oi`)
            controls.start('visible')
            setAlreadySeen(true)
        }
        if (!inView && !alreadySeen) {
            console.log(`not`)
            controls.start('hidden')
        }
    }, [inView, controls])

    return (
        <>
        <ScrollIcon />
        <section className='flex text-center justify-center items-center w-full mt-28 font-home max-w-7xl mx-auto'>
            <motion.div
                variants={divVariants}
                initial="hidden"
                animate={controls}
                ref={ref} 
                className='flex justify-center mx-auto border-x-0 xl:border-x-2 bg-home w-full h-[640px] bg-cover text-white'
            >
                <motion.div
                    variants={innerDivVariants}
                    initial="hidden"
                    animate={controls}
                    className='z-[9999] justify-center flex flex-col p-3 m-2 h-fit bg-black bg-opacity-75 rounded-md'
                >
                    <h1 className='text-4xl sm:text-6xl'>Yuri Corredor</h1>
                    <h3 className='text-xl sm:text-2xl'>Developer</h3>
                </motion.div>
            </motion.div>
        </section>
        </>
    )
}