import React, { useEffect, useState} from "react";
import {HomePage} from '../../components/index.js';
import SubTitle from '../basic/SubTitle.jsx';
import ContainerForUpdate from '../basic/ContainerForUpdate.jsx';
import ButtonForUpdate from '../basic/ButtonForUpdate.jsx';
import EmployeeId from "../../utils/EmployeeId.json";
import { ethers } from 'ethers';
import Box from '@mui/material/Box'; 
import { Button } from "@mui/material";

const UpdateEmployeeId = ()  => {

    const [newAddress, setNewAddress] = useState("");
    const [newName, setNewName] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [tokenId, setTokenId] = useState("");
    const [ownedTokenIds, setOwnedTokenIds] = useState([]); 
    const [currentAccount, setCurrentAccount] = useState("");
    const drawerWidth = 240;
    const CONTRACT_ADDRESS = "0x8C396b9bD7aA43e15c9268291f8Ce62807799037";

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

    // //所有する社員証NFTのtokenIdを取得
    // const CheckNft = async () => {
    //     try {
    //       const { ethereum } = window;
    //       if (ethereum) {
    //         const provider = new ethers.providers.Web3Provider(ethereum);
    //         const signer = provider.getSigner();
    //         const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    //         const currentAddress = accounts[0];
    //         console.log("Current address: ", currentAddress);
           
    //         //EmployeeIdコントラクト
    //         const employeeIdContract = new ethers.Contract(
    //             CONTRACT_ADDRESS,
    //             EmployeeId.abi,
    //             signer
    //         );
    //         try {
    //           //社員証NFTのtokenIdを取得
    //           const balance = await employeeIdContract.balanceOf(address);
    //           console.log(`Total NFTs owned: ${balance.toNumber()}`);//NFT総数は読み取れている
    
    //           const tokenIds = [];//この配列にtokenIdが入る
    //           console.log("tokenIds:", tokenIds);
    
    //           for (let i = 0; i < balance.toNumber(); i++) {
    //             try{
    //               const tokenId = await employeeIdContract.tokenOfOwnerByIndex(currentAddress, i);
    //               console.log(`Token ID at index ${i}: ${tokenId}`);
    //               tokenIds.push(tokenId.toString());
    //             } catch (error) {
    //               console.error(`Error fetching token at index ${i}:`, error);
    //             }
    //           }
    
    //           setOwnedTokenIds(tokenIds);
    //           console.log('tokenId is:', tokenId);
    //         } catch (error) {
    //           console.error(error);
    //           window.alert('社員証NFTが見つかりません。')
    //           return;
    //         } 
    //       } else {
    //         console.log("Ethereum object doesn't exist!");
    //       }
    //     } catch (error) {
    //       console.log(error);
    //       window.alert("認証されてウォレットが見つかりません");
    //     }
    //   };
    
    
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
            
        </div>
    )
}

export default UpdateEmployeeId;