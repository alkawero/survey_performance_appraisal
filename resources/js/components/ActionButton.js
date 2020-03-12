import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Tooltip  from "@material-ui/core/Tooltip";



const ActionButton = (props) => {
        if(props.for.includes(props.role)){
            if(props.type==='icon-button'){
                return(
                    <Tooltip title={props.title}>
                        <IconButton disabled ={props.disabled} onClick={props.action} size="small" color="primary" >
                            {props.icon}
                        </IconButton>
                    </Tooltip>
                )
            }
            else if(props.type==='fab'){
                return(
                    <Fab onClick={props.action} size="small" color="secondary" className={props.class}>
                        {props.icon}
                    </Fab>
                )
            }

          }else{
            return null
          }


}

export default ActionButton
