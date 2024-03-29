

// NftUploader.jsx
import { ethers } from "ethers";
import EmployeeId from "../../utils/EmployeeId.json";
import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./NftUploader.css";
import { Web3Storage } from 'web3.storage';

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

  const [tokenId, setTokenId] = useState([]);//所有するtokenId
  const [selectedTokenId, setSelectedTokenId] = useState("");//選択されたtokenId
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newMessage, setNewMessage] = useState(""); 

  const ownerAddress = "0x7829e36dd157a6a501f8ea5ebc242a12f6cdbfa7";
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);

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

  const CONTRACT_ADDRESS ="0x1215b8eB3b90EcD2a23dD5eC6Fe2bbDe2897aCF4";

  //コントラクトからNFTミントの認証
  const askContractToMintNft = async () => {
    console.log("Owner address: ", ownerAddress);
      console.log(CONTRACT_ADDRESS);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        console.log("Current address: ", currentAddress);
        // if (currentAddress !== ownerAddress) {//管理者アドレスのチェック
        //   alert("Only the owner can mint NFTs");
        //   return;
        // }
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EmployeeId.abi,
          signer
        );

        //既にミントされているあアカウントか確認する
        // const tokenCount = await connectedContract.getTokenCountByOwner(currentAddress);
        // if (tokenCount.toString() >= 1) {
        //   alert("You have already minted an NFT");
        //   return;
        // }

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintEmployeeIdNFT(address, name, department, message);//ミント処理
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
        );
        navigate('/businesscard');

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //ユーザーの持っているtokenIdをリスト化
  // const fetchTokenIds = async () => {
  //   try{
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  //       const currentAddress = accounts[0];
  //       console.log("Current address: ", currentAddress);
  //       if (currentAddress !== ownerAddress) {//管理者アドレスのチェック
  //         alert("Only the owner can update NFTs");
  //         return;
  //       }
  //       const connectedContract = new ethers.Contract(
  //         CONTRACT_ADDRESS,
  //         Web3Mint.abi,
  //         signer
  //       );
  //       const tokenIds = await connectedContract.getTokenIdsByOwner(address);
  //       setTokenId(tokenIds);
  //       console.log("Listing user's tokenIds:", tokenIds);

  //       //Bignumberと表示されるので文字列に変換する
  //       tokenIds.forEach(tokenIds => {
  //         console.log(tokenIds.toString());
  //       });

  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   }catch (error) {
  //     console.log(error);
  //   }
  // }
  
  // //NFTの更新
  // const UpdateEmployeeInfo = async () => {
  //   if(!selectedTokenId){
  //     alert("Please select a tokenId");
  //     return;
  //   }
  //   try{
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  //       const currentAddress = accounts[0];
  //       console.log("Current address: ", currentAddress);
  //       if (currentAddress !== ownerAddress) {//管理者アドレスのチェック
  //         alert("Only the owner can update NFTs");
  //         return;
  //       }
  //       const connectedContract = new ethers.Contract(
  //         CONTRACT_ADDRESS,
  //         Web3Mint.abi,
  //         signer
  //       );
  //       let txn = await connectedContract.updateEmployeeInfo(
  //         selectedTokenId,
  //         newEmployeeName,
  //         newDepartmentName,
  //         newMessage
  //       );
  //       console.log("Updateing employee info...");
  //       await txn.wait();
  //       console.log(`Updated, see transaction: https://sepolia.etherscan.io/tx/${txn.hash}`);
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   }catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
  <div className="nftUploaderContainer">
    <h1>
      社員証NFTミント
    </h1>
    <Box  sx={{ 
      width: 350,
      height: 400,
      padding: '20px',
      background: '#ffffff', 
      borderRadius: '10px' }}>
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
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={askContractToMintNft}
        sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
          Get your employeeID
      </Button>
      <Link href="#" variant="body2"
        sx={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '20px', background: '#ffffff' }}>
        Already Got your ID?
      </Link>
    </Box>
  </div>   
    
  );
};

export default NftMaker;