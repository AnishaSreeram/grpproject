import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from "../auth/helper";
import { getOrders } from "./helper/adminapicall"
import Base from '../core/Base'

function Orders() {
    const [orders, setOrders] = useState([]);
    const { user, token } = isAuthenticated();

    const preload = () => {
        getOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setOrders(data);
            }
        });
    };

    useEffect(() => {
        preload();
    }, []);
    return (
        <Base title="Welcome admin" description="Manage orders here">
            <h2 className="mb-4">All orders:</h2>
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total 3 orders</h2>
                    {orders.map((order,index) => {
                        return (
                            <div key={index} className="row text-center mb-2 ">
                            <div className="col-4">
                                <h3 className="text-white text-left">{order.name}</h3>
                            </div>
                            <div className="col-4">
                                <Link
                                    className="btn btn-success"
                                    to={`/admin/order/update/${order._id}`}
                                >
                                    <span className="">Update</span>
                                </Link>
                            </div>
                            <div className="col-4">
                                <button className="btn btn-danger">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </Base>
    )
}

export default Orders
