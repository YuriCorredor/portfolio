import { useEffect, useRef, useState } from 'react'
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
        y: 100,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8
        }
    }
}

export default function Skills() {

    const [alreadySeen, setAlreadySeen] = useState(false)
    const controls = useAnimation()
    const { ref, inView } = useInView()
    const titleRef = useRef()
    const skillsDivRef = useRef()

    const parallax = e => {
        if (skillsDivRef && titleRef) {
            const y = (e.clientY * -1) / 100
            const x = (e.clientX * -1) / 100
            titleRef.current.style.transform = `translateX(${-x}px) translateY(${-y}px)`
            skillsDivRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`
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
        <section id="skills" className='flex self-center w-full justify-center items-center'>
            <motion.div variants={divVariants} initial='hidden' animate={controls} className='flex max-w-7xl w-full flex-col justify-center items-center z-[9999] mt-8'>
                <h1 ref={titleRef} className='font-home font-bold text-4xl sm:text-6xl text-white'>SKILLS</h1>
                <div ref={skillsDivRef}>
                    <div ref={ref} className='p-4 py-8 flex justify-center items-center flex-wrap max-w-3xl font-home text-white'>
                        {skills.map((skill, index) => <SkillsItem 
                            key={index} 
                            Icon={skill.Icon} 
                            name={skill.name} 
                            color={skill.color} 
                        />)}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
