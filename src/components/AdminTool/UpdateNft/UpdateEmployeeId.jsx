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
    const [businessCardSvgData, setBusinessCardSvgData] = useState("");
    const [employeeIdSvgData, setEmployeeIdSvgData] = useState("");
    const [employeeIdLink, setEmployeeIdLink] = useState();
    const [businessCardLink, setBusinessCardLink] = useState();
    const [selectedEmployeeIdInfo, setSelectedEmployeeIdInfo] = useState({employeeName: '', department: '', message: '' });
    const [selectedBusinessCardInfo, setSelectedBusinessCardInfo] = useState({employeeName: '', department: '', message: '' });
    const [employeeIdTokenIds, setEmployeeIdTokenIds] = useState([]);

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
    
    useEffect(() => {
        if(newAddress) {
            showBusinessCardNft(newAddress);
            showEmployeeIdNft(newAddress);
        }
    }, [newAddress]);

    //名刺NFTの情報を閲覧
    const showBusinessCardNft = async (newAddress) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                const businessCardContract = new ethers.Contract(
                    businessCardContractAddress,
                    BusinessCard.abi,
                    signer
                );

                //tokenIdを取得する仕組み追加
                const tokenIds = await businessCardContract.getTokenIds(newAddress);
                console.log('TokenId:',tokenIds.toString());
                // setBusinessCardTokenIds(tokenIds.toString());

                //tokenIdに対応する情報を反映
                try {
                    const nftInfo = await businessCardContract.getBusinessCardInfo(tokenIds.toString());
                    const [employeeName, departmentName, message] = nftInfo
                    setSelectedBusinessCardInfo({
                        name: employeeName,
                        department: departmentName,
                        message: message
                    });
                    //OpenSeaリンクの表示
                    const businessCardLink = `https://testnets.opensea.io/assets/sepolia/${businessCardContractAddress}/${tokenIds.toString()}`
                    setBusinessCardLink(businessCardLink);
                    //SVGデータの表示
                    const svg = await businessCardContract.getSVGData(tokenIds.toString());
                    console.log("SVG data:",svg)
                    setBusinessCardSvgData(svg);
                } catch (error) {
                    console.error("NFT情報が取得できません");
                }
            } else {
                console.log("Ethereum object doesn't exist!");
            }

        } catch (error) {
            console.log(error);
        }
    }

    //社員証NFTの情報閲覧
    const showEmployeeIdNft = async (newAddress) => {
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

                //社員証NFTのIdを取得
                const balance = await employeeIdContract.balanceOf(newAddress);
                console.log(`Total NFTs owned: ${balance.toNumber()}`);//NFT総数は読み取れている      
                const tokenIds = [];//この配列にtokenIdが入る
                console.log("tokenIds:", tokenIds);

                for (let i = 0; i < balance.toNumber(); i++) {
                try{
                    const tokenId = await employeeIdContract.tokenOfOwnerByIndex(newAddress, i);
                    console.log(`Token ID at index ${i}: ${tokenId}`);
                    tokenIds.push(tokenId.toString());
                } catch (error) {
                    console.error(`Error fetching token at index ${i}:`, error);
                }
                } 
        
                //最新のtokenIdを取得
                const latestTokenId = tokenIds[tokenIds.length - 1];
                console.log("Going to pop wallet now to pay gas...");

                setEmployeeIdTokenIds(latestTokenId);

                //tokenIdに対応する情報を反映
                try {
                    const nftInfo = await employeeIdContract.getSVGData(latestTokenId);//コントラクトを変更する必要あり
                    const [employeeName, departmentName, message] = nftInfo
                    setSelectedEmployeeIdInfo({
                        name: employeeName,
                        department: departmentName,
                        message: message
                    });
                    //OpenSeaリンクの表示
                    const employeeIdLink = `https://testnets.opensea.io/assets/sepolia/${employeeIdContractAddress}/${tokenIds.toString()}`
                    setEmployeeIdLink(employeeIdLink);
                    //SVGデータの表示
                    const svg = await employeeIdContract.getSVGData(latestTokenId);
                    console.log("SVG data:",svg)
                    setEmployeeIdSvgData(svg);
                } catch (error) {
                    console.error("NFT情報が取得できません:", error);
                }
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.error(error);
        }

    }

    
    return (
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  paddingLeft: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)`, height: '100vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mb:5, mt:5 }}>
                <Typography component="h1" variant="h6" color="inherit" noWrap>
                    社員証・名刺更新
                </Typography>
            </Box>
            <Box sx={{mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center', gap: 2}}>
                {/* 社員証NFTSVG画像を表示する */}
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2, mb:4}}>
                    {employeeIdSvgData && (
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <img 
                                src={employeeIdSvgData.startsWith('data:image/svg+xml;base64,') ? employeeIdSvgData : `data:image/svg+xml;base64,${employeeIdSvgData}`} 
                                alt="EmployeeId NFT SVG" 
                                width="400"
                                height="400"
                            />
                        </Box>
                        
                    )}
                    {employeeIdLink && (
                        <Button href={employeeIdLink}>社員証をOpenSeaで見る</Button>
                    )}
                </Box>
                {/* 名刺NFTSVG画像を表示する */}
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2, mb:4}}>
                    {businessCardSvgData && (
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <img 
                                src={businessCardSvgData.startsWith('data:image/svg+xml;base64,') ? businessCardSvgData : `data:image/svg+xml;base64,${businessCardSvgData}`} 
                                alt="Business-Card NFT SVG" 
                                width="400"
                                height="400"
                            />
                        </Box>
                    )}
                    {businessCardLink && (
                        <Button href={businessCardLink}>名刺をOpenSeaで見る</Button>
                    )}
                </Box>
            </Box>
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
        </Box>
    )
}

export default UpdateEmployeeId;