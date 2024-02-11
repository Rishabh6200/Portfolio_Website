import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SideNav from './components/SideNav'
import Topnav from './components/Topnav'
import Home from './components/Home'
import Addskill from './components/Addskill'
import AddEdu from './components/AddEdu'
import './App.css';
import PersonalDetail from './components/PersonalDetail'
import Address from './components/Address'

function App() {
  return (
    <>
      <div className='h-screen main'>
        <Topnav />
        <div className="ss">
          <div className="home text-blue-950">
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<SideNav />} >
                  <Route index element={<Home />} />
                  <Route path='/addskill' element={<Addskill />} />
                  <Route path='/eduction' element={<AddEdu />} />
                  <Route path='/detail' element={<PersonalDetail />} />
                  <Route path='/address' element={<Address />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>

    </>
  );
}

export default App;
