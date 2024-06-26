import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Complete.css';

const MintComplete = ({ mintComplete}) => {
    const navigate = useNavigate();

    if(!mintComplete) {
        return null;
    }
    return (
        <div className="mintCompleteModal">
            <div className="mintComplete">
                <h2>ミント完了しました！</h2>
                <button onClick={() => navigate('/home/company/nft')}>管理者ページへ</button>
            </div>
        </div>
    )
}

export default MintComplete;