import React from "react";
import  ReactDOM  from "react-dom";
import './App.css';

function Backdrop(props) {
    return ReactDOM.createPortal(
        <div className='backdrop' onClick={props.closeModal}>
            {props.children}
        </div>,
        document.getElementById('portal')
      )
}

export default Backdrop;