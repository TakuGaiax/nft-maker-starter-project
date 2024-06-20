import { Box, Button, Drawer, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomToolbar from '../basic/Toolbar'
import DrawItem from '../basic/DrawItem'
import { ethers } from 'ethers';
import EmployeeId from "../../utils/EmployeeId.json";
import BusinessCard from "../../utils/BusinessCard.json";
import { employeeIdContractAddress, businessCardContractAddress, HomePage } from "../index.js";
import { Link } from 'react-router-dom';




function AdminNftInformation() {

    const drawerWidth = 240;
    const { ethereum } = window;

    const [currentAccount, setCurrentAccount] = useState("");
    const [employeeIdTokenIds, setEmployeeIdTokenIds] = useState([]);
    const [selectedEmployeeIdInfo, setSelectedEmployeeIdInfo] = useState({employeeName: '', department: '', message: '' });
    const [businessCardTokenIds, setBusinessCardTokenIds] = useState([]);
    const [selectedBusinessCardInfo, setSelectedBusinessCardInfo] = useState({employeeName: '', department: '', message: '' });
    const [recipientAddress, setRecipientAddress] = useState('');
    const [minters, setMinters] = useState([]);
    const [nfts, setnfts] = useState([]);
    const [employeeIdLink, setEmployeeIdLink] = useState();
    const [businessCardLink, setBusinessCardLink] = useState();


    useEffect(() => {
    //ウォレット認証
        const fetchMinters = async() => {
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

                try{
                    const minterAddresses = await connectedContract.getAllMinters();
                    setMinters(minterAddresses);
                }
                catch (error) {
                    console.error('Error fetching minters:', error)
                }
            }
        }
        fetchMinters();

    }, []);

    useEffect(() => {
        if(recipientAddress) {
            showBusinessCardNft(recipientAddress);
        }
    }, [recipientAddress]);

    //名刺NFTの情報を閲覧
    const showBusinessCardNft = async (recipientAddress) => {
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
                const tokenIds = await businessCardContract.getTokenIds(recipientAddress);
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

    useEffect(() => {
        const fetchNfts = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                const businessCardContract = new ethers.Contract(
                    businessCardContractAddress,
                    BusinessCard.abi,
                    signer
                );

                const tokenIds = await businessCardContract.getTokenIds(recipientAddress);
                const svgData = await Promise.all(tokenIds.map(async (tokenId) => {
                    const tokenURI = await businessCardContract.uri(tokenId);
                    const res = await fetch(tokenURI);
                    const metadata = await res.json();
                    const decodedSvg = atob(metadata.image.split(',')[1]);
                    console.log(decodedSvg)
                    return { id: tokenId.toString(), image: decodedSvg};
                }))
                // console.log(svgData);
                setnfts(svgData);
            }
        };

        if (recipientAddress) {
            fetchNfts();
        }
    }, [recipientAddress]);
    


    return (
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
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mb:5, mt:5 }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                            MyNFT 閲覧ページ
                        </Typography>
                    </Box>
                    {/* <Box>
                        {nfts.map((nft) => {
                            <Box key={nft.id} sx={{margin: 2 }}>
                                <div
                                    dangerouslySetInnerHTML={{ __html: nft.image }}
                                    style={{ maxWidth: '100%' }}
                                />
                            </Box>
                        })}
                    </Box> */}
                    {/* 選択されたtokenIdに基づいて名刺NFTの情報を表示 */}
                    <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb:4}}>
                        <Typography variant="body1">社員名: {selectedBusinessCardInfo.name}</Typography>
                        <Typography variant="body1">部署名: {selectedBusinessCardInfo.department}</Typography>
                        <Typography variant="body1">メッセージ: {selectedBusinessCardInfo.message}</Typography>
                        <Box>
                            {employeeIdLink && (
                                <Button href={employeeIdLink}>社員証をOpenSeaで見る</Button>
                            )}
                            {businessCardLink && (
                                <Button href={businessCardLink}>名刺をOpenSeaで見る</Button>
                            )}
                        </Box>
                    </Box>
                    <Box sx ={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 2}}>
                        <select
                            value = {recipientAddress}
                            onChange = {(e) => setRecipientAddress(e.target.value)}
                            style ={{width: '30%', height: '40px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
                            >
                                <option value ="">アドレス選択</option>
                                {minters.map((address, index) => (
                                    <option key={index} value={address}>
                                    {address}
                                </option>
                            ))}
                        </select>

                    </Box>
                </Box>
            </Stack>
        </Box>
  )
}

export default AdminNftInformation
