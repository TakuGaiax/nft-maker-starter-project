

// NftUploader.jsx
import { ethers } from "ethers";
import EmployeeId from "../../../utils/EmployeeId.json";
import BusinessCard from "../../../utils/BusinessCard.json";
import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./NftUploader.css";
import MintComplete from './Complete.jsx';
import MintEmployeeIdComplete from './CompleteEmployeeId.jsx';
import MintLoading from './MintLoading.jsx';
import { employeeIdContractAddress, businessCardContractAddress } from "../../index.js";

import Box from '@mui/material/Box'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';


const NftMaker = () => {
  const navigate = useNavigate();
  //入力値の状態管理
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [ownedTokenIds, setOwnedTokenIds] = useState([]); 
  const [isMinting, setIsMinting] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [mintCompleteId, setMintCompleteId] = useState(false);


  const ownerAddress = "0x7829e36dd157a6a501f8ea5ebc242a12f6cdbfa7";
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);

  //NFTの保有状況を確認する
  const checkIfUserHasNft = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const Address = accounts[0];
      const employeeIdContract = new ethers.Contract(
        employeeIdContractAddress,
        EmployeeId.abi,
        signer
      );
      const balance = await employeeIdContract.balanceOf(Address);
      console.log(balance.toNumber());
      return balance.toNumber() > 0;
    }
    return false;
  }
  
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


  //コントラクトからNFTミントの認証
  const MintEmployeeIdNft = async () => {
    //記入漏れがあった場合エラー
    if(!address || !name || !department || !message) {
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
    
    console.log("Owner address: ", ownerAddress);
    console.log(employeeIdContractAddress);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        console.log("Current address: ", currentAddress);
       
        //EmployeeIdコントラクト
        const employeeIdContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );

        const isAdmin = await employeeIdContract.isAdmin(currentAddress);
        if(!isAdmin) {
          window.alert("管理者権限が必要です")
          return;
        }
        
        setIsMinting(true); //社員証NFTミント中
        try {
          //社員証NFT
          let nftTxn = await employeeIdContract.mintEmployeeIdNFT(address, name, department, message);
          console.log("社員証NFTをミント中");
          await nftTxn.wait();
          console.log(
            `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
          );
          setIsMinting(false);
          setMintCompleteId(true);
        } catch (error) {
          console.error(error);
          if (error.code === 4001) {
            window.alert("トランザクションが拒否されました。");
          } else {
            window.alert("トランザクション中にエラーが発生しました。");
          }
          setIsMinting(false);
          setMintCompleteId(false);
          return;
        } 
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      window.alert("認証されてウォレットが見つかりません");
    }
  };

  const MintBusinessCardNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        console.log("Current address: ", currentAddress);
       
        //EmployeeIdコントラクト
        const employeeIdContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );
        //BusinessCardコントラクト
        const businessCardContract = new ethers.Contract(
          businessCardContractAddress,
          BusinessCard.abi,
          signer
        );
        const isAdmin = await businessCardContract.isAdmin(currentAddress);
        if(!isAdmin) {
          window.alert("管理者権限が必要です")
          return;
        }
        setMintCompleteId(false);
        setIsMinting(true); //名刺NFTミント中
        try {

          //名刺NFT
          //社員証NFTのtokenIdを取得
          setIsMinting(true);
          const balance = await employeeIdContract.balanceOf(address);
          console.log(`Total NFTs owned: ${balance.toNumber()}`);//NFT総数は読み取れている

          const tokenIds = [];//この配列にtokenIdが入る
          console.log("tokenIds:", tokenIds);

          for (let i = 0; i < balance.toNumber(); i++) {
            try{
              const tokenId = await employeeIdContract.tokenOfOwnerByIndex(address, i);
              console.log(`Token ID at index ${i}: ${tokenId}`);
              tokenIds.push(tokenId.toString());
            } catch (error) {
              console.error(`Error fetching token at index ${i}:`, error);
            }
          }

          //最新のtokenIdを取得
          const latestTokenId = tokenIds[tokenIds.length - 1];
          console.log("Going to pop wallet now to pay gas...");

          let nftTxn2 = await businessCardContract.mintNewBusinessCardNFT(address, latestTokenId, name, department, message);
          console.log("名刺NFTをミント中");
          await nftTxn2.wait();
          console.log(
            `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn2.hash}`
          );
          setIsMinting(false);
          setMintComplete(true);
        } catch (error) {
          console.error(error);
          if (error.code === 4001) {
            window.alert("トランザクションが拒否されました。");
          } else {
            window.alert("トランザクション中にエラーが発生しました。");
          }
          setIsMinting(false);
          setMintComplete(false);
          return;
        } 

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      window.alert("認証されてウォレットが見つかりません");
    }
  };

  const checkAdmin = async () => {
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
                navigate('/home/company/nft')
            } else {
                window.alert('管理者権限が必要です')
            }
        } catch (error) {
            console.log(error);
            window.alert("エラーが発生しました")
        }
  }

  return (
  <div className="nftUploaderContainer">
    <h1>
      社員証&名刺NFT発行
    </h1>
    <Box  sx={{ 
      width: 350,
      height: 400,
      padding: '20px',
      background: '#ffffff', 
      borderRadius: '10px' }}>
      {/* <button onClick={checkIfWalletIsConnected}> Connect Wallet</button> */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="walletAddress"
        label="ウォレットアドレス"
        value={address}
        onChange={(e) => setAddress(e.target.value)} 
        autoFocus
        sx={{ width: '80%', mx: 'auto', display: 'block'}}
        InputProps={{
          style: { paddingLeft: '10px'}
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="employeeName"
        label="社員名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        sx={{ width: '80%',  mx: 'auto', display: 'block'}}
        InputProps={{
          style: { paddingLeft: '10px'}
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="departmentName"
        label="部署名"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        autoFocus
        sx={{ width: '80%', mx: 'auto', display: 'block'}}
        InputProps={{
          style: { paddingLeft: '10px'}
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="Message"
        label="メッセージ"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        sx={{ width: '80%',  mx: 'auto', display: 'block'}}
        InputProps={{
          style: { paddingLeft: '10px'}
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={MintEmployeeIdNft}
        sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
          発行する
      </Button>
      <Link href="#" variant="body2"
        onClick={checkAdmin}
        sx={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '20px', background: '#ffffff' }}>
        管理者専用画面へ
      </Link>
    </Box>
    <MintLoading isMinting={isMinting}/>
    <MintComplete mintComplete={mintComplete}/>
    <MintEmployeeIdComplete mintEmployeeIdComplete={mintCompleteId} MintBusinessCardNft={MintBusinessCardNft}/>
  </div>   
    
  );
};

export default NftMaker;