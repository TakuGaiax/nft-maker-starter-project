import React from 'react';
import './Complete.css';

const MintEmployeeIdComplete = ({ mintEmployeeIdComplete, MintBusinessCardNft}) => {

    if(!mintEmployeeIdComplete) {
        return null;
    }
    return (
        <div className="mintCompleteModal">
            <div className="mintComplete">
                <h2>社員証ミント完了！</h2>
                <button onClick={MintBusinessCardNft}>名刺NFTをミントする</button>
            </div>
        </div>
    )
}

export default MintEmployeeIdComplete;