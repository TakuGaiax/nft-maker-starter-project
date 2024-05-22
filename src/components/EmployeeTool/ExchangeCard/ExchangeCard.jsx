import React from "react";
import CustomToolbar from '../../basic/Toolbar.jsx';
import SendCard from '../../EmployeeTool/ExchangeCard/SendCard.jsx';
import DrawItem from '../../basic/DrawItem.jsx';



import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'; 
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

const ExchangeCard = () => {

    const drawerWidth = 240;

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'columu', height: '100vh' }}>
                <CustomToolbar />
                <Box sx={{display: 'flex', flexGrow: 1}}>
                    <DrawItem />
                    <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                        <SendCard />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ExchangeCard;