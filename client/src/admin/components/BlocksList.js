import React, {useEffect, useState} from "react";
import "./BlocksList.scss"
import axios from "axios";
import {FaEdit, FaTrashAlt, FaEye, FaCheck} from 'react-icons/fa'

function BlocksList() {
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    function fetchData() {
        axios.get(`${process.env.REACT_APP_API_HOST}/blocks`)
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
            axios.post(`${process.env.REACT_APP_API_HOST}/update-block`, {...item})
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        fetchData()
                    }
                })
    }


    function handleSave() {
        if (newItem && newItem.nr)
            axios.post(`${process.env.REACT_APP_API_HOST}/create-block`, {...newItem})
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
                    <h1>Lista de blocuri studentesti</h1>
                </div>
                <div className={"col-12 mt-4"}>
                    <table className={"table table-bordered"}>
                        <thead>
                        <tr>
                            <th scope="col">ID.</th>
                            <th scope="col">Nr.</th>
                            <th scope="col">Adresa</th>
                            <th scope="col">Descriere</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items && items.length > 0 && items.map((item, key) => {

                            if (item.edit)
                                return (
                                    <tr key={key}>
                                        <th scope="row">{item.id}</th>
                                        <td>
                                            <input
                                                type="number" min={1} max={99} value={item.nr || ""}
                                                onChange={event => {
                                                    items[key].nr = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type={"text"} value={item.address || ""}
                                                onChange={event => {
                                                    items[key].address = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type={"text"} value={item.description || ""}
                                                onChange={event => {
                                                    items[key].description = event.target.value
                                                    setItems([...items])
                                                }}
                                            />
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
                                    <td>{item.nr}</td>
                                    <td>{item.address || ""}</td>
                                    <td>{item.description || ""}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary mr-2">
                                            <FaEye/>
                                        </button>
                                        <button
                                            type="button" className="btn btn-success mr-2"
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
                                    <input
                                        type="number" min={0} max={99} value={newItem.nr || ""}
                                        onChange={event => setNewItem({...newItem, nr: event.target.value})}
                                        placeholder={"nr."}
                                    />
                                )}
                            </td>

                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.address || ""}
                                           onChange={event => setNewItem({...newItem, address: event.target.value})}/>
                                )}
                            </td>
                            <td>
                                {newItem.edit && (
                                    <input type={"text"} value={newItem.description || ""}
                                           onChange={event => setNewItem({...newItem, description: event.target.value})}/>
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

export default BlocksList