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

    const [activeBookingError, setActiveBookingError] = useState(false)
    const [activeBooking, setActiveBooking] = useState(false)

    const toggle = ({room = null}) => {
        setModal(!modal)
        if (room)
            setSelectedRoom({...room})
    };

    const history = useHistory()

    useEffect(() => {
        let _state = props.location && props.location.state || {}
        if (!_state.email || !_state.idnp) {
            history.push('/')
        } else {
            props.setEmail(_state.email)
            localStorage.setItem("email", _state.email)
        }
        setState({..._state})
    }, [])

    useEffect(() => {
        if (state.email && state.idnp) {
            axios.get(`${process.env.REACT_APP_API_HOST}/account`, {
                params: {
                    email: state.email,
                    idnp: state.idnp
                }
            })
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        props.setEmail(state.email)
                        localStorage.setItem("email", state.email)
                        localStorage.setItem("idnp", state.idnp)
                        setUser({...resp.item})
                    } else {
                        localStorage.setItem("idnp", "")
                        history.push('/')
                    }
                })
        }
    }, [state.email, state.idnp])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/rooms`, {
            params: {
                ...state,
                type: 'available'
            }
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setRooms([...resp.data])
                console.log("resp", resp.data)
            })
    }, [state])

    useEffect(() => {
        console.log('user', user)
        //verifica daca nu exista vre-o rezervare activa
        setActiveBookingError(false)
        setActiveBooking(false)
        if (user) {
            if (user.bookings && user.bookings.length > 0) {
                user.bookings.forEach(element => {
                    if (
                        !(new Date(element.end_date) < new Date(state.start_date) ||
                        new Date(element.start_date) > new Date(state.end_date))
                    ) {
                        setActiveBookingError(true)
                        setActiveBooking(true)
                    }
                })

            }
        }
    }, [user, state.start_date, state.end_date])


    const handleSendRequest = ({room_from_id = null, room_to_id = null, user_id=null}) => {
        axios.post(`${process.env.REACT_APP_API_HOST}/create-request`, {
            room_from_id: room_from_id,
            room_to_id: room_to_id,
            user_id: user_id
        })
            .then(data => {
                let resp = data.data || {}
                if (resp.status) {
                    history.push("/account")
                }
            })
    }

    const handleBookNow = ({room_id = null, user_id=null, start_date = state.start_date, end_date = state.end_date}) => {
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

    const userActiveBooking = user && user.bookings && user.bookings.find(element =>
        !(new Date(element.end_date) < new Date(state.start_date) ||
            new Date(element.start_date) > new Date(state.end_date))
    )

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
                                <span> Studentilor Street 1</span>
                            </h5>
                        </div>

                        <div className={"col-12"}>
                            <p className={"mb-0"}>
                                Start date: <b>{state.start_date || ""}</b>
                            </p>
                            <p>
                                End date: <b>{state.end_date || ""}</b>
                            </p>

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
                                        handleSendRequest={() => handleSendRequest({
                                            user_id: user.id,
                                            room_to_id: item.id,
                                            room_from_id: userActiveBooking && userActiveBooking.room.id
                                        })}
                                        startDate={state.start_date}
                                        endDate={state.end_date}
                                        activeBooking={activeBooking}
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
                    handleBookNow={() => handleBookNow({
                        user_id: user.id,
                        room_id: selectedRoom.id,
                    })}
                    handleSendRequest={() => handleSendRequest({
                        user_id: user.id,
                        room_to_id: selectedRoom.id,
                        room_from_id: userActiveBooking && userActiveBooking.room.id
                    })}
                    selectedRoom={selectedRoom}
                    modal={modal}
                    startDate={state.start_date}
                    endDate={state.end_date}
                    activeBooking={activeBooking}
                />
            )}

            {activeBookingError && (
                <Modal
                    isOpen={activeBookingError}
                    toggle={() => setActiveBookingError(false)}
                >
                    <ModalHeader toggle={() => setActiveBookingError(false)}>
                        Booking warning
                    </ModalHeader>
                    <ModalBody>
                        <p>Pentru perioada selectata aveti deja o rezervare activa.</p>
                        <p>Nu se permit mai multe rezervari pentru aceiasi perioada.</p>
                        <p>Aveti posibilitatea sa faceti o cerere de schimbare a camerei</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => setActiveBookingError(false)}>Ok</Button>
                    </ModalFooter>
                </Modal>
            )}


        </div>
    )
}

function DetailsModal({toggle, handleBookNow, handleSendRequest, modal, selectedRoom, startDate, endDate, activeBooking=false}) {

    let reservation_count = 0
    if (selectedRoom.bookings && selectedRoom.bookings.length > 0) {
        selectedRoom.bookings.forEach(element => {
            if (
                new Date(element.end_date) < new Date(startDate) ||
                new Date(element.start_date) > new Date(endDate)
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
                <p className="card-text mb-0">Locuri ocupate in perioada aleasa:</p>
                <p className="card-text">{reservation_count} din {selectedRoom.capacity || "0"}</p>
                {selectedRoom.type && (
                    <p className="card-text">Type: {selectedRoom.type || ""}</p>
                )}

                {selectedRoom.bookings && selectedRoom.bookings.map && (
                    <p className="card-text">Bookings:</p>
                )}

                {selectedRoom.bookings && selectedRoom.bookings.map && selectedRoom.bookings.map((item, key) => {

                    return (
                        <p key={key} className={`mb-0 ${(new Date(item.end_date) < new Date(startDate) ||
                            new Date(item.start_date) > new Date(endDate)) && "text-success"}`}>
                            {key + 1}) {item.user.name}, {new Date(item.start_date).toLocaleDateString()} -> {new Date(item.end_date).toLocaleDateString()}
                        </p>
                    )
                })}

            </ModalBody>
            <ModalFooter>
                <Button color={selectedRoom.type !== 'rezervat' && selectedRoom.capacity > reservation_count ? "primary": 'danger'} onClick={() => {
                    if (selectedRoom.type !== 'rezervat' && selectedRoom.capacity > reservation_count) {
                        toggle({room: null})
                        if (activeBooking) {
                            handleSendRequest()
                        } else {
                            handleBookNow()
                        }
                    }
                }}>{activeBooking ? "Send Request" : "Book Now"}</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

function RoomCard({
                      room = {}, toggle = () => {
    }, handleBookNow = () => {}, handleSendRequest = () => null,
    startDate, endDate, activeBooking
                  }) {

    let reservation_count = 0
    if (room.bookings && room.bookings.length > 0)  {
        room.bookings.forEach(element => {
            if (
                new Date(element.end_date) < new Date(startDate) ||
                new Date(element.start_date) > new Date(endDate)
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
                {!activeBooking ? (
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
                ) : (
                    <button
                        className={`btn btn-outline-primary ${(room.type == 'rezervat' || room.capacity <= reservation_count) && 'btn-outline-danger'}`}
                        onClick={() => {
                            if (room.type !== 'rezervat' && room.capacity > reservation_count) {
                                handleSendRequest()
                            }
                        }}
                    >
                        Change Now
                    </button>
                )}
            </div>
        </div>
    )
}

export default Search