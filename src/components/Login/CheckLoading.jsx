
import React from 'react';
import '../Login/NftUploader/MintLoading.css';
import Loading from '../basic/loadingAnimation';

const CheckLoading = ({isChecking}) => {

    if(!isChecking) {
        return null;
    }

    return (
        <div className="mintingModal">
            <div className="minting">
                <h2>NFT保有確認中...</h2>
                <Loading/>
            </div>
        </div>
    )
}

export default CheckLoading;