import React from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { Box, Typography } from "@mui/material";

const DrawItem = () => {

    const drawerWidth = 240;

    return(
        <>
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
                社員用
            </Typography>
            <List sx={{backgroundColor: 'transparent'}}>
                <ListItem button component={Link} to="/home/employee/nft">
                    <ListItemText primary="NFT情報" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
                <ListItem button component={Link} to="/send">
                    <ListItemText primary="名刺交換" sx={{backgroundColor: 'transparent'}}/>
                </ListItem>
            </List>
        </Drawer>
        </>
    )
}

export default DrawItem;