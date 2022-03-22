import React from "react"

export default function Die(props) {
    const btn = <div className={`face dice${props.die}`}>{pointsFill(props.die)}</div>

    function pointsFill(value) {
        return Array(props.die).fill(<span className="point"> </span>)
    }

    return (
        <div className={props.isHeld ? "die is-held" : "die"} onClick={props.holdDice}>
            {btn}
        </div>
    )
}
