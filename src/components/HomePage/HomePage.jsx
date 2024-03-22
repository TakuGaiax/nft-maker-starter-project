import React from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'; 
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const HomeScreen = () => {

    const drawerWidth = 240;

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Toolbar sx={{pr:'24px'}}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        NFT Dashboard
                    </Typography>
                </Toolbar>
                <Drawer sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginTop: '64px',
                    },
                }}
                variant="permanent"
                anchor="left"
                >
                    <List>
                        <ListItem button component={Link} to="/mynft">
                            <ListItemText primary="NFT情報" />
                        </ListItem>
                        <ListItem button component={Link} to="/businesscard">
                            <ListItemText primary="名刺" />
                        </ListItem>
                        <ListItem button component={Link} to="/update">
                            <ListItemText primary="社員情報更新" />
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
        </>
    )
}

export default HomeScreen;