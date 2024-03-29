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

const HomeScreen = () => {

    const drawerWidth = 240;

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CustomToolbar />
                <DrawItem />
            </Box>
        </>
    )
}

export default HomeScreen;