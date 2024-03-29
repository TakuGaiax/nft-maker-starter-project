import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const CustomToolbar = () => {
    return (
        <>
            <Toolbar sx={{pr:'24px', backgroundColor: 'black', color: 'white', alignItems: 'center'}}>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, backgroundColor: 'transparent', mt: 2 }}>
                    社員証・名刺NFT ダッシュボード
                </Typography>
            </Toolbar>
        </>
    )
}

export default CustomToolbar;