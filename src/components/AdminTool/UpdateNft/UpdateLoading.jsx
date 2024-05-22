
import React from 'react';
import '../../Login/NftUploader/MintLoading.css';
import Loading from '../../basic/loadingAnimation';

const UpdateLoading = ({isUpdating}) => {

    if(!isUpdating) {
        console.log('モーダルなし')
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

export default UpdateLoading;