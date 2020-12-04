import React, {useState} from "react";
import "./Home.css"
import { useHistory } from 'react-router-dom';

function Home() {
    const [state, setState] = useState({block: 1, guests: 1, email: localStorage.getItem("email") || ""})
    const history = useHistory();

    function onChange(e) {
        setState({ ...state, [e.target.name]: e.target.value } )
    }

    function handleSubmit(event) {
        event.preventDefault();

        history.push({
            pathname: '/search',
            state: {
                ...state
            }
        })
    }

    console.log("state", state)

    return (
        <div>
            <div id="booking" className="section">
                <div className="section-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 col-md-push-5">
                                <div className="booking-cta">
                                    <h1>Book your room Now!</h1>
                                    <p>Posibilitatea de a-ți alege camera după dorințele tale este chiar aici!
                                        Facultatea noastră îți oferă posibilitatea de a te simți ca acasă la km
                                        distanță. Nu rata șansa să îți bronzezi camera îndrăgită împreună cu cea mai
                                        buna prietenă chiar acum! Accesează pagina noastră pentru a fi informat despre
                                        locurile libere și accesează pozele camerelor!
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4 col-md-pull-7">
                                <div className="booking-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <span className="form-label">Your student corporative email address</span>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Email"
                                                name={"email"}
                                                value={state.email || ""}
                                                onChange={onChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <span className="form-label">Select your block</span>
                                            <select
                                                className="form-control"
                                                id={"block"}
                                                name={"block"}
                                                value={state.block || ""}
                                                onChange={onChange}
                                            >
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                            </select>
                                        </div>

                                        <div className="row no-margin">
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <span className="form-label">Check In</span>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        required
                                                        name={"start_date"}
                                                        value={state.start_date || ""}
                                                        onChange={onChange}
                                                    />
                                                </div>
                                                <span className="in-out hidden-xs">&#8652;</span>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <span className="form-label">Check out</span>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        required
                                                        name={"end_date"}
                                                        value={state.end_date || ""}
                                                        onChange={onChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <span className="form-label">Guests</span>
                                                    <select
                                                        className="form-control"
                                                        name={"guests"}
                                                        value={state.guests || 1}
                                                        onChange={onChange}
                                                    >
                                                        <option value={1}>1</option>
                                                        <option value={2}>2</option>
                                                        <option value={3}>3</option>
                                                        <option value={4}>4</option>
                                                    </select>
                                                    <span className="select-arrow"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-btn">
                                            <button
                                                type={"submit"}
                                                className="submit-btn">
                                                Check availability
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home