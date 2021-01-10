import React, {useEffect, useState} from "react";
import axios from "axios"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import "./Search.scss"
import {useHistory} from 'react-router-dom';

function Search(props) {
    const [state, setState] = useState({})
    const [rooms, setRooms] = useState([])
    const [user, setUser] = useState({})

    const [modal, setModal] = useState(false);
    const [roomId, setRoomId] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const toggle = ({room = null}) => {
        setModal(!modal)
        if (room)
            setSelectedRoom({...room})
    };

    const history = useHistory()

    useEffect(() => {
        let _state = props.location && props.location.state || {}
        if (!_state.email) {
            history.push('/')
        } else {
            props.setEmail(_state.email)
            localStorage.setItem("email", _state.email)
        }
        setState({..._state})
    }, [])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/account`, {
            params: {
                email: props.email
            }
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status) {
                    setUser({...resp.item})
                }
            })
    }, [props.email])

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


    const handleSendRequest = ({room_id = null, user_id=null, start_date = null, end_date = null}) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/create-request`, {
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
    }

    const handleBookNow = ({room_id = null, user_id=null, start_date = null, end_date = null}) => {
        axios.post(`${process.env.REACT_APP_API_HOST}/create-booking`, {
            room_id, user_id, start_date, end_date
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status) {
                    history.push("/account")
                }
            })
    }

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
                                        toggle={() => toggle({room: item})}
                                        handleBookNow={() => handleBookNow({
                                            user_id: user.id,
                                            room_id: item.id,
                                            start_date: state.start_date,
                                            end_date: state.end_date,
                                        })}
                                        startDate={state.start_date}
                                        endDate={state.end_date}
                                    />
                                )
                            })}


                        </div>
                    </div>
                </div>
            </div>

            {selectedRoom && (
                <DetailsModal
                    toggle={toggle}
                    handleBookNow={handleBookNow}
                    selectedRoom={selectedRoom}
                    modal={modal}
                    startDate={state.start_date}
                    endDate={state.end_date}
                />
            )}


        </div>
    )
}

function DetailsModal({toggle, handleBookNow, modal, selectedRoom, startDate, endDate}) {

    let reservation_count = 0
    if (selectedRoom.bookings && selectedRoom.bookings.length > 0) {
        selectedRoom.bookings.forEach(element => {
            if (
                new Date(element.end_date) < new Date(startDate) ||
                new Date(element.end_date) > new Date(endDate)
            ) {
            } else {
                reservation_count = reservation_count + 1
            }
        })

    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Room Nr. {selectedRoom && selectedRoom.nr || 'undefined'} {selectedRoom && selectedRoom.camera || ""} details
            </ModalHeader>
            <ModalBody>
                <p className="card-text mb-0">Etaj: {selectedRoom.etaj}</p>
                <p className="card-text">Blocul: {selectedRoom.block_id}</p>
                <p className="card-text mb-0">Locuri ocupate:</p>
                <p className="card-text">{reservation_count} din {selectedRoom.capacity || "0"}</p>
                <p className="card-text">Type: {selectedRoom.type || ""}</p>

            </ModalBody>
            <ModalFooter>
                <Button color={selectedRoom.type !== 'rezervat' && selectedRoom.capacity > reservation_count ? "primary": 'danger'} onClick={() => {
                    if (selectedRoom.type !== 'rezervat' && selectedRoom.capacity > reservation_count) {
                        toggle({room: null})
                        handleBookNow({
                            user_id: selectedRoom.id,
                            room_id: selectedRoom.id,
                            start_date: startDate,
                            end_date: endDate,
                        })
                    }
                }}>Book Now</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

function RoomCard({
                      room = {}, toggle = () => {
    }, handleBookNow = () => {},
    startDate, endDate
                  }) {

    let reservation_count = 0
    if (room.bookings && room.bookings.length > 0)  {
        room.bookings.forEach(element => {
            if (
                new Date(element.end_date) < new Date(startDate) ||
                new Date(element.end_date) > new Date(endDate)
            ) {
            } else {
                console.log('count +1', {
                    'element.start_date': element.start_date,
                    'element.end_date': element.end_date,
                    'startDate': startDate,
                    'endDate': endDate

                })
                reservation_count = reservation_count + 1
            }
        })
        // room.bookings.reduce((acumulator, currentVal) => {
        //     if (
        //         new Date(currentVal.end_date) < new Date(startDate) ||
        //         new Date(currentVal.start_date) > new Date(endDate)
        //     ) {
        //         return acumulator
        //     } else {
        //         reservation_count = reservation_count + 1
        //     }
        //
        //     return acumulator
        // })
    }



    console.log('reservation_count', room.nr, reservation_count)

    return (
        <div className="card d-inline-flex ml-2 mr-5 mb-5" style={{
            width: '18rem',
            color: '#fff',
            borderRadius: '1.25rem',
            filter: 'drop-shadow(5px 5px 5px black)',
            background: 'rgb(176 176 176)',
        }}>
            <div className="card-body">
                <h5 className="card-title">Room nr. {room.nr || 'undefined'} {room.camera || ""}</h5>
                <p className="card-text mb-0">Etaj: {room.etaj}</p>
                <p className="card-text">Blocul: {room.block_id}</p>
                <p className="card-text">{reservation_count} din {room.capacity || "0"}</p>
                {room.type && (
                    <p className="card-text">Type: {room.type}</p>
                )}
                <button
                    onClick={() => {
                        toggle()
                    }}
                    className="btn btn-outline-info mr-2"
                >
                    View details
                </button>
                <button
                    className={`btn btn-outline-primary ${(room.type == 'rezervat' || room.capacity <= reservation_count) && 'btn-outline-danger'}`}
                    onClick={() => {
                        if (room.type !== 'rezervat' && room.capacity > reservation_count) {
                            handleBookNow()
                        }
                    }}
                >
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default Search