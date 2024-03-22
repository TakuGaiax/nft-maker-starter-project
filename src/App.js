import './App.css';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';

import NftUploader from './components/NftUploader/NftUploader';
import HomePage from './components/HomePage/HomePage.jsx';
import BusinessCard from './components/BusinessCard/BusinessCard.jsx';


function App() {

  // return (
  //   <div className='App'>
  //     <NftUploader></NftUploader>
  //   </div>
  // );
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NftUploader />}/>
        <Route path="/homescreen" element={<HomePage/>}/>
        <Route path="/businesscard" element={<BusinessCard/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App;