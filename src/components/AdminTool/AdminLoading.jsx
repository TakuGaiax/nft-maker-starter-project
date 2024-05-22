
import React from 'react';
import '../Login/NftUploader/MintLoading.css';
import Loading from '../basic/loadingAnimation';

const AdminLoading = ({isAdmin}) => {

    if(!isAdmin) {
        return null;
    }

    return (
        <div className="mintingModal">
            <div className="minting">
                <h2>更新中・・・</h2>
                <Loading/>
            </div>
        </div>
    )
}

export default AdminLoading;