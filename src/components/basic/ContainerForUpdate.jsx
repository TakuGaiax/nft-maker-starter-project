import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';
import EmployeeId from "../../utils/EmployeeId.json";
import { employeeIdContractAddress } from "..";

const { ethereum } = window;

const ContainerForUpdate = ({ newAddress, setNewAddress, newName, setNewName, newDepartment, setNewDepartment, newMessage, setNewMessage, ownedTokenIds, tokenId, setTokenId }) => {

    const [minters, setMinters] = useState([]);
    
    useEffect(() => {
        const fetchMinters = async() => {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                const address = accounts[0];
                const connectedContract = new ethers.Contract(
                    employeeIdContractAddress,
                    EmployeeId.abi,
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
    }, [])
    
    
    
    return(
        <>
            <Container maxWidth="sm" >
                
                <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '16px'}}>
                    {/* <select
                    value = {tokenId}
                    onChange = {(e) => setTokenId(e.target.value)}
                    style ={{width: '80%', height: '40px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <option value ="">NFTを取得する</option>
                        {ownedTokenIds.map((id) => (
                            <option key={id.toString()} value={id}>
                            TokenId: {id.toString()}
                        </option>
                    ))}
                    </select> */}
                    <select
                    value = {newAddress}
                    onChange = {(e) => setNewAddress(e.target.value)}
                    style ={{width: '80%', height: '40px', marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <option value ="">アドレス一覧</option>
                        {minters.map((address, index) => (
                            <option key={index} value={address}>
                            {address}
                        </option>
                    ))}
                    </select>
                    {/* <TextField
                        label="ウォレットアドレス"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        variant="outlined"
                        fullWidth
                    /> */}
                    <TextField
                        label="名前"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            style: { paddingLeft: '10px'}
                        }}
                    />
                    <TextField
                        label="部署名"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            style: { paddingLeft: '10px'}
                        }}
                    />
                    <TextField
                        label="メッセージ"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        InputProps={{
                            style: { paddingLeft: '10px'}
                        }}
                    />
                </Paper>
            </Container>
        </>
    )
}

export default ContainerForUpdate;