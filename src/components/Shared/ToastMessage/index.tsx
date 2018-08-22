import React,  { Component } from 'react'
import { render } from "react-dom";
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const toastOptions = {
    autoClose: 3000, 
    type: toast.TYPE.SUCESS,
    className: 'argomi-toast',
    hideProgressBar: true,
    position: toast.POSITION.TOP_RIGHT,
    pauseOnHover: true,
    newestOnTop:true
};

class ToastMessage extends React.Component <{message:string, type:string}, any> {   
    constructor(props:any) {
        super(props);
        toast.success = toast.success.bind(this);
    } 

    render() {
        switch (this.props.type) {
            case 'success':
                toast.success(this.props.message, toastOptions);
                break
            case 'failure':
                toast.error(this.props.message, toastOptions); 
                break
            default:
                toast.success(this.props.message, toastOptions);
                break 
        }
        return <ToastContainer /> ;     
    }
}

export {ToastMessage}