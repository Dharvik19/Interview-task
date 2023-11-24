import React from "react";
import Backdrop from "./Backdrop";
import './App.css'

const Modal =(props)=>{
    <Backdrop closeModal={props.closeModal}>
        {props.children}
    </Backdrop>
}       

export default Modal;