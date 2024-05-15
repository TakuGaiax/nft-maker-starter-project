import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../NftUploader/Complete.css';

const CheckComplete = ({checkComplete}) => {
    const navigate = useNavigate();

    if(!checkComplete) {
        return null;
    }
    return (
        <div className="mintCompleteModal">
            <div className="mintComplete">
                <h2>NFT保有確認できました!</h2>
                <button onClick={() => navigate('/home/employee')}>マイページへ</button>
            </div>
        </div>
    )
}

export default CheckComplete;