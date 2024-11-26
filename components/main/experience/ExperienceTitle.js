import { motion } from 'framer-motion'

const titleVariants = {
    hidden: {
        opacity: 0,
        y: 100
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut'
        }
    }
}

export default function ExperienceTitle() {
    return (
        <motion.h1
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className='text-4xl sm:text-6xl text-white font-home font-bold pb-6 sm:pb-8'
        >
            EXPERIENCE
        </motion.h1>
    )
}
