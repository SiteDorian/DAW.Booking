import React from "react";
import {FaHome} from "react-icons/fa"

function Dashboard() {

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1 className={"d-flex align-items-center"}>
                        <FaHome className={"mr-2"}/>
                        Dashboard
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Dashboard