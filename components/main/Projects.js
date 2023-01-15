import ProjectItem from "./projects/ProjectItem"
import { useMediaQuery } from "../../lib/useMediaQuery"
import ProjectsTitle from "./projects/ProjectsTitle"

const projects = [
    {
        link: 'https://spotify-clone-yuri-corredor.vercel.app/',
        color: '#1ed760',
        title: "SPOTIFY 2.0 (clone)",
        description: "I have used the Spotify API to replicate the Spotify web app's interface and some of its key features. Due to limitations in the API, it is necessary to have a Spotify Premium subscription and a Spotify-enabled device to use the clone.",
        techs: [
            'Next.js',
            'NextAuth.js',
            'Tailwind',
            'Spotify Api',
            'Recoil'
        ],
        gitLink: 'https://github.com/YuriCorredor/spotify-clone',
        bgPath: '/spotify.jpg'
    },
    {
        link: 'https://front-end-challenge-lac.vercel.app/',
        color: '#5c16c5',
        title: "SEARCH TOP MOVIES",
        description: "Using the TMDB API, I developed a dynamic website that allows users to search for movies using various filters. The website consumes the API and utilizes server-side rendering for improved performance and user experience.",
        techs: [
            'Next.js',
            'React',
            'React-icons',
            'Tailwind',
            'TMDB API'
        ],
        gitLink: 'https://github.com/YuriCorredor/search-top-movies',
        bgPath: '/movies.jpg'
    },
    {
        link: 'https://fablec-site.vercel.app/',
        color: '#FF7A00',
        title: "FABLEC",
        description: "I was initially contracted to execute a marketing campaign for a company, however, they subsequently extended the contract and requested that I develop a simple website to showcase their services. This is the outcome of that request.",
        techs: [
            'Next.js',
            'Nodemailer',
            'Tailwind',
            'Yup',
            'Formik'
        ],
        gitLink: 'https://github.com/YuriCorredor/fablec',
        bgPath: '/fablec.jpg'
    },
    {
        link: null,
        color: '#007FE3',
        title: "CHAT APP",
        description: "This app was developed using Facebook's React Native technology, and serves as a case study for learning real-time communication between users. It utilizes React Native for the front-end and a Python-based backend built with the Flask framework.",
        techs: [
            'React-native',
            'Redux',
            'Socket.io',
            'Python',
            'Flask',
            'SQLAlchemy',
            'Expo'
        ],
        gitLink: 'https://github.com/YuriCorredor/chat-app',
        bgPath: '/chat.jpg'
    },
]

export default function Projects() {
    const md = useMediaQuery(768)

    return (
        <section id="projects" className="flex justify-center items-center w-full mt-8">
            <div className="max-w-7xl w-full flex flex-col justify-center items-center z-[9999] mt-14 overflow-hidden">
                <ProjectsTitle />
                {projects.map((project, index) => <ProjectItem 
                    key={index}
                    link={project.link}
                    color={project.color}
                    title={project.title}
                    description={project.description}
                    techs={project.techs}
                    gitLink={project.gitLink}
                    bgPath={project.bgPath}
                    index={index}
                    md={md}
                />)}
            </div>
        </section>
    )
}