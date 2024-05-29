
import { ethers } from "ethers";
import BusinessCard from "../../../utils/BusinessCard.json";
import EmployeeId from "../../../utils/EmployeeId.json";
import { employeeIdContractAddress, businessCardContractAddress } from "../../index.js";

import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BusinessCard.css";
import MintComplete from '../../Login/NftUploader/Complete.jsx';
import MintEmployeeIdComplete from '../../Login/NftUploader/CompleteEmployeeId.jsx';
import MintLoading from '../../Login/NftUploader/MintLoading.jsx';

import Box from '@mui/material/Box'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const BusinessCardMint = () => {
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

  const [selectedTokenId, setSelectedTokenId] = useState("");//選択されたtokenId
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newMessage, setNewMessage] = useState(""); 

  // const businessCardContractAddress ="0x7Fe4108D66665c731415eFc0b952795ba4a7f2F2";
  // const employeeIdContractAddress ="0x8553c5530f63D385Fb89a2feAC96C1f0F770b82e";

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

          let nftTxn2 = await businessCardContract.mintNewBusinessCardNFT(address, tokenId, name, department, message);
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

  const CheckNft = async () => {
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
        try {
          //社員証NFTのtokenIdを取得
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

          setOwnedTokenIds(tokenIds);
          console.log('tokenId is:', tokenId);
        } catch (error) {
          console.error(error);
          window.alert('社員証NFTが見つかりません。')
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


  
  return (
    <div className="nftUploaderContainer">
      <h1>
        名刺NFTミント
      </h1>
      <Box  sx={{ 
        width: 350,
        height: 400,
        padding: '20px',
        background: '#ffffff', 
        borderRadius: '10px' }}>
        <select
          value = {tokenId}
          onChange = {(e) => setTokenId(e.target.value)}
          style ={{width: '80%', height: '40px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
        >
          <option value ="">社員証のNFTを取得する</option>
          {ownedTokenIds.map((id) => (
            <option key={id} value={id}>
              TokenId: {id}
            </option>
          ))}
        </select>
        <TextField
          margin="normal"
          required
          fullWidth
          id="walletaddress"
          label="ウォレットアドレス"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
          onClick={CheckNft}
          sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
            NFT情報を取得
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={MintBusinessCardNft}
          sx={{ width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}>
            名刺NFTをミント
        </Button>
      </Box>
      <MintLoading isMinting={isMinting}/>
      <MintComplete mintComplete={mintComplete}/>
      <MintEmployeeIdComplete mintEmployeeIdComplete={mintCompleteId} MintBusinessCardNft={MintBusinessCardNft}/>
    </div>   
  );
};
export default BusinessCardMint;