import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppBar } from '@mui/material';

const CustomToolbar = () => {
    return (
        <>
            <AppBar>
                <Toolbar sx={{pr:'24px', backgroundColor: 'black', color: 'white', alignItems: 'center'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, backgroundColor: 'transparent', mt: 2, marginLeft:28 }}>
                        社員証・名刺NFT ダッシュボード
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default CustomToolbar;