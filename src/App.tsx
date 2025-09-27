import { useState, useEffect } from 'react'
import { wordList } from './wordList.ts'

function App() {
    // generate initial words
    const generateWord = () => ({
        word: wordList[Math.floor(Math.random() * wordList.length)],
        top: Math.random() * 450, // keep inside container
        left: Math.random() * 750,
    })

    const startWords = Array.from({ length: 10 }, generateWord)

    const [words, setWords] = useState(startWords)
    const [currentWord, setCurrentWord] = useState("")
    const [score, setScore] = useState(0)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Delete") {
                setCurrentWord(prev => prev.slice(0, -1))
            } else if (event.key === "Enter") {
                setCurrentWord("")
            } else if (event.key.length === 1) {
                // only add actual characters
                setCurrentWord(prev => {
                    const newWord = prev + event.key

                    const matchedWord = words.find(w => w.word === newWord)
                    if (matchedWord) {
                        setWords(prevWords => {
                            // remove matched + add a new random word
                            return [
                                ...prevWords.filter(w => w.word !== matchedWord.word),
                                generateWord()
                            ]
                        })
                        setScore(prev => prev + 1)
                        return ""
                    }

                    return newWord
                })
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [words])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Word Shooter</h1>
            <div className="relative w-[800px] h-[500px] border-2 border-orange-500 rounded-xl bg-white">
                {words.map((w, i) => (
                    <span
                        key={i}
                        className="absolute text-black font-semibold"
                        style={{ top: `${w.top}px`, left: `${w.left}px` }}
                    >
                        {w.word}
                    </span>
                ))}
            </div>
            <p className="mt-4 text-lg">Score: {score}</p>
            <p>Current Word: {currentWord === "" ? "No Word" : currentWord}</p>
        </div>
    )
}

export default App
