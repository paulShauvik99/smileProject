import { useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import { Route, Routes, redirect } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import DonateBlood from './Pages/DonateBlood.jsx'
import RequestBlood from './Pages/RequestBlood.jsx'
import Footer from './Components/Footer.jsx'
import DonorDashboard from './Pages/DonorDashboard.jsx'
import RequestDashboard from './Pages/RequestDashboard.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
import MatchDonors from './Pages/MatchDonors.jsx'
import ConfirmDonations from './Pages/ConfirmDonations.jsx'




function App() {
  
  return (
    
        (window.location.pathname == '/admin' || window.location.pathname == '/admindashboard/matchdonor' || window.location.pathname == '/admindashboard/confirmdonations') ? (
          <>
              <Routes>
                  <Route exact path='/admin' element={<AdminLogin />} />
                  <Route exact path='/admindashboard/matchdonor' element={<MatchDonors />} />
                  <Route exact path='/admindashboard/confirmdonations' element={<ConfirmDonations />} />
              </Routes>
          </>
        ) : (
          <>
            <Navbar /> 
              <Routes> 
                  <Route exact path='/' element={<Home />} />       
                  <Route exact path='/request' element={<RequestBlood />} />
                  <Route exact path='/request/requestdashboard' element={<RequestDashboard />} /> 
                  <Route exact path='/donate' element={<DonateBlood />} />           
                  <Route exact path='/donate/donordashboard' element={<DonorDashboard />} />       
              </Routes> 
            <Footer />
          </>
        )
  )
}

export default App
