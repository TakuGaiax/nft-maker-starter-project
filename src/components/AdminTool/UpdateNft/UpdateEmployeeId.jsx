import React, { useEffect, useState} from "react";
import {HomePage} from '../../index.js';
import SubTitle from '../../basic/SubTitle.jsx';
import ContainerForUpdate from '../../basic/ContainerForUpdate.jsx';
import ButtonForUpdate from '../../basic/ButtonForUpdate.jsx';
import EmployeeId from "../../../utils/EmployeeId.json";
import BusinessCard from "../../../utils/BusinessCard.json";
import { ethers } from 'ethers';
import Box from '@mui/material/Box'; 
import { Button, Drawer, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { employeeIdContractAddress } from "../../index.js";
import { businessCardContractAddress } from "../../index.js";
import UpdateComplete from './UpdateComplete.jsx';
import UpdateLoading from './UpdateLoading.jsx';
import CustomToolbar from "../../basic/Toolbar.jsx";
import { Link } from 'react-router-dom';



const UpdateEmployeeId = ()  => {

    const [newAddress, setNewAddress] = useState("");
    const [minters, setMinters] = useState([]);
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
        getOwnedTokenId(newAddress);
    }, [newAddress]);
    
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
                // const tokenIds = [];
                // for (let i = 0; i < balance.toNumber(); i++) {
                //     const tokenId = await connectedContract.tokenOfOwnerByIndex(newAddress, i);
                //     tokenIds.push(tokenId);
                // }
                const tokenId = await connectedContract.tokenOfOwnerByIndex(newAddress, 0);
                setTokenId(tokenId.toString());

                // setOwnedTokenIds(tokenIds);


            } else {
                console.log("Ethereum object doesn't exist!");
            }


        } catch (error) {
            console.error('Error checking NFT ownership:', error);
        }
    }

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
    
    //社員証NFTの情報を更新する
    const updateInfo = async() => {
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


                const isAdmin = await employeeIdContract.isAdmin(address);
                if(!isAdmin) {
                window.alert("管理者権限が必要です")
                return;
                }

                setIsUpdating(true); //社員証NFT更新中
                try {
                    const updateEmployeeId = await employeeIdContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
                    await updateEmployeeId.wait();
                    const updateBusinessCard = await businessCardContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
                    await updateBusinessCard.wait();
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
    //名刺NFTを更新する
    // const updateBusinessCardInfo = async() => {
    //     //記入漏れがあった場合エラー
    //     if(!newAddress || !newName || !newDepartment || !newMessage) {
    //         console.log("All fields are required");
    //         window.alert("すべての項目を記入してください。");
    //         return;
    //     }
    
    //     //ウォレットアドレスのフォーマット検証
    //     if(!ethers.utils.isAddress(newAddress)){
    //         console.error("Invalid wallet address");
    //         window.alert("無効なウォレットアドレスです。");
    //         return;
    //     }
    //     try {
    //         if (ethereum) {
    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             const signer = provider.getSigner();
    //             const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    //             const address = accounts[0];
    //             const connectedContract = new ethers.Contract(
    //                 businessCardContractAddress,
    //                 BusinessCard.abi,
    //                 signer
    //             );

    //             const isAdmin = await connectedContract.isAdmin(address);
    //             if(!isAdmin) {
    //             window.alert("管理者権限が必要です")
    //             return;
    //             }
    //             setIsUpdating(true); //名刺NFT更新中
    //             try {
    //                 setIsUpdating(true); //社員証NFT更新中
    //                 const Update = await connectedContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
    //                 await Update.wait();
    //                 setIsUpdating(false);
    //                 setUpdateComplete(true);
    //             } catch (error) {
    //                 window.alert('情報の更新に失敗しました')
    //                 console.error('Error Updating BusinessCard NFT', error);
    //                 setIsUpdating(false);
    //                 setUpdateComplete(false);

    //             }

    //         } else {
    //             console.log("Ethereum object doesn't exist!");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }


    // }
    
    
    return (
        <div>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
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
                        <ButtonForUpdate onUpdate={updateInfo} />
                    </Box>
            <UpdateComplete updateComplete={updateComplete} setUpdateComplete={setUpdateComplete}/>
            <UpdateLoading isUpdating={isUpdating}/>            
        </div>
    )
}

export default UpdateEmployeeId;