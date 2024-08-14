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
        <section id="projects" className="flex flex-col justify-center items-center w-full mt-8">
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
            <svg className="z-[9999] -mb-[1px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 319"><path fill="#f3f4f6" fillOpacity="1" d="M0,0L36.9,0L73.8,32L110.8,256L147.7,32L184.6,96L221.5,224L258.5,96L295.4,32L332.3,224L369.2,288L406.2,160L443.1,256L480,320L516.9,128L553.8,64L590.8,192L627.7,96L664.6,192L701.5,0L738.5,160L775.4,128L812.3,256L849.2,128L886.2,256L923.1,160L960,0L996.9,128L1033.8,192L1070.8,128L1107.7,256L1144.6,96L1181.5,256L1218.5,192L1255.4,192L1292.3,160L1329.2,32L1366.2,96L1403.1,96L1440,32L1440,320L1403.1,320L1366.2,320L1329.2,320L1292.3,320L1255.4,320L1218.5,320L1181.5,320L1144.6,320L1107.7,320L1070.8,320L1033.8,320L996.9,320L960,320L923.1,320L886.2,320L849.2,320L812.3,320L775.4,320L738.5,320L701.5,320L664.6,320L627.7,320L590.8,320L553.8,320L516.9,320L480,320L443.1,320L406.2,320L369.2,320L332.3,320L295.4,320L258.5,320L221.5,320L184.6,320L147.7,320L110.8,320L73.8,320L36.9,320L0,320Z"></path></svg>
        </section>
    )
}
