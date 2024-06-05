import React, { useEffect, useState} from "react";
import {HomePage} from '../../index.js';
import SubTitle from '../../basic/SubTitle.jsx';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Drawer, List, ListItem, ListItemText, Stack } from "@mui/material";
import CustomToolbar from "../../basic/Toolbar.jsx";

const UpdateHome = () => {

    const drawerWidth=240;
    
    return (
        <div>
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
                    <List>
                        <ListItem button component={Link} to="/home/company/nft">
                            <ListItemText primary="NFT情報" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        <ListItem button component={Link} to="/home/mint">
                            <ListItemText primary="NFTミント" sx={{backgroundColor: 'transparent'}}/>
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5, mb:5, mt: 5 }}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap>
                            NFT更新ページ
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                        {/* <Typography variant="h4" gutterBottom>社員証NFT</Typography> */}
                        {/* <Link to ="/update/employeeid" >

                        </Link> */}
                        <Paper sx={{ width: '50%', height: '20%', padding: '20px', cursor: 'pointer', marginBottom: '20px', marginTop: '-200px', borderRadius: '16px' }}
                            onClick={() => window.location.href = '/update/employeeid'}
                        >
                            <Typography>社員証NFTを更新</Typography>
                        </Paper>
                        {/* <Typography variant="h4" gutterBottom>名刺NFT</Typography> */}
                        <Paper sx={{ width: '50%', height: '20%', padding: '20px', cursor: 'pointer', marginBottom: '20px', borderRadius: '16px' }}
                            onClick={() => window.location.href = '/update/businesscard'}
                        >
                            <Typography>名刺NFTを更新</Typography>
                        </Paper>
                    </Box>
                </Box>
            </Stack>
            </Box>
        </div>

    )
}

export default UpdateHome