import { useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import DonateBlood from './Components/DonateBlood'
import RequestBlood from './Components/RequestBlood'
import Footer from './Components/Footer.jsx'
import DonorDashboard from './Components/DonorDashboard.jsx'
import RequestDashboard from './Components/RequestDashboard.jsx'




function App() {

  return (
    <>

      <Navbar /> 
        <Routes> 
            <Route exact path='/' element={<Home />} />       
            <Route exact path='/about' element={<About />} />       
            <Route exact path='/request' element={<RequestBlood />} />       
            <Route exact path='/donate' element={<DonateBlood />} />       
            <Route exact path='/donate/donordashboard' element={<DonorDashboard />} />       
            <Route exact path='/request/requestdashboard' element={<RequestDashboard />} />       
        </Routes> 
      <Footer />

    </>
  )
}

export default App
