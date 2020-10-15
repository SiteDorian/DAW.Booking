import React, {useEffect, useState} from "react";
import "./BlocksList.scss"
import axios from "axios";
import {FaEdit, FaTrashAlt, FaEye, FaCheck} from 'react-icons/fa'

function UsersList() {
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    function fetchData() {
        axios.get(`${process.env.REACT_APP_API_HOST}/users`)
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
            axios.post(`${process.env.REACT_APP_API_HOST}/update-user`, {...item})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        fetchData()
                    }
                })
    }


    function handleSave() {
        if (newItem && newItem.name && newItem.email)
            axios.post(`${process.env.REACT_APP_API_HOST}/create-user`, {...newItem})
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
                    <h1>Lista de useri</h1>
                </div>
                <div className={"col-12 mt-4"} style={{paddingBottom: '150px'}}>
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th scope="col">ID.</th>
                            <th scope="col">Nume</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tip</th>
                            <th scope="col">Anul</th>
                            <th scope="col">Grupa</th>
                            <th scope="col">Departament</th>
                            <th scope="col">Necesita cazare</th>

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
                                                type={"text"} value={item.nume || ""}
                                                onChange={event => {
                                                    items[key].nume = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type={"email"} value={item.email || ""}
                                                onChange={event => {
                                                    items[key].email = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type={"text"} value={item.type || ""}
                                                onChange={event => {
                                                    items[key].type = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number" min={0} max={9} value={item.year || ""}
                                                onChange={event => {
                                                    items[key].year = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type={"text"} value={item.grupa || ""}
                                                onChange={event => {
                                                    items[key].grupa = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type={"text"} value={item.departament || ""}
                                                onChange={event => {
                                                    items[key].departament = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>

                                        <select
                                            value={item.necesita_cazare || ""}
                                            onChange={event => {
                                                items[key].necesita_cazare = event.target.value
                                                setItems([...items])
                                            }}
                                        >
                                            <option disabled={true}/>
                                            <option value={true}>Da</option>
                                            <option value={false}>Nu</option>
                                        </select>

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
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.type}</td>
                                    <td>{item.year}</td>
                                    <td>{item.grupa}</td>
                                    <td>{item.departament}</td>
                                    <td>{item.necesita_cazare ? "Da" : "Nu" || "-"}</td>
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

                        <tr>
                            <th scope="row">add</th>

                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.name || ""}
                                           onChange={event => setNewItem({...newItem, name: event.target.value})}/>
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <input type={"email"} value={newItem.email || ""}
                                           onChange={event => setNewItem({...newItem, email: event.target.value})}/>
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.type || ""}
                                           onChange={event => setNewItem({...newItem, type: event.target.value})}/>
                                )}
                            </td>

                            <td>
                                {newItem.edit && (
                                    <input
                                        type="number" min={0} max={9} value={newItem.year || ""}
                                        onChange={event => setNewItem({...newItem, year: event.target.value})}
                                        placeholder={"An"}
                                    />
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.grupa || ""}
                                           onChange={event => setNewItem({...newItem, grupa: event.target.value})}/>
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.departament || ""}
                                           onChange={event => setNewItem({...newItem, departament: event.target.value})}/>
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <select
                                        value={newItem.necesita_cazare || ""}
                                        onChange={event => {
                                            setNewItem({...newItem, necesita_cazare: event.target.value})
                                        }}
                                    >
                                        <option disabled> </option>
                                        <option value={true}>Da</option>
                                        <option value={false}>Nu</option>
                                    </select>
                                )}
                            </td>

                            <td>
                                {!newItem.edit && (
                                    <button
                                        type="button" className="btn btn-success mr-2"
                                        onClick={() => setNewItem({...newItem, edit: true})}
                                    >
                                        <FaEdit/>
                                    </button>
                                )}
                                {newItem.edit && (
                                    <button
                                        type="button" className="btn btn-outline-primary"
                                        onClick={handleSave}
                                    >
                                        <FaCheck/>
                                    </button>
                                )}
                            </td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default UsersList