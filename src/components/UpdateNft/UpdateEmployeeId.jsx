import React, { useEffect, useState} from "react";
import {HomePage} from '../../components/index.js';
import SubTitle from '../basic/SubTitle.jsx';
import ContainerForUpdate from '../basic/ContainerForUpdate.jsx';
import ButtonForUpdate from '../basic/ButtonForUpdate.jsx';
import EmployeeId from "../../utils/EmployeeId.json";
import { ethers } from 'ethers';
import Box from '@mui/material/Box'; 

const UpdateEmployeeId = ()  => {

    const [newName, setNewName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [tokenId, setTokenId] = useState("");
    const [ownedTokenIds, setOwnedTokenIds] = useState([]); 
    const [currentAccount, setCurrentAccount] = useState("");
    const drawerWidth = 240;
    const CONTRACT_ADDRESS = "0x3043D724C418Fcf60A3E552B606c66F3562311c2";

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
                    CONTRACT_ADDRESS,
                    EmployeeId.abi,
                    signer
                );

                //社員証NFTの所有数
                const balance = await connectedContract.balanceOf(address);
                console.log("EmployeeId NFTs: ",balance.toNumber());
                if (balance.toNumber() === 0) {
                    alert("社員証NFTを所有していません")
                    return;
                }

                //所有するNFTのtokenIdを取得
                const tokenIds = [];
                for (let i = 0; i < balance.toNumber(); i++) {
                    const tokenId = await connectedContract.tokenOfOwnerByIndex(address, i);
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
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];
                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    EmployeeId.abi,
                    signer
                );

                try {
                    const Update = await connectedContract.updateEmployeeInfo(tokenId, newName, newDepartment, newMessage);
                    await Update.wait();
                    alert('社員証情報の更新に成功しました');

                } catch (error) {
                    console.error('Error Updating EmployeeId NFT', error);
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
                    <ButtonForUpdate onUpdate={updateEmployeeInfo} />
                </Box>
            </Box>
            
        </div>
    )
}

export default UpdateEmployeeId;