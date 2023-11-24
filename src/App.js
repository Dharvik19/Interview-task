import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
// import { AiFillCloseCircle } from "react-icons/ai";
import LoadingSpinner from "./LoadingSpinner";
const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const nameRef = useRef("");
  const emailRef = useRef("");
  const phoneNumberRef = useRef("");

  const [userData, setUserData] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  //Error Boundaries 
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneLength, setPhoneLength] = useState(false);
  const [emptyForm, setEmptyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const getData = async () => {
    setLoading(true); 
    const response = await axios.get("http://localhost:5000/getDetails");
    const userData = response;

    console.log(userData.data.response);

    setUserData(userData.data.response);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    if(!name && !phoneNumber && !email){
      setEmptyForm(true);
      setTimeout(()=>{
        setEmptyForm(false);
      },5000);
    }
    if ( !name) {
     
      setNameError(true);
      setTimeout(()=>{
        setNameError(false);
      },5000)
      return;
    } else if (!email) {
      
      setTimeout(()=>{
        setEmailError(false);
      },5000)
      setEmailError(true);
      return;
    } else if (!phoneNumber) {
      
      setTimeout(()=>{
        setPhoneError(false);
      },5000)
      setPhoneError(true);
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneLength(true);
      setTimeout(()=>{
        setPhoneLength(false);
      },5000);
      return;
    }
    const userObject = {
      name,
      email,
      phoneNumber,
    };

    if (editMode) {
      toggleModal();
      try {
        const response = await axios.put(
          `http://localhost:5000/updateUser/${editId}`,
          userObject
        );
        console.log(response);
        alert("Record updated successfully!");
        clearFormFields();
        setEditMode(false);
        setEditId(null);
        toggleModal();
        getData();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/addDetails",
          userObject
        );
        console.log(response, "data received!");
        alert("Record added successfully!");
        clearFormFields();
        toggleModal();
        getData();
      } catch (error) {
        console.error("Error adding data:", error);
      }
    }
  };
  const deleteData = async (id) => {
    const response = await axios.delete(`http://localhost:5000/delete/${id}`);
    const data = response;
    console.log(data);

    getData();
  };

  const handleEdit = (data) => {
    
    setEditMode(true);
    setEditId(data.id);
    console.log(data.id);
    console.log(data.name, data.email, data.phoneNumber);
    nameRef.current.value = data.name;
    emailRef.current.value = data.email;
    phoneNumberRef.current.value = data.phoneNumber;
  };
  const clearFormFields = () => {
    nameRef.current.value = "";
    emailRef.current.value = "";
    phoneNumberRef.current.value = "";
  };
  return (
    <div className="container">
      {loading && <LoadingSpinner></LoadingSpinner>}
      <div className="loginMenu">
        <h1 id="heading">CRUD APP</h1>
        {/* <button id="showHideForm" onClick={toggleModal}>
          Add User
        </button> */}
        {/* {showModal && ( */}
          <form className="form" onSubmit={handleSubmit}>
            <div className="formHeading">
              <h3>Enter Details</h3>
              {/* <span>
                <AiFillCloseCircle onClick={toggleModal} />
              </span> */}
            </div>
            <div className="ErrorBoundaries">
                {nameError &&!emptyForm && <p style={{textDecoration:"underline", fontWeight:"bold"}}><span style={{color:"#ff0000"}}>Name</span> cannot be empty</p>}
                {phoneError&&!emptyForm && <p style={{textDecoration:"underline", fontWeight:"bold"}}><span style={{color:"#6a5acd"}}>Phone Number</span> cannot be empty</p>}
                {emailError &&!emptyForm && <p style={{textDecoration:"underline", fontWeight:"bold"}}><span style={{color:"#3cb371"}}>Email</span> cannot be empty</p>}
                {emptyForm && <p style={{textDecoration:"underline", fontWeight:"bold"}}><span style={{color:"#3cb371"}}>Form</span> cannot be empty</p>}
                {phoneLength && <p style={{textDecoration:"underline", fontWeight:"bold"}}><span style={{color:"#3cb371"}}>Phone Number</span> must contain 10 digits</p>}
            </div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              ref={nameRef}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              ref={emailRef}
            />
            <label>PhoneNumber</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter Your Phone number"
              ref={phoneNumberRef}
            />
            <button id="submitButton" type="submit">{editMode ? "Save" : "Submit"}</button>
          </form>
        
      </div>
      <div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!loading && userData?.map((data) => (
              <tr key={data.id}>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.phoneNumber} </td>

                <td>
                  <button id="editButton" onClick={() => handleEdit(data)}>
                    Edit
                  </button>
                  <button id="deleteButton" onClick={() => deleteData(data.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
