import React, { useEffect, useState} from "react";
import {HomePage} from '../../index.js';
import SubTitle from '../../basic/SubTitle.jsx';
import ContainerForUpdate from '../../basic/ContainerForUpdate.jsx';
import ButtonForUpdate from '../../basic/ButtonForUpdate.jsx';
import BusinessCard from "../../../utils/BusinessCard.json";
import { ethers } from 'ethers';
import Box from '@mui/material/Box';
import { Button, Drawer, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { businessCardContractAddress } from "../../index.js";
import UpdateComplete from './UpdateComplete.jsx';
import UpdateLoading from './UpdateLoading.jsx';
import CustomToolbar from "../../basic/Toolbar.jsx";
import { Link } from 'react-router-dom';



const UpdateBusinessCard = () => {

    const [newAddress, setNewAddress] = useState("");
    const [newName, setNewName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [tokenId, setTokenId] = useState("");
    const [ownedTokenIds, setOwnedTokenIds] = useState([]); 
    const [currentAccount, setCurrentAccount] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateComplete, setUpdateComplete] = useState(false);


    const drawerWidth = 240;
    const { ethereum } = window;
    // const CONTRACT_ADDRESS = "0x7Fe4108D66665c731415eFc0b952795ba4a7f2F2";

    useEffect(() => {
            getTokenIds(newAddress);
    }, [newAddress]);
    
    //ウォレットを認証する
    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
          console.log("Make sure you have MetaMask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
    
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
    };

    //名刺NFTのtokenIdを取得する
    const getTokenIds = async() => {
        try {
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];

                console.log("Attempting to fetch token IDs for address:", newAddress);
                if(ethers.utils.isAddress(newAddress)) {
                    const connectedContract = new ethers.Contract(
                        businessCardContractAddress,
                        BusinessCard.abi,
                        signer
                    );
                    
                    const tokenIds = await connectedContract.getTokenIds(newAddress);
                    if (tokenIds.length === 0) {
                        alert("名刺NFTを所有していません")
                        return;
                    }
                    const selectedTokenId = tokenIds.toString();
                    setTokenId(selectedTokenId);
                    console.log("BusinessCard Nfts:", tokenIds.toString());
                } else {
                    console.error("Invalid address:", newAddress);
                }
            } else {
                console.log("Ethereum object doesn't exist!");
            }
            
        } catch (error) {
            console.log("名刺NFTを保有していません", error);
        }
    }

    //名刺NFTを更新する
    const updateBusinessCardInfo = async() => {
        //記入漏れがあった場合エラー
        if(!newAddress || !newName || !newDepartment || !newMessage) {
            console.log("All fields are required");
            window.alert("すべての項目を記入してください。");
            return;
        }
    
        //ウォレットアドレスのフォーマット検証
        if(!ethers.utils.isAddress(newAddress)){
            console.error("Invalid wallet address");
            window.alert("無効なウォレットアドレスです。");
            return;
        }
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];
                const connectedContract = new ethers.Contract(
                    businessCardContractAddress,
                    BusinessCard.abi,
                    signer
                );

                const isAdmin = await connectedContract.isAdmin(address);
                if(!isAdmin) {
                window.alert("管理者権限が必要です")
                return;
                }
                setIsUpdating(true); //名刺NFT更新中
                try {
                    setIsUpdating(true); //社員証NFT更新中
                    const Update = await connectedContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
                    await Update.wait();
                    setIsUpdating(false);
                    setUpdateComplete(true);
                } catch (error) {
                    window.alert('情報の更新に失敗しました')
                    console.error('Error Updating BusinessCard NFT', error);
                    setIsUpdating(false);
                    setUpdateComplete(false);

                }

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
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
                    <List>
                        <ListItem button component={Link} to="/home/company/nft">
                            <ListItemText primary="NFT情報" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        <ListItem button component={Link} to="/home/mint">
                            <ListItemText primary="NFTミント" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        <ListItem button component={Link} to="/update">
                            <ListItemText primary="社員情報更新" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        <ListItem button component={Link} to="/home/admin">
                            <ListItemText primary="管理者設定" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                    <SubTitle title="名刺NFT情報更新ページ"/>
                    <ContainerForUpdate
                        newAddress={newAddress}
                        setNewAddress={setNewAddress} 
                        newName={newName}
                        setNewName={setNewName}
                        newDepartment={newDepartment}
                        setNewDepartment={setNewDepartment}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        ownedTokenIds={ownedTokenIds}
                        setOwnedTokenIds={setOwnedTokenIds}
                        tokenId={tokenId}
                        setTokenId={setTokenId}
                    />
                    {/* <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={getTokenIds}
                        sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
                            NFT情報を取得
                    </Button> */}
                    <ButtonForUpdate onUpdate={updateBusinessCardInfo} />
                </Box>
            </Stack>
            </Box>
            <UpdateComplete updateComplete={updateComplete}/>
            <UpdateLoading isUpdating={isUpdating}/>            
        </div>
    )
}

export default UpdateBusinessCard;