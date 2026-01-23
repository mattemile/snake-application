import { useState, useEffect, useCallback, useRef } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

// Messaggio completo da rivelare parola per parola (personalizza questo!)
//const FULL_MESSAGE = "Non scrivo 'imparo in fretta'... te lo dimostro con questo gioco. Risolvo problemi reali con codice che funziona. Sono curioso, pratico e mi diverto a creare. Se cerchi qualcuno che fa, non solo che dice: eccomi! 🚀"

const FULL_MESSAGE = "Dai, ci siamo quasi… sta per emergere chi sono davvero! Spero che il giochino ti sia piaciuto! Sono una persona curiosa, pragmatica e mi diverto a creare: un profilo full-stack alla ricerca di nuovi stimoli professionali. Premessa importante: se state cercando una persona “da consulenza” o del tipo “abbiamo sempre fatto così, perché dovremmo cambiare stack?”, probabilmente non faccio al caso vostro. Mi sento molto più a mio agio in contesti startup e prodotto, dove si sperimenta, si migliora e ci si prende responsabilità reali. Vi ho conosciuti tramite LinkedIn e sono rimasto colpito dalla vostra realtà."
// Dividi in parole
const WORDS = FULL_MESSAGE.split(' ')
const TARGET_MOVES = 15 // Numero di cibi da mangiare per vincere
const WORDS_PER_FOOD = Math.ceil(WORDS.length / TARGET_MOVES) // Parole rivelate per ogni cibo

const getRandomPosition = (snake) => {
  let position
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y))
  return position
}

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 10 })
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [wordsRevealed, setWordsRevealed] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  const directionRef = useRef(direction)
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood({ x: 15, y: 10 })
    setDirection({ x: 1, y: 0 })
    setGameOver(false)
    setScore(0)
    setWordsRevealed(0)
    setGameWon(false)
    setGameStarted(true)
  }

  const changeDirection = useCallback((newDir) => {
    const current = directionRef.current
    // Previeni inversione di direzione
    if (newDir.x !== -current.x || newDir.y !== -current.y) {
      setDirection(newDir)
    }
  }, [])

  // Controlli tastiera
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver || gameWon) return

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          changeDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          changeDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          changeDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          changeDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, gameWon, changeDirection])

  // Controlli touch per mobile
  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e) => {
    if (!gameStarted || gameOver || gameWon) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }

    const diffX = touchEnd.x - touchStart.current.x
    const diffY = touchEnd.y - touchStart.current.y

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Movimento orizzontale
      if (diffX > 30) changeDirection({ x: 1, y: 0 })
      else if (diffX < -30) changeDirection({ x: -1, y: 0 })
    } else {
      // Movimento verticale
      if (diffY > 30) changeDirection({ x: 0, y: 1 })
      else if (diffY < -30) changeDirection({ x: 0, y: -1 })
    }
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE
        }

        // Controlla collisione con se stesso
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Controlla se ha mangiato il cibo
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 1
          setScore(newScore)

          // Rivela nuove parole (più parole per ogni cibo mangiato)
          const newWordsRevealed = Math.min(newScore * WORDS_PER_FOOD, WORDS.length)
          setWordsRevealed(newWordsRevealed)

          // Controlla vittoria (dopo TARGET_MOVES cibi)
          if (newScore >= TARGET_MOVES) {
            setGameWon(true)
            return newSnake
          }

          setFood(getRandomPosition(newSnake))
          return newSnake // Non rimuove la coda = cresce
        }

        newSnake.pop() // Rimuove la coda
        return newSnake
      })
    }

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED)
    return () => clearInterval(gameInterval)
  }, [gameStarted, gameOver, gameWon, food, score])

  return (
    <div className="game-container">
      <h1 className="title">🐍 HR - Mileva Application</h1>
      <p className="subtitle">Mangia per scoprire perché dovresti valutarmi!</p>

      <div className="score">Progresso: {score} / {TARGET_MOVES}</div>

      <div
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {!gameStarted && !gameOver && !gameWon && (
          <div className="overlay">
            <button className="start-btn" onClick={resetGame}>
              ▶️ Inizia a Giocare
            </button>
            <p className="instructions">
              🖥️ Frecce o WASD<br/>
              📱 Swipe per muoverti
            </p>
          </div>
        )}

        {gameOver && (
          <div className="overlay game-over">
            <h2>💀 Game Over!</h2>
            <p>Hai sbloccato {score} / {TARGET_MOVES} parti del messaggio</p>
            <button className="start-btn" onClick={resetGame}>
              🔄 Riprova
            </button>
          </div>
        )}

        {gameWon && (
          <div className="overlay game-won">
            <h2>🎉 Hai Vinto!</h2>
            <p>Messaggio completo sbloccato!</p>
            <button className="start-btn" onClick={resetGame}>
              🔄 Gioca ancora
            </button>
          </div>
        )}

        {snake.map((segment, index) => (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`snake-segment ${index === 0 ? 'head' : ''}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2
            }}
          />
        ))}

        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2
          }}
        />
      </div>

      {/* Controlli mobile */}
      <div className="mobile-controls">
        <button onClick={() => changeDirection({ x: 0, y: -1 })}>⬆️</button>
        <div className="horizontal-controls">
          <button onClick={() => changeDirection({ x: -1, y: 0 })}>⬅️</button>
          <button onClick={() => changeDirection({ x: 1, y: 0 })}>➡️</button>
        </div>
        <button onClick={() => changeDirection({ x: 0, y: 1 })}>⬇️</button>
      </div>

      {/* Messaggio rivelato */}
      <div className="messages-container">
        <h3>📜 La mia risposta:</h3>
        <div className="messages">
          <p className="message-text">
            {WORDS.map((word, index) => (
              <span
                key={index}
                className={index < wordsRevealed ? 'word revealed' : 'word hidden'}
              >
                {word}{' '}
              </span>
            ))}
          </p>
          {wordsRevealed === 0 && (
            <p className="placeholder">Gioca per scoprire...</p>
          )}
        </div>
      </div>
    </div>
  )
}
