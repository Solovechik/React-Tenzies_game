import React, {useState, useEffect} from 'react'
import Die from "./components/Die";
import {nanoid} from 'nanoid'
import Conf from "./components/Confetti";
import Scores from "./components/Scores";

export default function App() {

    const [dices, setDices] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [counter, setCounter] = useState(0)
    const [timer, setTimer] = useState(null)
    const [mins, setMins] = useState(0)
    const [scoreList, setScoreList] = useState(false)

    useEffect(() => {
        let allHeld = dices.every(die => die.isHeld)
        let allEqual = dices.every(die => die.value === dices[0].value)
        if (allHeld && allEqual) {
            setTenzies(true)
        }
    }, [dices])

    useEffect(() => {
        if (!tenzies && timer !== null) {
            setTimeout(() => setTimer(time => time + 1), 1000)
        }
        if (timer === 59) {
            setMins(min => min + 1)
        }
    }, [tenzies, timer])

    function startTimer() {
        if (timer === null) {
            setTimer(0)
        }
    }

    function allNewDice() {
        let newDices = []
        for (let i = 0; i < 10; i++) {
            newDices.push({
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            })
        }
        return newDices
    }

    function rollDice() {
        if (tenzies) {
            setTenzies(false)
            setDices(allNewDice())
            setCounter(0)
            setTimer(null)
            setMins(0)
            saveScore()
        } else {
            setDices(oldDices => oldDices.map(oldDie =>
                oldDie.isHeld ? oldDie : {...oldDie, value: Math.ceil(Math.random() * 6)}))
            setCounter(counter => counter + 1)
            startTimer()
        }
    }

    function holdDice(id) {
        setDices(oldDices => oldDices.map(oldDie =>
            (id === oldDie.id ? {...oldDie, isHeld: !oldDie.isHeld} : oldDie)
        ))
        if (!tenzies) {
            startTimer()
        }
    }

    function showScores() {
        setScoreList(score => !score)
    }

    function saveScore() {
        const score = localStorage.getItem("tenzies-score") ? JSON.parse(localStorage.getItem("tenzies-score")) : []
        score.push({count: counter, time: [mins, timer]})
        localStorage.setItem("tenzies-score", JSON.stringify(score))
    }

    const renderDices = dices.map(die => (
        <Die
            key={die.id}
            die={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />))

    return (
        <main>
            {tenzies && <Conf/>}
            <div className="app">
                <h1>Tenzies</h1>
                <h4>Roll until all dice are the same. Click each die to freeze it at its current value between
                    rolls.</h4>
                <div className="dices-container">
                    {renderDices}
                </div>
                <div className="button-container">
                    <div className="counter">Tries<p>{counter}</p></div>
                    <button className="roll-btn" onClick={rollDice}>{tenzies ? "New game" : "Roll"}</button>
                    <div className="counter">Time
                        <p>{mins}:{timer === null ? '00' : timer === 60 ? setTimer(0) : timer.toString().padStart(2, '0')}</p>
                    </div>
                </div>
                <div className="scores">
                    <button className="scores-btn" onClick={showScores}>Show scores</button>
                    <button className="scores-btn" onClick={() => localStorage.clear()}>Clear scores</button>
                </div>
                {scoreList && <Scores/>}
            </div>
        </main>
    )
}