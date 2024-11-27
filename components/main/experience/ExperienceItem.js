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
            className="bg-black/60 backdrop-blur-md rounded-lg p-4 sm:p-6 hover:bg-black/70 transition-all duration-300 border border-white/5 shadow-2xl"
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
            <div className="flex flex-wrap gap-2">
                {technologies.map((tech, i) => (
                    <div key={i} className="group relative">
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/70 transition-all duration-300 border border-white/5 shadow-2xl">
                            <span className="text-sm text-gray-300 capitalize">{tech}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
