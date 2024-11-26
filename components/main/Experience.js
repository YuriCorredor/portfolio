import ExperienceTitle from './experience/ExperienceTitle'
import ExperienceItem from './experience/ExperienceItem'

const experiences = [
    {
        title: "Software Developer",
        company: "Focus NFe",
        location: "Curitiba - PR, Brazil",
        period: "05/2022 to Current",
        achievements: [
            "Through system optimizations, I reduced our AWS costs by more than 15%",
            "Led the development and architectural design of front-end applications, ensuring adherence to UX/UI best practices",
            "Engineered a queuing system, cutting customer wait times by over 40%",
            "Architected and built applications from scratch using cutting-edge technologies such as React and Next.js",
            "Decided and defined communication protocols between services",
            "Authored comprehensive technical documentation, reducing onboarding time for new developers"
        ],
        technologies: ["Python", "Javascript", "Typescript", "Node.js", "Git", "AWS", "React", "Next.js", "Figma", "Excalidraw", "Ruby"]
    },
    {
        title: "Full Stack Developer",
        company: "Autonomous - Freelancer",
        location: "Rio de Janeiro, Brazil",
        period: "03/2022 to 04/2024",
        achievements: [
            "Delivered end-to-end solutions for diverse clients, enhancing business operations and client satisfaction",
            "Developed unique visual identities",
            "Crafted and executed marketing campaigns"
        ],
        technologies: ["React Native", "Javascript", "React", "Next.js", "Node.js", "Express.js", "MongoDB"]
    },
    {
        title: "Partnership Manager",
        company: "FGC",
        location: "Rio de Janeiro, Brazil",
        period: "04/2021 to 03/2022",
        achievements: [
            "Developed and launched an e-commerce platform using Wix, cataloging over 2000 products and increasing sales by 10%",
            "Created a job management app (Job Helper), saving over 20 hours per month in administrative tasks"
        ],
        technologies: ["React Native", "Javascript"]
    }
]

export default function Experience() {
    return (
        <section id="experience" className='flex self-center w-full justify-center items-center overflow-hidden'>
            <div className='max-w-7xl w-full flex flex-col justify-center items-center z-[9999] py-8 sm:py-16 px-4 sm:px-6'>
                <ExperienceTitle />
                <div className='flex flex-col gap-6 sm:gap-8 max-w-4xl w-full'>
                    {experiences.map((exp, index) => (
                        <ExperienceItem
                            key={index}
                            title={exp.title}
                            company={exp.company}
                            location={exp.location}
                            period={exp.period}
                            achievements={exp.achievements}
                            technologies={exp.technologies}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
