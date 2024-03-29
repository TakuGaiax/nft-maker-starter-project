
import { ethers } from "ethers";
import BusinessCard from "../../utils/BusinessCard.json";
import EmployeeId from "../../utils/EmployeeId.json";

import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BusinessCard.css";

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

  const businessCardContractAddress ="0x0961e83A96DC9bAB3FC56b1c5d1dbD7F17e68520";
  const employeeIdContractAddress ="0x1215b8eB3b90EcD2a23dD5eC6Fe2bbDe2897aCF4";

  //所有している社員証NFTのtokenIdを取得
  useEffect(() => {
    fetchEmployeeIdsNFT();
  }, []);

  const fetchEmployeeIdsNFT = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        const connectedContract = new ethers.Contract(
          employeeIdContractAddress,
          EmployeeId.abi,
          signer
        );
        
        //社員証NFTの総数を確認する
        const balance = await connectedContract.balanceOf(currentAddress);
        console.log(`Total NFTs owned: ${balance.toNumber()}`);//NFT総数は読み取れている
        // if (balance.toNumber() === 0) {
        //   console.error("You do not own any EmployeeId NFTs.");
        //   return;
        // }

        //取得したtokenIdを配列に組み込みリターン
        const tokenIds = [];
        console.log("tokenIds:", tokenIds);//配列の中に何もない

        for (let i = 0; i < balance.toNumber(); i++) {
          try{
            const tokenId = await connectedContract.tokenOfOwnerByIndex(currentAddress, i);
            console.log(`Token ID at index ${i}: ${tokenId}`);
            tokenIds.push(tokenId.toString());
          } catch (error) {
            console.error(`Error fetching token at index ${i}:`, error);
          }
        }


        setOwnedTokenIds(tokenIds);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("Error fetching owned NFTs:", error);
    }
  }
  
  //コントラクトから名刺NFTのミントを認証
  const askContractToMintNft = async () => {
    console.log("Owner address: ", ownerAddress);
      console.log(businessCardContractAddress);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const currentAddress = accounts[0];
        console.log("Current address: ", currentAddress);

        const connectedContract = new ethers.Contract(
          businessCardContractAddress,
          BusinessCard.abi,
          signer
        );

 
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintNewBusinessCardNFT(tokenId, name, department, message);//ミント処理
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
        );
        navigate('/home');

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
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
            Get your Business Card
        </Button>
      </Box>
    </div>   
  );
};
export default NftMaker;