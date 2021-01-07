import React, {useState} from "react";
import VerticalMenu from "./VerticalMenu";
import {Route, Switch, withRouter} from "react-router-dom";
import Dashboard from "./Dashboard";
import BlocksList from "./BlocksList";
import RoomsList from "./RoomsList";
import RequestsList from "./RequestsList";
import RezervariList from "./RezervariList";
import UsersList from "./UsersList";
import StudentsList from "./StudentsList";
import Login from "./login";
import axios from 'axios';

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        config.headers.authorization = `Bearer ${token}`;
        return config
    },
    error => {
        console.log('error axios')
        return Promise.reject(error);
    }
);

function AdminContainer({history}) {
    const storedJwt = localStorage.getItem('token');
    const [jwt, setJwt] = useState(storedJwt || null);

    let prefix = "/admin"

    if (!jwt) {
        history.push('/login')
        // return (
        //     <Login/>
        // )
    }

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
                    <Route
                        path={`${prefix}/requests`} component={RequestsList}
                    />
                    <Route
                        path={`${prefix}/bookings`} component={RezervariList}
                    />
                    <Route
                        path={`${prefix}/users`} component={UsersList}
                    />
                    <Route
                        path={`${prefix}/students`} component={StudentsList}
                    />
                </Switch>
            </div>
        </div>
    )
}

export default withRouter(AdminContainer)