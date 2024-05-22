import React, { useEffect, useState} from "react";
import {HomePage} from '../../index.js';
import SubTitle from '../../basic/SubTitle.jsx';
import ContainerForUpdate from '../../basic/ContainerForUpdate.jsx';
import ButtonForUpdate from '../../basic/ButtonForUpdate.jsx';
import EmployeeId from "../../../utils/EmployeeId.json";
import { ethers } from 'ethers';
import Box from '@mui/material/Box'; 
import { Button } from "@mui/material";
import { employeeIdContractAddress } from "../../index.js";
import UpdateComplete from './UpdateComplete.jsx';
import UpdateLoading from './UpdateLoading.jsx';


const UpdateEmployeeId = ()  => {

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

    useEffect(() => {
        getOwnedTokenId();
    }, []);
    
    //ウォレット認証
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

    //所有する社員証NFTのtokenIdを取得
    const getOwnedTokenId = async () => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];
                console.log(address);
                const connectedContract = new ethers.Contract(
                    employeeIdContractAddress,
                    EmployeeId.abi,
                    signer
                );

                //社員証NFTの所有数
                const balance = await connectedContract.balanceOf(newAddress);
                console.log("EmployeeId NFTs: ",balance.toNumber());
                if (balance.toNumber() === 0) {
                    alert("社員証NFTを所有していません")
                    return;
                }

                //所有するNFTのtokenIdを取得
                const tokenIds = [];
                for (let i = 0; i < balance.toNumber(); i++) {
                    const tokenId = await connectedContract.tokenOfOwnerByIndex(newAddress, i);
                    tokenIds.push(tokenId);
                }

                setOwnedTokenIds(tokenIds);


            } else {
                console.log("Ethereum object doesn't exist!");
            }


        } catch (error) {
            console.error('Error checking NFT ownership:', error);
        }
    }
    
    //社員証NFTの情報を更新する
    const updateEmployeeInfo = async() => {
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
                    employeeIdContractAddress,
                    EmployeeId.abi,
                    signer
                );

                const isAdmin = await connectedContract.isAdmin(address);
                if(!isAdmin) {
                window.alert("管理者権限が必要です")
                return;
                }

                setIsUpdating(true); //社員証NFT更新中
                try {
                    const Update = await connectedContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
                    await Update.wait();
                    setIsUpdating(false);
                    setUpdateComplete(true);
                } catch (error) {
                    window.alert('情報の更新に失敗しました')
                    console.error('Error Updating EmployeeId NFT', error);
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
                <HomePage />
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                    <SubTitle title="社員証NFT情報更新ページ"/>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={getOwnedTokenId}
                        sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
                            NFT情報を取得
                    </Button>
                    <ButtonForUpdate onUpdate={updateEmployeeInfo} />
                </Box>
            </Box>
            <UpdateComplete updateComplete={updateComplete}/>
            <UpdateLoading isUpdating={isUpdating}/>            
        </div>
    )
}

export default UpdateEmployeeId;