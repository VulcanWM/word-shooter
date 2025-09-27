import { useState, useEffect, useCallback, useRef } from 'react'
import { wordList } from './wordList.ts'

type Word = {
    word: string
    top: number
    left: number
}

function App() {
    const [page, setPage] = useState<"Home" | "Game" | "End">("Home")
    const [words, setWords] = useState<Word[]>([])
    const [currentWord, setCurrentWord] = useState("")
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)

    const wordsRef = useRef<Word[]>([])
    useEffect(() => { wordsRef.current = words }, [words])

    const generateWord = useCallback((): Word => ({
        word: wordList[Math.floor(Math.random() * wordList.length)],
        top: Math.random() * 450,
        left: Math.random() * 750,
    }), [])

    function startGame() {
        setPage("Game")
        const startWords = Array.from({ length: 10 }, generateWord)
        setWords(startWords)
        setScore(0)
        setCurrentWord("")
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" || event.key === "Delete") {
                setCurrentWord(prev => prev.slice(0, -1))
                return
            }

            if (event.key === "Enter") {
                setCurrentWord("")
                return
            }

            if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
                const char = event.key
                setCurrentWord(prev => {
                    const newWord = prev + char

                    const matchedWord = wordsRef.current.find(
                        w => w.word.toLowerCase() === newWord.toLowerCase()
                    )

                    if (matchedWord) {
                        setWords(prevWords => {
                            const idx = prevWords.findIndex(w => w.word === matchedWord.word)
                            if (idx === -1) return prevWords // shouldn't happen but safe-guard
                            const next = prevWords.slice(0, idx).concat(prevWords.slice(idx + 1))
                            next.push(generateWord())
                            return next
                        })

                        setScore(s => s + 1)
                        return ""
                    }

                    return newWord
                })
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [generateWord])

    useEffect(() => {
        if (page != "Game") return
        setTimeLeft(60)
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1){
                    clearInterval(interval)
                    setPage("End")
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [page])

    return (
        <>
            {page === "Home" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Word Shooter</h1>
                    <p>Type the words on the screen as fast as you can before the time ends.</p>
                    <button
                        onClick={startGame}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                    >
                        Start Game
                    </button>
                </div>
            )}

            {page === "Game" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Word Shooter</h1>
                    <p className="mt-2 text-lg">Time Left: {timeLeft}s</p>
                    <div className="relative w-[800px] h-[500px] border-2 border-orange-500 rounded-xl">
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
            )}
            {page === "End" && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Word Shooter</h1>
                    <p>Game finished! Your score was {score}</p>
                    <button onClick={startGame}>
                        Play Again
                    </button>
                </div>
            )}
        </>
    )
}

export default App