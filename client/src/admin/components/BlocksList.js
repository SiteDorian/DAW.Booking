import React, {useEffect, useState} from "react";
import "./BlocksList.scss"
import axios from "axios";
import {FaEdit, FaTrashAlt, FaEye} from 'react-icons/fa'

function BlocksList() {
    const [items, setItems] = useState([])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_HOST}/blocks`)
            .then(data => {
                let resp = data.data || {}
                if (resp.status)
                    setItems([...resp.data])
                console.log("resp", resp.data)
            })
    }, [])


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
                                        <button type="button" className="btn btn-success mr-2">
                                            <FaEdit/>
                                        </button>
                                        <button type="button" className="btn btn-danger">
                                            <FaTrashAlt/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default BlocksList