import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaCheck, FaEdit, FaTrashAlt} from "react-icons/fa";


function RequestsList() {

    const [filter, setFilter] = useState({})
    const [items, setItems] = useState([])
    const [rooms, setRooms] = useState([])
    const [blocks, setBlocks] = useState([])
    const [newItem, setNewItem] = useState({})

    useEffect(() => {
        fetchData()
        fetchRooms()
        // fetchBlocksList()
    }, [])


    function fetchData() {
        axios.get(`${process.env.REACT_APP_API_HOST}/requests`, {params: {...filter}})
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setItems([...resp.data])
                console.log("resp", resp.data)
            })
    }

    function fetchRooms() {
        axios.get(`${process.env.REACT_APP_API_HOST}/rooms`, {params: {...filter}})
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setRooms([...resp.data])
                console.log("resp", resp.data)
            })
    }

    function handleUpdate(item = {}) {
        console.log("item to update", item)
        if (item.id)
            axios.post(`${process.env.REACT_APP_API_HOST}/update-request`, {...item})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        fetchData()
                    }
                })
    }

    function handleDelete(item = {}) {
        if (item.id)
            axios.post(`${process.env.REACT_APP_API_HOST}/delete-request`, {...item})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        fetchData()
                    }
                })
    }


    function handleSave() {
        if (newItem && newItem.nr && newItem.block_id)
            axios.post(`${process.env.REACT_APP_API_HOST}/create-request`, {...newItem})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        setNewItem({})
                        fetchData()
                    }
                    console.log("resp", resp.data)
                })
    }

    return (
        <div className={"BlocksList container"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1>Lista de cereri de schimbare camera</h1>
                </div>

                <div className={"col-12 py-2"}>
                    <div className={"col-12 border p-2"}>
                        <div className={"row align-items-end"}>
                            <div className={"col-12"}>
                                <h5>Filter</h5>
                            </div>
                            <div className="col-2 ">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Blocul</label>
                                <input
                                    type="number"
                                    className="form-control" id="exampleFormControlInput1"
                                    placeholder="1"
                                    value={filter.block || ""}
                                    onChange={event => setFilter({...filter, block: Number(event.target.value) || ''})}
                                />
                            </div>

                            <div className="col-3 ">
                                <label htmlFor="exampleFormControlInput2" className="form-label">Email</label>
                                <input
                                    type="text" className="form-control" id="exampleFormControlInput2"
                                    placeholder="User email"
                                    value={filter.email || ""}
                                    onChange={event => setFilter({...filter, email: event.target.value || ''})}
                                />
                            </div>

                            <div className="col-3 ">
                                <label htmlFor="exampleFormControlInput2" className="form-label">Status</label>
                                <input
                                    type="text" className="form-control" id="exampleFormControlInput2"
                                    placeholder="Status"
                                    value={filter.status || ""}
                                    onChange={event => setFilter({...filter, status: event.target.value || ''})}
                                />
                            </div>

                            <div className="col ">
                                <button
                                    type="button" className="btn btn-primary d-flex ml-auto mr-2 mt-3"
                                    onClick={() => fetchData()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"col-12 mt-4"} style={{paddingBottom: '150px'}}>
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th scope="col">ID.</th>
                            <th scope="col">Room From</th>
                            <th scope="col">Room to</th>
                            <th scope="col">User Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items && items.length > 0 && items.map((item, key) => {

                            if (item.edit)
                                return (
                                    <tr>
                                        <th scope="row"></th>
                                        <td>{item.room_from && item.room_from.nr} {item.room_from && item.room_from.camera || ""}</td>
                                        {/*<td>*/}
                                        {/*    <select*/}
                                        {/*        value={item.room_from_id || ""}*/}
                                        {/*        onChange={event => {*/}
                                        {/*            items[key].room_from_id = event.target.value*/}
                                        {/*            setItems([...items])*/}
                                        {/*        }}*/}
                                        {/*    >*/}
                                        {/*        {rooms && rooms.map && rooms.map((item, key) => (*/}
                                        {/*            <option value={item.id}>{`${item.nr} ${item.camera}`}</option>*/}
                                        {/*        ))}*/}
                                        {/*    </select>*/}
                                        {/*</td>*/}
                                        <td>
                                            <select
                                                value={item.room_to_id || ""}
                                                onChange={event => {
                                                    items[key].room_to_id = event.target.value
                                                    setItems([...items])
                                                }}
                                            >
                                                {rooms && rooms.map && rooms.map((item, key) => (
                                                    <option value={item.id}>{`${item.nr} ${item.camera || ""}`}</option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>{item.user.email}</td>
                                        <td>
                                            <input
                                                type={"text"} value={item.status || "draft"}
                                                onChange={event => {
                                                    items[key].status = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                            {/*{item.status || "draft"}*/}
                                        </td>


                                        <td>
                                            <button
                                                type="button" className="btn btn-outline-primary"
                                                onClick={() => handleUpdate({...item})}
                                            >
                                                <FaCheck/>
                                            </button>
                                        </td>
                                    </tr>
                                )

                            return (
                                <tr key={key}>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.room_from && item.room_from.nr} {item.room_from && item.room_from.camera || ""}</td>
                                    <td>{item.room_to && item.room_to.nr} {item.room_to && item.room_to.camera || ""}</td>
                                    <td>{item.user.email}</td>
                                    <td>{item.status || 'draft'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-success mr-2"
                                            onClick={() => {
                                                items[key].edit = true
                                                setItems([...items])
                                            }}
                                        >
                                            <FaEdit/>
                                        </button>
                                        <button
                                            type="button" className="btn btn-danger"
                                            onClick={() => handleDelete({...item})}
                                        >
                                            <FaTrashAlt/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}

                        {/*<tr>*/}
                        {/*    <th scope="row">add</th>*/}
                        {/*    <td>*/}
                        {/*        {newItem.edit && (*/}
                        {/*            <input*/}
                        {/*                type="number" min={0} max={9999} value={newItem.nr || ""}*/}
                        {/*                onChange={event => setNewItem({...newItem, nr: event.target.value})}*/}
                        {/*                placeholder={"nr."}*/}
                        {/*            />*/}
                        {/*        )}*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        {newItem.edit && (*/}
                        {/*            <select*/}
                        {/*                value={newItem.camera || ""}*/}
                        {/*                onChange={event => {*/}
                        {/*                    setNewItem({...newItem, camera: event.target.value})*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <option selected={"selected"}>[A/B]</option>*/}
                        {/*                <option value={'A'}>A</option>*/}
                        {/*                <option value={'B'}>B</option>*/}
                        {/*            </select>*/}
                        {/*        )}*/}
                        {/*    </td>*/}
                        {/*    <td>{newItem.edit && 0}</td>*/}
                        {/*    <td>*/}
                        {/*        {newItem.edit && (*/}
                        {/*            <input type="number" min={1} max={9} value={newItem.capacity || ""}*/}
                        {/*                   onChange={event => setNewItem({...newItem, capacity: event.target.value})}/>*/}
                        {/*        )}*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        {newItem.edit && (*/}
                        {/*            <select*/}
                        {/*                value={newItem.block_id || ""}*/}
                        {/*                onChange={event => {*/}
                        {/*                    setNewItem({...newItem, block_id: event.target.value})*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <option value={''} disabled/>*/}
                        {/*                {blocks && blocks.map && blocks.map((item, key) => (*/}
                        {/*                    <option value={item.id}>{item.nr}</option>*/}
                        {/*                ))}*/}
                        {/*            </select>*/}
                        {/*        )}*/}
                        {/*    </td>*/}
                        {/*    <td>*/}
                        {/*        {!newItem.edit && (*/}
                        {/*            <button*/}
                        {/*                type="button" className="btn btn-success mr-2"*/}
                        {/*                onClick={() => setNewItem({...newItem, edit: true})}*/}
                        {/*            >*/}
                        {/*                <FaEdit/>*/}
                        {/*            </button>*/}
                        {/*        )}*/}
                        {/*        {newItem.edit && (*/}
                        {/*            <button*/}
                        {/*                type="button" className="btn btn-outline-primary"*/}
                        {/*                onClick={handleSave}*/}
                        {/*            >*/}
                        {/*                <FaCheck/>*/}
                        {/*            </button>*/}
                        {/*        )}*/}
                        {/*    </td>*/}
                        {/*</tr>*/}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RequestsList