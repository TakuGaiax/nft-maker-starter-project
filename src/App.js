import './App.css';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import NftUploader from './components/NftUploader/NftUploader';
import HomePage from './components/HomePage/HomePage.jsx';
import BusinessCard from './components/BusinessCard/BusinessCard.jsx';
import ExchangeCard from './components/ExchangeCard/ExchangeCard.jsx';
import UpdateEmployeeId from './components/UpdateNft/UpdateEmployeeId.jsx';
import UpdateBusinessCard from './components/UpdateNft/UpdateBusinessCard.jsx';
import UpdateHome from './components/UpdateNft/Update.jsx';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NftUploader />}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/businesscard" element={<BusinessCard/>}/>
        <Route path="/send" element={<ExchangeCard/>}></Route>
        <Route path="/update" element={<UpdateHome/>}></Route>
        <Route path="/update/employeeid" element={<UpdateEmployeeId/>}></Route>
        <Route path="/update/businesscard" element={<UpdateBusinessCard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App;