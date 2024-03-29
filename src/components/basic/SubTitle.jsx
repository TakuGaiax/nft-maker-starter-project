import React from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SubTitle = ({title}) => {

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Typography component="h1" variant="h6" color="inherit" noWrap >
                    {title}
                </Typography>
            </Box>
        </>

    )
};

export default SubTitle;



