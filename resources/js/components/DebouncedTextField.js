import React,{useState,useEffect} from 'react'
import TextField from "@material-ui/core/TextField";
import { useDebounce } from 'react-use';


const DebouncedTextField = (props) => {
    const [text, setText] = useState("");

    useDebounce(
        () => {
                props.onChange(text,props.key_id_1,props.key_id_2)
        },
        500,
        [text]
      );
    const handleChange=(e)=>{
        setText(e.target.value)
    }

    useEffect(() => {
        if(props.value){
            setText(props.value)
        }else{
            setText("") //it will make the ui updating / render
        }

      }, [props.value]);

    return(
        <TextField
        id={props.id}
        margin={props.margin}
        label={props.label}
        fullWidth = {props.fullWidth}
        value={text}
        variant={props.variant}
        style={props.style}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}/>
    )
}

export default DebouncedTextField;

