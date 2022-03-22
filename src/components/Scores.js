import React from "react"

export default function Scores() {
    let scores
    if (!localStorage.getItem("tenzies-score")) {
        scores = <p>No results</p>
    } else {
        const score = JSON.parse(localStorage.getItem("tenzies-score"))
        scores = score.map(sc => <div className="scores-list"><p>{sc.count}</p><p>{sc.time[0]}m {sc.time[1]}s</p></div>)
    }
    return (
        <div>
            {scores}
        </div>


    )
}