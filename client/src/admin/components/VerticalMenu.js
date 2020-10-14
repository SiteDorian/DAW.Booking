import React from "react";
import "./VerticalMenu.scss"
import {withRouter, Link} from "react-router-dom";

function VerticalMenu(props) {

    return (
        <div className={"VerticalMenu"}>
            <ul className="nav flex-column">
                <li className="nav-item mb-4">
                    <a
                        className="navbar-brand brand-container pointer"
                        onClick={() => props.history.push("/admin")}
                    >
                        <span>
                            DAW.Booking Admin
                        </span>
                    </a>
                </li>
                <li className="nav-item">
                    <Link to={"/admin/blocks"} className={"nav-link"}>Blocuri</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/rooms">Camere</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/requests">Cereri</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/bookings">Rezervari</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/admin/users">Users</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link disabled" to="#">Studenti</Link>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(VerticalMenu)