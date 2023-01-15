import { useEffect, useRef } from "react"

export default function About() {
    const imgRef = useRef()
    const titleRef = useRef()

    const parallax = e => {
        if (imgRef && titleRef) {
            const y = (e.clientY * -1) / 100
            const x = (e.clientX * -1) / 100
            imgRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`
            titleRef.current.style.transform = `translateX(${-x}px) translateY(${-y}px)`
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', parallax, false)
        return () => {
            window.removeEventListener('mousemove', parallax, false)
        }
    }, [])

    return (
        <section id="about" className="my-16 w-full flex items-center justify-center">
            <div className="max-w-7xl text-white z-[9999]">
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start overflow-hidden">
                    <img alt="astronaut" ref={imgRef} className="order-2 md:order-1" width={280} src="astronaut.jpg"/>
                    <div className="order-1 md:order-2 ">
                        <h1 ref={titleRef} className="text-center font-home p-6 md:p-12 pt-0 px-2 text-4xl sm:text-6xl font-bold">ABOUT ME</h1>
                        <p className="px-4 sm:px-16 pb-8 font-bold">
                        I am an ambitious software developer with a passion for learning new 
                        skills and staying up-to-date with the latest technologies. I have a 
                        strong focus on application security and automation, and I am experienced 
                        in building web and mobile apps using React and React Native. I bring a 
                        positive attitude and a wide range of powerful skills to every project. 
                        In my free time, I enjoy reading science fiction books, and it was the 
                        inspiration from reading Andy Weir's "Project Hail Mary" that led me to 
                        create my personal portfolio.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}