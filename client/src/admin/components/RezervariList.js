import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaCheck, FaEdit, FaTrashAlt} from "react-icons/fa";

function RezervariList() {

    const [items, setItems] = useState([])
    const [blocks, setBlocks] = useState([])
    const [newItem, setNewItem] = useState({})

    useEffect(() => {
        fetchData()
        // fetchBlocksList()
    }, [])


    function fetchData() {
        axios.get(`${process.env.REACT_APP_API_HOST}/bookings`)
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setItems([...resp.data])
                console.log("resp", resp.data)
            })
    }

    function handleUpdate(item = {}) {
        console.log("item to update", item)
        if (item.id)
            axios.post(`${process.env.REACT_APP_API_HOST}/update-booking`, {...item})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        fetchData()
                    }
                })
    }


    function handleSave() {
        if (newItem && newItem.nr && newItem.block_id)
            axios.post(`${process.env.REACT_APP_API_HOST}/create-booking`, {...newItem})
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
                    <h1>Lista de rezervari</h1>
                </div>

                <div className={"col-12 mt-4"} style={{paddingBottom: '150px'}}>
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th scope="col">ID.</th>
                            <th scope="col">Room Nr.</th>
                            <th scope="col">Room [A/B]</th>
                            <th scope="col">User Email</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items && items.length > 0 && items.map((item, key) => {

                            if (item.edit)
                                return (
                                    <tr>
                                        <th scope="row"></th>
                                        <td>
                                            <input
                                                type="number" min={0} max={9999} value={item.room.nr || ""}
                                                onChange={event => {
                                                    items[key].nr = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={item.room.camera || ""}
                                                onChange={event => {
                                                    items[key].camera = event.target.value
                                                    setItems([...items])
                                                }}
                                            >
                                                <option value={''}/>
                                                <option value={'A'}>A</option>
                                                <option value={'B'}>B</option>
                                            </select>
                                        </td>
                                        <td>{item.user.email}</td>
                                        <td>{item.start_date}</td>
                                        <td>{item.end_date}</td>
                                        {/*<td>*/}
                                        {/*    <input*/}
                                        {/*        type="number" min={1} max={9} value={item.room.capacity || ""}*/}
                                        {/*        onChange={event => {*/}
                                        {/*            items[key].capacity = event.target.value*/}
                                        {/*            setItems([...items])*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</td>*/}
                                        {/*<td>*/}
                                        {/*    <select*/}
                                        {/*        value={item.block_id || ""}*/}
                                        {/*        onChange={event => {*/}
                                        {/*            items[key].block_id = event.target.value*/}
                                        {/*            setItems([...items])*/}
                                        {/*        }}*/}
                                        {/*    >*/}
                                        {/*        <option value={''} disabled/>*/}
                                        {/*        {blocks && blocks.map && blocks.map((item, key) => (*/}
                                        {/*            <option value={item.id}>{item.nr}</option>*/}
                                        {/*        ))}*/}
                                        {/*    </select>*/}
                                        {/*</td>*/}
                                        {/*<td>*/}
                                        {/*    <input*/}
                                        {/*        type="number" min={0} max={99} value={item.etaj || ""}*/}
                                        {/*        onChange={event => {*/}
                                        {/*            items[key].etaj = event.target.value*/}
                                        {/*            setItems([...items])*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</td>*/}
                                        {/*<td>*/}
                                        {/*    <input*/}
                                        {/*        type={"text"} value={item.type || ""}*/}
                                        {/*        onChange={event => {*/}
                                        {/*            items[key].type = event.target.value*/}
                                        {/*            setItems([...items])*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</td>*/}
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
                                    <td>{item.room.nr}</td>
                                    <td>{item.room.camera || "-"}</td>
                                    <td>{item.user.email}</td>
                                    <td>{item.start_date || ""}</td>
                                    <td>{item.end_date || ""}</td>
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
                                        <button type="button" className="btn btn-danger">
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

export default RezervariList