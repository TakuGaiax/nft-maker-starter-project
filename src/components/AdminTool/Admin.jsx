import React, { useState } from 'react'
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import EmployeeId from "../../utils/EmployeeId.json";
import BusinessCard from "../../utils/BusinessCard.json";
import { employeeIdContractAddress, businessCardContractAddress } from "../index.js";

import { Drawer, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { HomePage } from '../index.js';
import SubTitle from '../basic/SubTitle.jsx';
import Modal from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import AdminLoading from './AdminLoading.jsx';
import CustomToolbar from '../basic/Toolbar.jsx';


function Admin() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [showAdminList, setShowAdminList] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
        //記入漏れがあった場合エラー
        if(!address) {
          console.log("All fields are required");
          window.alert("すべての項目を記入してください。");
          return;
        }
        //ウォレットアドレスのフォーマット検証
        if(!ethers.utils.isAddress(address)){
            console.error("Invalid wallet address");
            window.alert("無効なウォレットアドレスです。");
            return;
        }
      //管理者登録できる関数を追加
      setIsAdmin(true); 
      try{
          await employeeIdContract.addAdmin(address);
          await businessCardContract.addAdmin(address);
          setIsAdmin(false); 
          alert("管理者の登録が完了しました！")
        } catch (error) {
          setIsAdmin(false); 
          alert('管理者の登録に失敗しました')
        }
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
        //記入漏れがあった場合エラー
        if(!address) {
          console.log("All fields are required");
          window.alert("すべての項目を記入してください。");
          return;
        }
        //ウォレットアドレスのフォーマット検証
        if(!ethers.utils.isAddress(address)){
            console.error("Invalid wallet address");
            window.alert("無効なウォレットアドレスです。");
            return;
        }
        //管理者登録できる関数を追加
        setIsAdmin(true); 
        try{
          await employeeIdContract.removeAdmin(address);
          await employeeIdContract.removeAdminFromList(address);
          await businessCardContract.removeAdmin(address);
          await businessCardContract.removeAdminFromList(address);
          setIsAdmin(false);
          alert("管理者の削除が完了しました！")
        } catch (error) {
          setIsAdmin(false);
          alert('管理者の削除に失敗しました')
        }
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  }

  const toggleAdminList = async() => {
    if (!showAdminList) {
      const list = await checkAdmin();
      if(list && list.length > 0) {
        setAdminList(list);
        setShowAdminList(true);
      } else {
        console.log('取得した管理者リストが空または未定義です。');
      }
    } else {
      setShowAdminList(false);
    }
  }
  
  //管理者一覧を表示
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
        if (!adminsOfEmployeeId || adminsOfEmployeeId.length === 0) {
          console.log('取得した管理者リストが空または未定義です。');
          return [];
        }
        console.log('管理者リスト:', adminsOfEmployeeId);
        return adminsOfEmployeeId;
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
        <CustomToolbar />
      <Stack sx={{display: 'flex', flexGrow: 1}}>
        <Drawer sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}
        variant="permanent"
        anchor="left"
        >
            <Typography variant='h5' sx={{ width: '100%', height: 40, textAlign: 'center', marginTop:'15px', fontWeight: 'bold', backgroundColor: 'transparent'}}>
                管理者用
            </Typography>
            <List sx={{ width: '100%', height: 40, textAlign: 'center', marginTop:'15px', fontWeight: 'bold', backgroundColor: 'transparent'}}>
                <ListItem button component={Link} to="/home/company/nft">
                    <ListItemText primary="NFT情報" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
                <ListItem button component={Link} to="/home/mint">
                    <ListItemText primary="社員追加" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
                <ListItem button component={Link} to="/update">
                    <ListItemText primary="社員情報更新" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
                <ListItem button component={Link} to="/home/admin">
                    <ListItemText primary="管理者設定" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
            </List>
        </Drawer>
        <Box  className= "main" sx={{
          flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mt: 5 }}>
              <Typography component="h1" variant="h6" color="inherit" noWrap>
                  管理者設定ページ
              </Typography>
          </Box>
          {showAdminList&& adminList && Array.isArray(adminList) && ( 
            <Box sx={{ width: '50%', mt: 4, bgcolor: '#f0f0f0', p: 2, borderRadius: '10px'}}>
              <Typography variant="h6">管理者一覧:</Typography>
              {adminList.map((admin,index) => (
                <Typography key={index} sx={{ mt: 1 }}>{admin}</Typography>
              ))}
            </Box>
          )}
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
              InputProps={{
                style: { paddingLeft: '10px'}
              }}
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
              onClick={toggleAdminList}
              sx={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '50px', background: '#ffffff' }}>
              管理者一覧を表示する
            </Link>
          </Box>
        </Box>
      </Stack>
      </Box>
      <AdminLoading isAdmin={isAdmin}/>            
    </div>
  )
};

export default Admin;
