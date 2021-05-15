import React from "react";
import {useHistory} from 'react-router-dom';

function Header(props) {
    const history = useHistory()

    const email = localStorage.getItem("email")

    return (
        <header>
            <nav className="navbar fixed-top navbar-light bg-light">
                <a className="navbar-brand" href="/">DAWG.Booking</a>

                <span
                    className="navbar-text"
                    onClick={() => {
                        history.push("/account")
                    }}
                    style={{cursor: 'pointer'}}
                >
                    {props.email || email || ""}
                </span>

            </nav>
        </header>
    )
}

export default Header