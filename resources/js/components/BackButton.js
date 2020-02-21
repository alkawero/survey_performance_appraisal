import React from 'react';
import  IconButton  from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/KeyboardBackspace'

 const BackButton = (props) =>{
    return <IconButton onClick={()=>history.back()} size='small'>
                <BackIcon/>
            </IconButton>
}

export default BackButton
