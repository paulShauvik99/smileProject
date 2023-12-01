import { useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import { Route, Routes, redirect } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import DonateBlood from './Pages/DonateBlood.jsx'
import RequestBlood from './Pages/RequestBlood.jsx'
import Footer from './Components/Footer.jsx'
import DonorDashboard from './Pages/DonorDashboard.jsx'
import RequestDashboard from './Pages/RequestDashboard.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
import { jwtDecode } from 'jwt-decode'


const check = localStorage.getItem('user') !== null ? jwtDecode(localStorage.getItem('user')) : null
console.log(check)

function App() {
  
  return (
    
        (window.location.pathname == '/admin' || window.location.pathname == '/admindashboard') ? (
          <>
            <Routes>
                <Route exact path='/admin' element={<AdminLogin />} />
                <Route exact path='/admindashboard' element={<AdminDashboard />} />
            </Routes>
          </>
        ) : (
          <>
            <Navbar /> 
              <Routes> 
                  <Route exact path='/' element={<Home />} />       
                  <Route exact path='/about' element={<About />} />       
                  {localStorage.getItem('user') === null ? (<Route exact path='/request' element={<RequestBlood />} />) : (<Route exact path='/request/requestdashboard' element={<RequestDashboard />} /> ) }
                   
                  {
                    localStorage.getItem('user') === null ? (<Route exact path='/donate' element={<DonateBlood />} /> ) : check.isDonor ? (<Route exact path='/donate/donordashboard' element={<DonorDashboard />} /> ) : (<Route exact path='/donate' element={<DonateBlood />} />  )
                  }
                  <Route exact path='/request/requestdashboard' element={<RequestDashboard />} /> 
                  <Route exact path='/donate/donordashboard' element={<DonorDashboard />} />
                  
              </Routes> 
            <Footer />
          </>
        )
  )
}

export default App
