import React, {useEffect, useState} from "react";
import axios from "axios"
import "./Search.scss"


function Search(props) {
    const [state, setState] = useState({})
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        let _state = props.location && props.location.state || {}
        setState({..._state})
    }, [])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/rooms`, {
            params: {
                ...state
            }
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setRooms([...resp.data])
                console.log("resp", resp.data)
            })
    }, [state])

    console.log("state", state)


    return (
        <div className="SearchContainer" id={"search"}>
            <div className="section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1>Available Rooms</h1>
                        </div>

                        <div className="col-12">
                            <h5>
                                Blocul nr.{state.block || "<i> undefined block number</i>"}
                                <span> Studentilor Street 10/2</span>
                            </h5>
                        </div>

                        <div className="col-12 pt-5">

                            {rooms && rooms.map && rooms.map((item, key) => {
                                return (
                                    <RoomCard
                                        key={key}
                                        room={item}
                                    />
                                )
                            })}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RoomCard({room = {}}) {

    return (
        <div className="card d-inline-flex mr-4 mb-5" style={{width: '18rem'}}>
            <div className="card-body">
                <h5 className="card-title">Room nr. {room.nr || 'undefined'} {room.camera || ""}</h5>
                <p className="card-text mb-0">Etaj: {room.etaj}</p>
                <p className="card-text">Blocul: {room.block_id}</p>
                <p className="card-text">0 din {room.capacity || "0"}</p>
                <a href="#" className="btn btn-outline-info mr-2">View details</a>
                <a href="#" className="btn btn-outline-primary">Send request</a>
            </div>
        </div>
    )
}

export default Search