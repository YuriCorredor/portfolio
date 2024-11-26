import SkillsItem from '../main/skills/SkillsItem'
import { SiNextdotjs, SiTailwindcss, SiThreedotjs, SiFramer } from 'react-icons/si'

const techs = [
    {
        name: 'NEXTJS',
        Icon: SiNextdotjs,
        color: 'black'
    },
    {
        name: 'TAILWINDCSS',
        Icon: SiTailwindcss,
        color: 'black'
    },
    {
        name: 'THREEJS',
        Icon: SiThreedotjs,
        color: 'black'
    },
    {
        name: 'MOTION',
        Icon: SiFramer,
        color: 'black'
    }
]

export default function Footer() {
    return (
        <footer className="relative bg-white w-full">
            <div className="flex flex-col items-center z-[9999] pb-2 sm:pb-2 p-2 sm:p-8 relative bg-gray-100 w-full">
                <div className="w-full justify-center items-center max-w-7xl flex flex-col p-2 sm:p-8">
                    <h1 className="text-3xl font-bold text-center">How this website was built</h1>
                    <div className="flex flex-col flex-wrap max-w-5xl font-semibold p-2 pt-8 pb-8">
                        <p>You can find the full source code for this website on my GitHub repository.
                            To give you a quick overview of how it was developed, I'll explain some of the
                            key technologies and decisions that went into building it. As I mentioned earlier,
                            my portfolio was inspired by the book "Project Hail Mary" by Andy Weir,
                            so I decided to make it space-themed.
                        </p>
                        <p>For the project, I used the following technologies:</p>
                        <div className="flex flex-wrap flew-col justify-center gap-2 my-6">
                            {techs.map((tech, index) => <SkillsItem key={index} name={tech.name} Icon={tech.Icon} color={tech.color} nameColor="text-black" />)}
                        </div>
                        <p>
                            Other dependencies used in the project include "react-intersection-observer"
                            and "react-icons". If you're interested in seeing all of the dependencies,
                            I encourage you to check out the source code on GitHub.
                        </p>
                        <br />
                        <p>I prefer using Next.js over plain React, but the project doesn't really need it and
                            I'm not taking full advantage of its capabilities. Why TAILWIND? I find that using Tailwind
                            speeds up my development process and that's the main reason I chose it. Three.js
                            was used to render the stars geometries in the background and the little
                            astronaut that can be seen at the beginning. I had planned on using more 3D
                            objects on the scene, but I wanted to make sure the website would be accessible
                            even on devices without a powerful GPU. That's why the astronaut is low-poly and
                            there aren't many 3D objects.
                        </p>
                        <p>
                            Framer Motion was used to animate the DOM elements. The library
                            react-intersection-observer was used to detect when an object came into view,
                            so I could trigger animations with Framer Motion.
                        </p>
                    </div>
                </div>
                <div className="flex w-full justify-center border-t-[1px] border-black">
                    <p className="p-2 pt-3 text-xs text-bold">© Copyright | Yuri Corredor </p>
                </div>
            </div>
        </footer>
    )
}
