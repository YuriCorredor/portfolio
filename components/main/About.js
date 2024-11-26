import { useEffect, useRef, useState } from "react"
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation } from 'framer-motion'
import {
    SiMongodb,
    SiNextdotjs,
    SiPython,
    SiPostgresql,
    SiTailwindcss,
    SiReact,
    SiHtml5,
    SiCss3,
    SiGit,
    SiThreedotjs,
    SiTypescript,
    SiAmazonaws,
    SiRuby,
    SiAmazondynamodb,
} from 'react-icons/si'
import { TbBrandGolang } from 'react-icons/tb'
import SkillsItem from './skills/SkillsItem'

const skills = [
    {
        name: 'typescript',
        Icon: SiTypescript,
        color: '#3178C6'
    },
    {
        name: 'python',
        Icon: SiPython,
        color: '#346998'
    },
    {
        name: 'ruby',
        Icon: SiRuby,
        color: '#CC342D'
    },
    {
        name: 'golang',
        Icon: TbBrandGolang,
        color: '#00ADD8'
    },
    {
        name: 'aws',
        Icon: SiAmazonaws,
        color: '#FF9900'
    },
    {
        name: 'dynamodb',
        Icon: SiAmazondynamodb,
        color: '#4053D6'
    },
    {
        name: 'mongodb',
        Icon: SiMongodb,
        color: '#359e40'
    },
    {
        name: 'postgresql',
        Icon: SiPostgresql,
        color: '#336791'
    },
    {
        name: 'nextjs',
        Icon: SiNextdotjs,
        color: 'white'
    },
    {
        name: 'tailwind',
        Icon: SiTailwindcss,
        color: '#35b3eb'
    },
    {
        name: 'react',
        Icon: SiReact,
        color: '#5ad2ea'
    },
    {
        name: 'html',
        Icon: SiHtml5,
        color: '#e6640a'
    },
    {
        name: 'css',
        Icon: SiCss3,
        color: '#2760e5'
    },
    {
        name: 'git',
        Icon: SiGit,
        color: '#f24c2d'
    },
    {
        name: 'threejs',
        Icon: SiThreedotjs,
        color: 'white'
    }
]

const divVariants = {
    hidden: {
      scale: 1.25,
      opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.75
        }
    }
}

export default function About() {
    const imgRef = useRef()
    const titleRef = useRef()
    const [alreadySeen, setAlreadySeen] = useState(false)
    const controls = useAnimation()
    const { ref, inView } = useInView()

    const parallax = e => {
        if (imgRef && titleRef) {
            const y = (e.clientY * -1) / 100
            const x = (e.clientX * -1) / 100
            imgRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`
            titleRef.current.style.transform = `translateX(${-x}px) translateY(${-y}px)`
        }
    }

    useEffect(() => {
        if (inView) {
            controls.start('visible')
            setAlreadySeen(true)
        }
        if (!inView && !alreadySeen) {
            controls.start('hidden')
        }
    }, [controls, inView])

    useEffect(() => {
        window.addEventListener('mousemove', parallax, false)
        return () => {
            window.removeEventListener('mousemove', parallax, false)
        }
    }, [])

    return (
        <>
            <section id="about" className="min-h-screen w-full flex items-center justify-center py-20 overflow-hidden">
                <div className="max-w-7xl w-full text-white z-[9999] px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="md:w-1/2 space-y-6"
                        >
                            <h1 ref={titleRef} className="text-4xl sm:text-6xl text-white font-home font-bold pb-6 sm:pb-8">
                                ABOUT ME
                            </h1>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Full-Stack Developer skilled in building scalable web and mobile applications, with expertise in React, Next.js, Node.js,
                                Python, and AWS. Proven success in cutting costs, reducing wait times, and enhancing user experiences. Adept at
                                end-to-end development, system optimization, and creating impactful technical solutions. Passionate about leveraging
                                technology to solve real-world problems.
                            </p>
                            <motion.div
                                ref={ref}
                                variants={divVariants}
                                initial='hidden'
                                animate={controls}
                                className='flex flex-wrap gap-2 pt-4'
                            >
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <SkillsItem
                                            Icon={skill.Icon}
                                            name={skill.name}
                                            color={skill.color}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="md:w-1/2 flex justify-center"
                        >
                            <div className="relative">
                                <img
                                    alt="astronaut"
                                    ref={imgRef}
                                    className="relative rounded-lg shadow-2xl"
                                    width={400}
                                    src="astronaut.jpg"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}
