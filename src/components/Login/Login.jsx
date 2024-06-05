import React, { useRef, useState, useEffect } from "react";
import { ethers } from "ethers";
import EmployeeId from "../../utils/EmployeeId.json";
import BusinessCard from "../../utils/BusinessCard.json";
import { useNavigate } from 'react-router-dom';
import CheckLoading from './CheckLoading';
import CheckComplete from './CheckComplete';
import { employeeIdContractAddress, businessCardContractAddress } from "..";


import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Login = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [checkComplete, setCheckComplete] = useState(false);

    const navigate = useNavigate();
    
    //社員証NFTの保有確認し、ホーム画面へ
    const handleEmployeeLogin = async() => {
        const { ethereum } = window;
        try{
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            const Address = accounts[0];

            //社員証NFTの保有確認
            const employeeIdContract = new ethers.Contract(
                employeeIdContractAddress, 
                EmployeeId.abi, 
                signer
            );
            setIsChecking(true);
            try{
                console.log("社員証NFTの保有確認を開始します...");
                const employeeIdBalance = await employeeIdContract.balanceOf(Address);
                console.log(`保有している社員証NFTの数: ${employeeIdBalance.toNumber()}`);
                
                if (employeeIdBalance.toNumber() > 0 ) {
                    setIsChecking(false);
                    setCheckComplete(true);
                    navigate('/home/employee/nft')
                } else {
                    window.alert('社員証NFTと名刺NFTのどちらも、またはどちらかを保有していません。');
                    setIsChecking(false);
                    setCheckComplete(false);
                }
            } catch (error) {
                console.error(error);
                if (error.code === 4001) {
                    window.alert("トランザクションが拒否されました。");
                } else {
                    window.alert("トランザクション中にエラーが発生しました。");
                }
                setIsChecking(false);
                setCheckComplete(false);
            }
        } catch (error) {
            console.log(error);
            window.alert("認証できるウォレットが見つかりません");
            setIsChecking(false);
            setCheckComplete(false);
        }
        
        
    }

    const handleAdminLogin = async() => {
        const { ethereum } = window;
        try {
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
            const isAdminEmployeeId = await employeeIdContract.isAdmin(currentAddress);
            console.log(isAdminEmployeeId)
            const isAdminBusinessCard = await businessCardContract.isAdmin(currentAddress);
            console.log(isAdminBusinessCard)
            if(isAdminEmployeeId && isAdminBusinessCard) {
                navigate('/mint')
            } else {
                window.alert('管理者権限が必要です')
            }
        } catch (error) {
            console.log(error);
            window.alert("エラーが発生しました")
        }
    }
    
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                        marginBottom: 4,
                        textAlign: 'center',
                        fontWeight: '700',
                    }}
                >
                    Login
                </Typography>
                <Stack direction="column" spacing={2}>
                    <Button 
                        variant="contained" 
                        onClick={handleAdminLogin}
                        sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: 'grey',
                            },
                            width: 200,
                            height: 50,
                        }}
                    >
                        法人用ログイン
                    </Button>
                    <Button 
                        variant="contained" 
                        sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: 'grey',
                            },
                            width: 200,
                            height: 50,
                        }}
                        onClick={handleEmployeeLogin}
                    >
                        社員用ログイン
                    </Button>
                </Stack>
            </Box>
            <CheckLoading isChecking={isChecking}/>
            <CheckComplete checkComplete={checkComplete}/>
        </>
    )
}

export default Login;

