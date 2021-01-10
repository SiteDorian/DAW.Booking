import React, {useState} from "react";
import "./index.scss"
import axios from "axios";
import {withRouter} from "react-router-dom";

function Login({history}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)


    const performLogin = () => {
        axios.post(`${process.env.REACT_APP_API_HOST}/login`, {
            username: username || '',
            password: password || ''
        }).then(resp => {
            const {
                data
            } = resp

            if (data.accessToken) {
                setError(null)
                localStorage.setItem('token', data.accessToken);
                history.push('/admin')
            } else {
                setError(data || 'error')
            }
            console.log('data', data)
        })

        // localStorage.setItem('token', data.token);
    };

    return (
        <div
            className={"d-flex mx-auto LoginContainer"}
            style={{
                minHeight: '90vh',
            }}
        >

            <div className="wrapper fadeInDown">
                <div id="formContent">

                    <div className="fadeIn first">
                        <img src="https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_business-512.png" id="icon" alt="User Icon"/>
                    </div>

                    <form>
                        <input
                            type="text" id="login" className="fadeIn second" name="login" placeholder="login"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                        />
                        <input
                            type="text"
                            id="password" className="fadeIn third" name="login"
                            placeholder="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                        />
                        {error && (
                            <div className={"error text-danger"}>
                                <span>{error}</span>
                            </div>
                        )}
                        <input
                            type="submit" className="fadeIn fourth" value="Log In"
                            onClick={event => {
                                event.preventDefault()
                                performLogin()
                            }}
                        />
                    </form>

                    <div id="formFooter">
                        <a className="underlineHover" href="#">Forgot Password?</a>
                    </div>

                </div>
            </div>

        </div>
    )
}


export default withRouter(Login)