import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import {FaEdit, FaTrashAlt, FaEye, FaCheck} from 'react-icons/fa'

function Automatizare(props) {

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingCazare, setIsLoadingCazare] = useState(false)

    const [filter, setFilter] = useState({
        year: 1,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: '2021-06-30', //end of this year
    })

    useEffect(() => {
        fetchData()
    }, [])

    function fetchData() {
        setIsLoading(true)
        setTimeout(() => {
            axios.get(`${process.env.REACT_APP_API_HOST}/users-booking`, {
                params: {
                    ...filter
                }
            })
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        setItems([...resp.data])
                        setIsLoading(false)
                    }
                    console.log("resp", resp.data)
                })
        }, 2000)
    }

    function handleCazare() {
        setIsLoadingCazare(true)
        let userIds = items && items.map(item => item.id) || []

        setTimeout(() => {
            axios.post(`${process.env.REACT_APP_API_HOST}/auto-booking`, {
                userIds: userIds || [],
                start_date: filter.start_date,
                end_date: filter.end_date,
            })
                .then(data => {
                    let resp = data.data || {}
                    if (resp.status) {
                        setIsLoading(false)
                        setIsLoadingCazare(false)
                        fetchData()
                    }
                    console.log("resp handleCazare", resp.data)
                })
        }, 1000)
    }

    return (
        <div className={"BlocksList container"} style={{paddingBottom: '150px'}}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <h1>Automatizare cazare studenti</h1>
                </div>

                <div className={"col-12 py-2"}>
                    <div className={"col-12 border p-2"}>
                        <div className={"row align-items-end"}>
                            <div className={"col-12"}>
                                <h5>Filter</h5>
                            </div>
                            <div className="col-2 ">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Anul</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    className="form-control" id="exampleFormControlInput1"
                                    placeholder="1"
                                    value={filter.year || ""}
                                    onChange={event => setFilter({...filter, year: Number(event.target.value) || ''})}
                                />
                            </div>

                            <div className="col-3 ">
                                <label htmlFor="exampleFormControlInput2" className="form-label">Grupa</label>
                                <input
                                    type="text" className="form-control" id="exampleFormControlInput2"
                                    placeholder="All groups"
                                    value={filter.grupa || ""}
                                    onChange={event => setFilter({...filter, grupa: event.target.value || ''})}
                                />
                            </div>

                            <div className="col-3 ">
                                <label htmlFor="exampleFormControlInput3" className="form-label">Departamentul</label>
                                <input
                                    type="text" className="form-control" id="exampleFormControlInput3"
                                    placeholder="All departments"
                                    value={filter.departament || ""}
                                    onChange={event => setFilter({...filter, departament: event.target.value || ''})}
                                />
                            </div>

                            <div className="col-3 ">
                                <label htmlFor="exampleFormControlInput3" className="form-label">Nume student</label>
                                <input
                                    type="text" className="form-control" id="exampleFormControlInput3"
                                    placeholder={"All"}
                                    value={filter.name || ""}
                                    onChange={event => setFilter({...filter, name: event.target.value || ''})}
                                />
                            </div>

                            <div className="col-3 mt-3">
                                <label htmlFor="exampleFormControlInput4" className="form-label">Start date</label>
                                <input
                                    type="date" className="form-control" id="exampleFormControlInput4"
                                    value={filter.start_date || ""}
                                    {...filter.end_date && {max: filter.end_date}}
                                    onChange={event => setFilter({...filter, start_date: event.target.value || ''})}
                                />
                            </div>

                            <div className="col-3 mt-3">
                                <label htmlFor="exampleFormControlInput5" className="form-label">End date</label>
                                <input
                                    type="date" className="form-control" id="exampleFormControlInput5"
                                    value={filter.end_date || ""}
                                    {...filter.start_date && {min: filter.start_date}}
                                    onChange={event => setFilter({...filter, end_date: event.target.value || ''})}
                                />
                            </div>

                            <div className="col ">
                                <button
                                    disabled={isLoading || isLoadingCazare}
                                    type="button" className="btn btn-primary d-flex ml-auto mr-2 mt-3"
                                    onClick={() => fetchData()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"col-12 mt-4"}>
                    <p>Rezultate gasite: {!isLoading ? items.length || 0 : (
                        <div className="spinner-border small-spinner ms-auto" role="status" aria-hidden="true"/>
                    )}</p>
                    <table className={"table table-striped"}>
                        <thead>
                        <tr>
                            <th scope="col">ID.</th>
                            <th scope="col">Nume</th>
                            <th scope="col">Email</th>
                            <th scope="col">Tip</th>
                            <th scope="col">Anul</th>
                            <th scope="col">Grupa</th>
                            <th scope="col">Departament</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {!isLoading && items && items.length > 0 && items.map((item, key) => {
                            return (
                                <tr key={key}>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.type}</td>
                                    <td>{item.year}</td>
                                    <td>{item.grupa}</td>
                                    <td>{item.departament}</td>
                                    <td>
                                        <button
                                            type="button" className="btn btn-danger"
                                            onClick={() => {
                                                items.splice(key, 1)
                                                setItems([...items])
                                            }}
                                        >
                                            <FaTrashAlt/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className={"col-12 mt-4"}>
                    {!isLoading && items && items.length > 0 && (
                        <button
                            disabled={isLoadingCazare}
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => handleCazare()}
                        >
                            Cazare automata {items.length} studenti
                        </button>
                    )}
                </div>

            </div>

            {(isLoading || isLoadingCazare) && (
                <div className={"row justify-content-center"}>
                    <div className={"col-auto"}>
                        <div className="spinner-border text-primary big-spinner" role="status">
                            <span className="visually-hidden d-none">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Automatizare