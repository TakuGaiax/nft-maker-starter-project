
import React from 'react';
import Button from '@mui/material/Button';

const ButtonFotUpdate = ({onUpdate}) => {

    return(
        <>
            <Button
                variant="contained"
                onClick={onUpdate}
                sx={{ mt: 3, width: '50%',  mx: 'auto', display: 'block', textTransform: 'none', marginTop: '20px' }}
            >
                更新
            </Button>
        </>
    );
};

export default ButtonFotUpdate;