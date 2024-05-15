import React, { useState } from 'react'
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import EmployeeId from "../../utils/EmployeeId.json";
import BusinessCard from "../../utils/BusinessCard.json";

import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { HomePage } from '..';
import SubTitle from '../basic/SubTitle';
import Modal from '@mui/material/Typography';
import Typography from '@mui/material/Typography';

function Admin() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [isAdminListModalOpen, setIsAdminListModalOpen] = useState(false);
  const [adminList, setAdminList] = useState([]);

  const businessCardContractAddress ="0xC3e32360C41eb667f2F8FB65F74eEdc317efEe93";
  const employeeIdContractAddress ="0x8C396b9bD7aA43e15c9268291f8Ce62807799037";
  const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE'));
  const drawerWidth = 240;

  //管理者登録の仕組み
  const addAdmin = async () => {
    try{
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        const employeeIdContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );
        const businessCardContract = new ethers.Contract(
          businessCardContractAddress,
          BusinessCard.abi,
          signer
        );
        //管理者登録できる関数を追加
        await employeeIdContract.addAdmin(address);
        await businessCardContract.addAdmin(address);
        alert("管理者の登録が完了しました！")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  }

  const removeAdmin = async () => {
    try{
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        const employeeIdContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );
        const businessCardContract = new ethers.Contract(
          businessCardContractAddress,
          BusinessCard.abi,
          signer
        );
        //管理者登録できる関数を追加
        await employeeIdContract.removeAdmin(address);
        await employeeIdContract.removeAdminFromList(address);
        await businessCardContract.removeAdmin(address);
        await businessCardContract.removeAdminFromList(address);
        alert("管理者の削除が完了しました！")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  }

  const checkAdmin = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        const employeeIdContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );
        const businessCardContract = new ethers.Contract(
          businessCardContractAddress,
          BusinessCard.abi,
          signer
        );
        const adminsOfEmployeeId = await employeeIdContract.getAdmins();
        const adminsOfBusinessCard = await employeeIdContract.getAdmins();
        setAdminList(adminsOfEmployeeId);//社員証NFTの管理者のみしか表示していない
        setIsAdminListModalOpen(true);
        console.log('管理者：',adminsOfEmployeeId)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("管理者一覧を表示できません:", error);
    }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'columu', height: '100vh' }}>
        <HomePage />
        <Box  className= "main" sx={{
          flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'
        }}>
          <SubTitle title="管理者設定ページ" sx={{ alignSelf: 'flex-start', width: '100%' }}/>
          <Box className = "adminContainer" sx={{
            width: 350,
            height: 250,
            padding: '20px',
            background: '#ffffff', 
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 'auto'
          }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="walletAddress"
              label="ウォレットアドレス"
              value={address}
              onChange={(e) => setAddress(e.target.value)} 
              autoFocus
              sx={{ width: '80%', mx: 'auto', display: 'block', marginBottom: '40px'}}
            />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={addAdmin}
                  sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
                  登録する
              </Button>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={removeAdmin}
                  sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
                  削除する
              </Button>
            <Link href="#" variant="body2"
              onClick={checkAdmin}
              sx={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '20px', background: '#ffffff' }}>
              管理者一覧を表示する
            </Link>
          </Box>
        </Box>
      </Box>
      {/* <Modal
        open={isAdminListModalOpen}
        onClose={() => setIsAdminListModalOpen(false)}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            管理者一覧
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {adminList.map((admin, index) => (
              <p key={index}>{admin}</p>
            ))}
           </Typography>
        </Box>
      </Modal> */}
    </div>
  )
};

export default Admin;
