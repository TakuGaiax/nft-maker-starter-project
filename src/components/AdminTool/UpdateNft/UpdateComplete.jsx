import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../../Login/NftUploader/Complete.css';

const UpdateComplete = ({ updateComplete, setUpdateComplete }) => {
    const navigate = useNavigate();

    if(!updateComplete) {
        return null;
    }

    const handleClose= () => {
        setUpdateComplete(false);
    };

    return (
        <div className="mintCompleteModal">
            <div className="mintComplete">
                <h2>更新完了しました！</h2>
                <button onClick={handleClose}>更新ページへ</button>
            </div>
        </div>
    )
}

export default UpdateComplete;