import React, {useEffect, useState} from 'react';
import {Switch, Route, withRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Header from "./site/components/Header";
import Home from "./site/components/Home";
import Search from "./site/components/Search";
import VerticalMenu from "./admin/components/VerticalMenu";
import BlocksList from "./admin/components/BlocksList";
import RoomsList from "./admin/components/RoomsList";
import Dashboard from "./admin/components/Dashboard";
import StudentsList from "./admin/components/StudentsList";
import UsersList from "./admin/components/UsersList";
import RequestsList from "./admin/components/RequestsList";
import RezervariList from "./admin/components/RezervariList";
import Game from "./site/components/game";
import Account from "./site/components/Account";
import AdminContainer from "./admin/components/AdminContainer";
import Login from "./admin/components/login";

function App() {
    const [state, setState] = useState({})
    const [email, setEmail] = useState("")

    useEffect(() => {
        callAPI()
    }, [])

    function callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => setState({apiResponse: res}));
    }

    return (
        <div id={"App"} className="App">

            <Switch>
                <Route
                    path={"/admin"}
                    component={AdminContainer}
                />
                <Route
                    path={"/login"}
                    component={Login}
                />

                <Route
                    path={"/"}
                    render={() => {
                        return (
                            <>
                                <Header email={email}/>

                                <main style={{
                                    // marginTop: '50px'
                                }}>
                                    <Switch>
                                        <Route path={'/'} exact component={Home}/>
                                        <Route
                                            path={'/search'}
                                            render={(props) => <Search {...props} email={email} setEmail={setEmail} />}
                                        />
                                        <Route path={'/game'} component={Game}/>

                                        <Route
                                            path={'/account'}
                                            render={(props) => <Account {...props} email={email} />}
                                        />
                                    </Switch>
                                </main>
                            </>
                        )
                    }}
                />
            </Switch>
        </div>
    );
}

export default withRouter(App);
