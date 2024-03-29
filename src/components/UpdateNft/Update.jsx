import React, { useEffect, useState} from "react";
import {HomePage} from '../../components/index.js';
import SubTitle from '../basic/SubTitle.jsx';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const UpdateHome = () => {

    const drawerWidth=240;
    
    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'columu', height: '100vh' }}>
                <HomePage />
                <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`}}>
                    <SubTitle title="NFT情報更新ページ" />
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
            </Box>
        </div>

    )
}

export default UpdateHome