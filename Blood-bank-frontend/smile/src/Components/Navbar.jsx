import React from 'react'
import { NavLink} from 'react-router-dom'
import Smile from '../assets/Smile.svg'



function Navbar (){
    
    let to = localStorage.getItem('token') ? '/request/requestdashboard' : '/request'
    
    return (
        <>
            <div className="outer_nav">
                <div className="logo">
                    <img src={Smile} alt="Logo" />
                </div>

                <nav className="menu" >
                    <NavLink className="nav-link " to="/"> Home </NavLink> 
                    <NavLink className="nav-link " to="/about"> About </NavLink> 
                    <NavLink className="nav-link " to={to}> Request Blood </NavLink> 
                    <NavLink className="nav-link " to="/donate"> Donate Blood </NavLink> 
                </nav>    
            </div>
        </>
    )
}

export default Navbar