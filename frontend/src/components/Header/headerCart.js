import { useEffect } from "react"
import './header.css'

const HeaderCart = (props) => {

    useEffect(() => {
    }, [props])

    return (
        <span id="cartItem"> {props.items} </span>
    )
}

export default HeaderCart