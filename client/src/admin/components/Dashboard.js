import React, {useEffect, useState} from "react";
import {FaHome} from "react-icons/fa"
import {Pie} from "react-chartjs-2";
import axios from "axios";

function Dashboard() {
    const [rooms, setRooms] = useState([])
    const [blocks, setBlocks] = useState([])
    const [bookings, setBookings] = useState([])
    const [requests, setRequests] = useState([])

    useEffect(() => {
        fetchBlocks()
        fetchRooms()
        fetchBookings()
    }, [])

    function fetchBlocks() {
        axios.get(`${process.env.REACT_APP_API_HOST}/blocks-rooms`)
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setBlocks([...resp.data])
                console.log("resp", resp.data)
            })
    }

    function fetchRooms() {
        axios.get(`${process.env.REACT_APP_API_HOST}/rooms`)
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setRooms([...resp.data])
                console.log("resp", resp.data)
            })
    }

    function fetchBookings() {
        axios.get(`${process.env.REACT_APP_API_HOST}/bookings`)
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setBookings([...resp.data])
                console.log("resp", resp.data)
            })
    }

    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    const dataRoomsPerBlock = {
        labels: [
            'Block 1',
            'Block 2',
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [
                blocks && blocks[0] && blocks[0].rooms.length || 0,
                blocks && blocks[1] && blocks[1].rooms.length || 0]
            ,
            backgroundColor: [
                'rgb(255, 205, 86)',
                'rgb(122,255,147)',
            ],
            hoverOffset: 4
        }]
    };

    const dataRoomsByType = {
        labels: [
            'Disponibile',
            'Rezervate',
        ],
        datasets: [{
            label: 'Rooms by type',
            data: [
                rooms && rooms.filter(item => item.type !== 'rezervat').length,
                rooms && rooms.filter(item => item.type === 'rezervat').length,
            ],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
            hoverOffset: 4
        }]
    };

    const dataBookingsByType = {
        labels: [
            'Manual',
            'Auto',
        ],
        datasets: [{
            label: 'Bookings by type',
            data: [
                bookings && bookings.filter(item => item.type !== 'auto').length,
                bookings && bookings.filter(item => item.type === 'auto').length,
            ],
            backgroundColor: [
                'rgb(120,93,132)',
                'rgb(101,209,235)',
            ],
            hoverOffset: 4
        }]
    };

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"col-12 mb-4 border-bottom"}>
                    <h1 className={"d-flex align-items-center"}>
                        <FaHome className={"mr-2"}/>
                        Dashboard
                    </h1>
                </div>
                <div className={"col-4"}>
                    <Pie
                        data={dataRoomsPerBlock}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Rooms per Block'
                                }
                            }
                        }}
                    />
                </div>
                <div className={"col-4"}>
                    <Pie
                        data={dataRoomsByType}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Rooms By Type'
                                }
                            }
                        }}
                    />
                </div>
                <div className={"col-4"}>
                    <Pie
                        data={dataBookingsByType}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Bookings By Type'
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard