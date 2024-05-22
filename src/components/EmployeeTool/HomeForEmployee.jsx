import React from "react";
import CustomToolbar from '../basic/Toolbar.jsx';
import DrawItem from '../basic/DrawItem.jsx';


import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'; 
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const HomeScreenForEmployee = () => {

    const drawerWidth = 240;

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CustomToolbar />
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
                        <ListItem button component={Link} to="/home">
                            <ListItemText primary="NFT情報" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        <ListItem button component={Link} to="/send">
                            <ListItemText primary="名刺交換" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem>
                        {/* <ListItem button component={Link} to="/update">
                            <ListItemText primary="社員情報更新" sx={{backgroundColor: 'transparent'}}/>
                        </ListItem> */}
                    </List>
                </Drawer>
            </Box>
        </>
    )
}

export default HomeScreenForEmployee;