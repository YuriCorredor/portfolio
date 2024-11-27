import { useEffect, useState } from 'react'

export default function TypeWriter({ words, delay = 100, deleteDelay = 50, pauseDelay = 2000 }) {
    const [text, setText] = useState('')
    const [wordIndex, setWordIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        let timeout

        const type = () => {
            const currentWord = words[wordIndex]
            
            if (isDeleting) {
                setText(prev => prev.slice(0, -1))
                timeout = setTimeout(type, deleteDelay)
                
                if (text === '') {
                    setIsDeleting(false)
                    setWordIndex((prev) => (prev + 1) % words.length)
                }
            } else {
                setText(currentWord.slice(0, text.length + 1))
                timeout = setTimeout(type, text.length === currentWord.length ? pauseDelay : delay)
                
                if (text === currentWord) {
                    setIsDeleting(true)
                }
            }
        }

        timeout = setTimeout(type, delay)
        return () => clearTimeout(timeout)
    }, [text, wordIndex, isDeleting, words, delay, deleteDelay, pauseDelay])

    return <span className="typing-text h-10 text-2xl font-bold">{text}</span>
}
