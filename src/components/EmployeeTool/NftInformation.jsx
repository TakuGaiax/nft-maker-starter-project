import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomToolbar from '../basic/Toolbar'
import DrawItem from '../basic/DrawItem'
import SendCard from './ExchangeCard/SendCard'
import { ethers } from 'ethers';
import EmployeeId from "../../utils/EmployeeId.json";
import BusinessCard from "../../utils/BusinessCard.json";
import { employeeIdContractAddress, businessCardContractAddress } from "../index.js";



function NftInformation() {

    const drawerWidth = 240;
    const { ethereum } = window;

    const [currentAccount, setCurrentAccount] = useState("");
    const [employeeIdTokenIds, setEmployeeIdTokenIds] = useState([]);
    const [selectedEmployeeIdInfo, setSelectedEmployeeIdInfo] = useState({employeeName: '', department: '', message: '' });
    const [businessCardTokenIds, setBusinessCardTokenIds] = useState([]);
    const [selectedBusinessCardInfo, setSelectedBusinessCardInfo] = useState({employeeName: '', department: '', message: '' });
    const [employeeIdLink, setEmployeeIdLink] = useState();
    const [businessCardLink, setBusinessCardLink] = useState();

    useEffect(() => {
        
    

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
          showBusinessCardNft(account);
        } else {
          console.log("No authorized account found");
        }
    };
    checkIfWalletIsConnected();
    }, [])

    //名刺NFTの情報を閲覧
    const showBusinessCardNft = async (account) => {
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
                const tokenIds = await businessCardContract.getTokenIds(account);
                console.log('TokenId:',tokenIds.toString());
                setBusinessCardTokenIds(tokenIds.toString());

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
                    const employeeIdLink = `https://testnets.opensea.io/assets/sepolia/${employeeIdContractAddress}/${tokenIds.toString()}`
                    setEmployeeIdLink(employeeIdLink);
                    const businessCardLink = `https://testnets.opensea.io/assets/sepolia/${businessCardContractAddress}/${tokenIds.toString()}`
                    setBusinessCardLink(businessCardLink);
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
    
    //社員証NFTの情報を閲覧
    // const showEmployeeIdNft = async () => {
    //     try {
    //         if (ethereum) {
    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             const signer = provider.getSigner();
    //             const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    //             const address = accounts[0];

    //             const employeeIdContract = new ethers.Contract(
    //                 employeeIdContractAddress,
    //                 EmployeeId.abi,
    //                 signer
    //             );

    //             //社員証NFTのIdを取得
    //             const balance = await employeeIdContract.balanceOf(currentAccount);
    //             console.log(`Total NFTs owned: ${balance.toNumber()}`);//NFT総数は読み取れている      
    //             const tokenIds = [];//この配列にtokenIdが入る
    //             console.log("tokenIds:", tokenIds);

    //             for (let i = 0; i < balance.toNumber(); i++) {
    //             try{
    //                 const tokenId = await employeeIdContract.tokenOfOwnerByIndex(currentAccount, i);
    //                 console.log(`Token ID at index ${i}: ${tokenId}`);
    //                 tokenIds.push(tokenId.toString());
    //             } catch (error) {
    //                 console.error(`Error fetching token at index ${i}:`, error);
    //             }
    //             } 
        
    //             //最新のtokenIdを取得
    //             const latestTokenId = tokenIds[tokenIds.length - 1];
    //             console.log("Going to pop wallet now to pay gas...");

    //             setEmployeeIdTokenIds(latestTokenId);

    //             if(latestTokenId) {
    //                 const nftInfo = await employeeIdContract.getEmployeeIdInfo(latestTokenId);//コントラクトを変更する必要あり
    //                 const [employeeName, departmentName, message] = nftInfo
    //                 setSelectedEmployeeIdInfo({
    //                     name: employeeName,
    //                     department: departmentName,
    //                     message: message
    //                 });
    //             } 
    //         } else {
    //             console.log("Ethereum object doesn't exist!");
    //         }
    //     } catch (error) {
    //         console.error('Error');
    //     }

    // }

    


    return (
        <Box sx={{ display: 'flex', flexDirection: 'columu', height: '100vh' }}>
            <CustomToolbar />
        <Stack sx={{display: 'flex', flexGrow: 1}}>
                <DrawItem />
                {/* <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                    <SendCard />
                </Box> */}
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`, marginTop: 10}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mb:10 }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                            MyNFT 閲覧ページ
                        </Typography>
                    </Box>
                    {/* 選択されたtokenIdに基づいて名刺NFTの情報を表示 */}
                    <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb:4}}>
                        <Typography variant="body1">社員名: {selectedBusinessCardInfo.name}</Typography>
                        <Typography variant="body1">部署名: {selectedBusinessCardInfo.department}</Typography>
                        <Typography variant="body1">メッセージ: {selectedBusinessCardInfo.message}</Typography>
                    </Box>
                    <Box sx={{mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'center', gap: 2, mb:4}}>
                        {employeeIdLink && (
                            <Button href={employeeIdLink}>社員証をOpenSeaで見る</Button>
                        )}
                        {employeeIdLink && (
                            <Button href={businessCardLink}>名刺をOpenSeaで見る</Button>
                        )}
                    </Box>
                    {/* <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Stack direction="row" spacing={2}>
                            <Button>社員証NFT</Button>
                            <Button>名刺NFT</Button>
                        </Stack>
                    </Box> */}
                </Box>
            </Stack>
        </Box>
  )
}

export default NftInformation
