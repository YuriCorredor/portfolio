import { motion } from 'framer-motion'
import { BsBriefcase } from 'react-icons/bs'

const itemVariants = {
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

export default function ExperienceItem({ title, company, location, period, achievements, technologies, index }) {
    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50"
            style={{ transitionDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <BsBriefcase className="text-xl sm:text-2xl text-gray-300 mt-1 sm:mt-0" />
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-home">{title}</h3>
                    <p className="text-sm sm:text-base text-gray-300">{company}</p>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-1 sm:mb-2">{location}</p>
            <p className="text-sm text-gray-400 mb-3 sm:mb-4">{period}</p>
            <ul className="list-disc list-inside mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                {achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-300">{achievement}</li>
                ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {technologies.map((tech, i) => (
                    <span key={i} className="px-2 sm:px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors">
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}
