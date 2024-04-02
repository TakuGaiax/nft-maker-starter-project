
import React from 'react';
import './MintLoading.css';
import Loading from '../basic/loadingAnimation.jsx';

const MintLoading = ({isMinting}) => {

    if(!isMinting) {
        return null;
    }

    return (
        <div className="mintingModal">
            <div className="minting">
                <h2>ミント中・・・</h2>
                <Loading/>
            </div>
        </div>
    )
}

export default MintLoading;