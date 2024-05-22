import './App.css';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import NftMaker from './components/Login/NftUploader/NftMaker.jsx';
import HomeScreenForCompany from './components/AdminTool/HomeForCompany.jsx';
import HomeScreenForEmployee from './components/EmployeeTool/HomeForEmployee.jsx';
import BusinessCardMint from './components/AdminTool/Mint/BusinessCard.jsx';
import ExchangeCard from './components/EmployeeTool/ExchangeCard/ExchangeCard.jsx';
import UpdateEmployeeId from './components/AdminTool/UpdateNft/UpdateEmployeeId.jsx';
import UpdateBusinessCard from './components/AdminTool/UpdateNft/UpdateBusinessCard.jsx';
import UpdateHome from './components/AdminTool/UpdateNft/Update.jsx';
import Login from './components/Login/Login.jsx';
import Admin from './components/AdminTool/Admin.jsx';
import Mint from './components/AdminTool/Mint/Mint.jsx';
import EmployeeIdMint from './components/AdminTool/Mint/MintEmployeeId.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login/company" element={< NftMaker />}/>
        <Route path="/" element={<Login />}/>
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