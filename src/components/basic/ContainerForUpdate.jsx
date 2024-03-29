import React, { useState } from "react";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';


const ContainerForUpdate = ({ newName, setNewName, newDepartment, setNewDepartment, newMessage, setNewMessage, ownedTokenIds, tokenId, setTokenId }) => {

    return(
        <>
            <Container maxWidth="sm" sx={{ mt: 8}}>
                <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '16px'}}>
                    <select
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
                    </select>
                    <TextField
                        label="名前"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="部署名"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="メッセージ"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Paper>
            </Container>
        </>
    )
}

export default ContainerForUpdate;