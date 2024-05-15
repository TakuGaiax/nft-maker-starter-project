import './App.css';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import NftMaker from './components/NftUploader/NftMaker.jsx';
import HomeScreenForCompany from './components/HomePage/HomeForCompany.jsx';
import HomeScreenForEmployee from './components/HomePage/HomeForEmployee.jsx';
import BusinessCardMint from './components/BusinessCard/BusinessCard.jsx';
import ExchangeCard from './components/ExchangeCard/ExchangeCard.jsx';
import UpdateEmployeeId from './components/UpdateNft/UpdateEmployeeId.jsx';
import UpdateBusinessCard from './components/UpdateNft/UpdateBusinessCard.jsx';
import UpdateHome from './components/UpdateNft/Update.jsx';
import Login from './components/Login/Login.jsx';
import Admin from './components/AdminCheck/Admin.jsx';
import Mint from './components/Mint/Mint.jsx';
import EmployeeIdMint from './components/Mint/MintEmployeeId.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login/company" element={< NftMaker />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/login/admin" element={<Admin />}/>
        <Route path="/home/company" element={<HomeScreenForCompany/>}/>
        <Route path="/home/employee" element={<HomeScreenForEmployee/>}/>
        <Route path="/home/mint/employeeid" element={<EmployeeIdMint />}/>
        <Route path="/home/mint/businesscard" element={<BusinessCardMint />}/>
        <Route path="/home/mint" element={<Mint />}/>
        <Route path="/send" element={<ExchangeCard/>}></Route>
        <Route path="/update" element={<UpdateHome/>}></Route>
        <Route path="/update/employeeid" element={<UpdateEmployeeId/>}></Route>
        <Route path="/update/businesscard" element={<UpdateBusinessCard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App;