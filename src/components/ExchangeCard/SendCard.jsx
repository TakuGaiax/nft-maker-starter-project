import React, { useRef, useState, useEffect } from "react";
import { ethers } from 'ethers';
import BusinessCard from "../../utils/BusinessCard.json";
import jsQR from 'jsqr';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';


const SendCard = () => {
    useEffect(() => {
        checkIfWalletIsConnected();
        fetchTokenIds();
    }, []); 
    
    //データの状態管理
    const [tokenIds, setTokenIds] = useState([]);
    const [selectedTokenId, setSelectedTokenId] = useState('');
    const [selectedNftInfo, setSelectedNftInfo] = useState({employeeName: '', department: '', message: '' });
    const [recipientAddress, setRecipientAddress] = useState('');
    const [currentAccount, setCurrentAccount] = useState("");
    const [showQrReader, setShowQrReader] = useState(false);

    const videoRef= useRef(null); 
    const canvasRef = useRef(null);
    const [error, setError] = useState('');

    const { ethereum } = window;
    const CONTRACT_ADDRESS ="0x440f413941fb5069787c3C589177f4e65DEac1e6";

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
    
    


    useEffect(() => {
        if (!showQrReader) {
            return;
        }

        const constraints = {
            video: {
                facingMode: 'environment',
                width: {ideal: 300},
                height: {ideal: 300},
            },
        }

        //デバイスのカメラにアクセス
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream)=> {
                //カメラにアクセスできたらvideo要素にストリームをセット
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    scanQrCode();
                } else {
                    console.log("video object does not exist");
                }
            })
            .catch((error) => {
                console.log('Error accessing media devices:', error);
                setError('カメラへのアクセスに失敗しました。');
            });
                
             

        
        //コンポーネントがアンマウントされたらカメラのストリームを停止する
        const currentVideoRef = videoRef.current;
        return () => {
            if (currentVideoRef && currentVideoRef.srcObject) {
                const stream = currentVideoRef.srcObject;
                const tracks = stream.getTracks();//ビデオトラックを取得
                tracks.forEach((track) => track.stop());
            }
        }

    }, [showQrReader]);

    //QRコードを読み取る
    const scanQrCode = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const ctx = canvas.getContext("2d");//2D描画コンテキスト取得
            if (ctx) {
                //カメラの映像をcanvasに描画する
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                //QRコードをスキャン
                const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
                if (qrCodeData) {
                    //スキャンされた内容を確認する
                    const walletAddress = qrCodeData.data;
                    const isValidEthereumAddress = walletAddress.startsWith('0x') && walletAddress.length === 42;

                    if(!isValidEthereumAddress){
                        setError('対応していないQRコードです');
                        setTimeout(scanQrCode, 100);
                        return;
                    }

                    setRecipientAddress(walletAddress);
                    return;
                }

            }
        } else {
            console.log("canvas object does not exist");
        }
    }
     
    
    //名刺NFTのtokenIdを取得する
    const fetchTokenIds = async () => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];

                const connectedContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    BusinessCard.abi,
                    signer
                );

                //tokenIdを取得する仕組み追加
                try {
                    //スマコンの関数を呼び出してtokenIdを取得
                    const tokenIds = await connectedContract.getTokenIds(address);
                    setTokenIds(tokenIds);
                    return tokenIds;

                } catch (error) {
                    console.error("NFTの取得に失敗");
                    return [];
                }

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
          console.log(error);
        }
    }

    //tokenIdに対応するNFT情報を取得
    const fetchNftInfo = async (tokenId) => {
        if(!tokenId) return;
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            BusinessCard.abi,
            signer
        );

        try {
            const nftInfo = await connectedContract.getBusinessCardInfo(tokenId);
            const [employeeName, departmentName, message] = nftInfo
            setSelectedNftInfo({
                name: employeeName,
                department: departmentName,
                message: message
            });
        } catch (error) {
            console.error("NFT情報が取得できません");
        }
    }

    //NFTをユーザーへ送信する
    const sendNft = async () => {
        //tokenIdとウォレットアドレスが入力されていなかったら終了
        if (!selectedTokenId || !recipientAddress) {
            console.log("Token IDまたは送信先アドレスが指定されていません。");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                BusinessCard.abi,
                signer
            );

            //ミント
            const toAddresses = [recipientAddress];
            const transaction = await connectedContract.mintExistingBusinessCardNFT(selectedTokenId, toAddresses);
            await transaction.wait();

            alert("NFTが送信されました。");

        } catch (error) {
            alert("NFTが送信に失敗しました。");
            console.error("NFTの送信に失敗しました。", error);
        }
    }


    
    return(
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mb:10 }}>
                <Typography component="h1" variant="h6" color="inherit" noWrap>
                    名刺NFT送信専用ページ
                </Typography>
            </Box>
            {/* 選択されたtokenIdに基づいて名刺NFTの情報を表示 */}
            <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb:4}}>
                <Typography variant="body1">社員名: {selectedNftInfo.name}</Typography>
                <Typography variant="body1">部署名: {selectedNftInfo.department}</Typography>
                <Typography variant="body1">メッセージ: {selectedNftInfo.message}</Typography>
            </Box>
            {/* tokenIdを選択する */}
            <Box sx ={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 2}}>
                <FormControl sx={{ width: '30%'}}>
                    <InputLabel id="tokenId-select">TokenID</InputLabel>
                    <Select
                        labelId="tokenId-select"
                        id="tokenId"
                        value={selectedTokenId}
                        label="TokenId"
                        onChange={(e) => {
                            setSelectedTokenId(e.target.value)
                            fetchNftInfo(e.target.value)
                        }}
                        sx={{ 
                            width: '100%',
                            '.MuiSelect-select': {
                                textAlign: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            } 
                        }}
                    >
                        {/* 送信可能なtokenIdのリストを表示 */}
                        {tokenIds.map((tokenId) => (
                            <MenuItem key={tokenId} value={tokenId}>
                                <Typography noWrap>
                                    {tokenId.toString()}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 送信先アドレスを入力する */}
                <TextField
                    fullWidth
                    label="送信先アドレス"
                    variant="outlined"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    sx={{ 
                        mt: 2 , 
                        width: '30%',
                        '.MuiInputBase-input': {
                            textAlign: 'center',
                        },
                    }}
                />
                {/* QRコードでアドレス読み取り */}
                <Button onClick={() => setShowQrReader(!showQrReader)}>
                    {showQrReader ? 'QRリーダーを隠す':'QRコードでアドレスをスキャン'}
                </Button>
                {showQrReader && (
                    <video ref={videoRef} style={{width: '100%'}} autoPlay playsInline></video>
                )}
                <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
                {/* 送信ボタン */}
                <Button variant="contained" sx={{ mt: 2 }} onClick={sendNft}>
                    送信
                </Button>
            </Box>
            
        </>
    )
}

export default SendCard;