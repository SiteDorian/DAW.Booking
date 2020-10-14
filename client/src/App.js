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

function App() {
    const [state, setState] = useState({})

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
                    render={() => {
                        let prefix = "/admin"
                        return (
                            <div style={{display: 'flex'}}>
                                <VerticalMenu/>
                                <div className={"AdminWrapper"}>
                                    <Switch>
                                        <Route
                                            path={`${prefix}`} exact={true} component={Dashboard}
                                        />
                                        <Route
                                            path={`${prefix}/blocks`} component={BlocksList}
                                        />
                                        <Route
                                            path={`${prefix}/rooms`} component={RoomsList}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        )
                    }}
                />

                <Route
                    path={"/"}
                    render={() => {
                        return (
                            <>
                                <Header/>
                                <main style={{
                                    // marginTop: '50px'
                                }}>
                                    <Switch>
                                        <Route path={'/'} exact component={Home}/>
                                        <Route path={'/search'} component={Search}/>
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
