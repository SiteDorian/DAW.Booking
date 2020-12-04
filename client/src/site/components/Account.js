import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import "./Account.scss"
import axios from "axios"
import moment from "moment"

function Account(props) {
    const history = useHistory()

    const [email, setEmail] = useState(localStorage.getItem('email'))

    const [item, setItem] = useState(null)

    useEffect(() => {
        if (!email) {
            history.push('/')
        }

        axios.get(`${process.env.REACT_APP_API_HOST}/account`, {
            params: {
                email
            }
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status) {
                    setItem({...resp.item})
                }
            })

    }, [])

    return (
        <div className={"AccountContainer"}>
            <div className="section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>My Account</h1>
                        </div>

                        <div className={"col-12 mt-4"}>
                            <div className="card">
                                <h5 className="card-header">{item && item.email}</h5>
                                <div className="card-body">
                                    <h5 className="card-title">Name: <i>{item && item.name || "undefined email"} </i> </h5>

                                    <p>Type: {item && item.type}</p>
                                    <p>Grupa: {item && item.grupa || 'undefined'}</p>
                                    <p>Departament: {item && item.departament || 'undefined'}</p>
                                    <p>Anul: {item && item.year}</p>

                                    <p className="card-text">
                                        Cererile mele:
                                    </p>

                                    <p className="card-text">
                                        Rezervarile mele:
                                    </p>

                                    <ul className={""}>
                                        {item && item.bookings && item.bookings.map && item.bookings.map((booking, key) => (
                                            <li key={key}>
                                                {booking.room.nr}{booking.room.camera}, &nbsp;
                                                {moment(booking.start_date).format("MM/DD/YYYY")} -> {moment(booking.end_date).format("MM/DD/YYYY")}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => {
                                            history.push({
                                                pathname: '/',
                                            })
                                        }}
                                        className="btn btn-primary mt-4"
                                    >
                                        Explore Rooms
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account