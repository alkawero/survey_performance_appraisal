import React, { useState, useEffect } from "react";
import {setSubAspekEdit} from '../actions'
import { doGet, doPost,doPut } from "../services/api-service";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";

const PaSubAspekCreateComponent = props => {
    const [status, setStatus] = useState(true);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [aspek, setAspek] = useState(null);
    const [dataAspek, setDataAspek] = useState([]);
    const { classes } = props;

    useEffect(() => {
        getDataAspek();
    }, []);

    useEffect(() => {
        if(props.subaspek_to_edit){
            setCode(props.subaspek_to_edit.code)
            setName(props.subaspek_to_edit.name)
        }
    }, [props.subaspek_to_edit])

    const getDataAspek = async () => {
        const params = {};
        const response = await doGet("pa/aspek", params);
        if (response.data.length > 0) {
            const dataForSelect = response.data.map(aspek => ({
                value: aspek.id,
                label: `${aspek.code} - ${aspek.name}`
            }));
            setDataAspek(dataForSelect);
        }
    };


    const submit = async() => {
        if(!props.subaspek_to_edit){
            create();
        }else{
            await edit()
            props.setSubAspekEdit()
        }
        history.back();
    };

    const edit =async ()=>{
        const params = {
            id:props.subaspek_to_edit.id,
            code: code,
            name: name,
            updated_by: props.user.emp_id
        };
        await doPut("pa/subaspek", params, "save aspek");
    }

    const create = async () => {

        if (aspek !== null) {
            const params = {
                aspek_id: aspek.value,
                code: code,
                name: name,
                status: status == true ? 1 : 0,
                creator: props.user.emp_id
            };
            await doPost("pa/subaspek", params, "save sub aspek");
        }
    };

    const cancel = () => {
        history.back();
    };
    const statusChange = e => {
        setStatus(!status);
    };
    const codeChange = e => {
        setCode(e.target.value);
    };
    const nameChange = e => {
        setName(e.target.value);
    };

    const aspekChange = e => {
        setAspek(e);
    };

    return (
        <Grid container direction="column">
            <Grid item xs={6} container>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="animated slideInLeft"
                    >
                        Create New Sub Aspek
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Select
                        isClearable={true}
                        value={aspek}
                        options={dataAspek}
                        onChange={aspekChange}
                        placeholder="Select Aspek"
                        styles={selectCustomZindex}
                    />
                </Grid>
                <Grid container>
                    <TextField
                        id="Code"
                        label="Code"
                        value={code}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={codeChange}
                    />
                </Grid>
                <Grid container>
                    <TextField
                        id="Name"
                        label="Name"
                        value={name}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={nameChange}
                    />
                </Grid>
                <Grid container>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={status}
                                onChange={statusChange}
                                color="primary"
                                inputProps={{
                                    "aria-label": "primary checkbox"
                                }}
                            />
                        }
                        label={status ? "active" : "inactive"}
                    />
                </Grid>
            </Grid>
            <Grid
                justify="flex-end"
                container
                className={classes.addAction}
                spacing={8}
            >
                <Grid item>
                    <Button variant="outlined" onClick={cancel}>
                        cancel
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={submit}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

const styles = theme => ({
    marginTops: {
        marginTop: 5
    },
    container: {
        marginTop: -16,
        marginLeft: 5
    },
    marginOver: {
        marginTop: -25
    },
    score: {
        maxWidth: 50
    }
});

export const selectCustomZindex = {
    control: (base, state) => ({
        ...base,
        minWidth: "150px",
        margin: "0 4px"
    }),
    container: (base, state) => {
        return {
            ...base,
            flex: 1,
            zIndex: state.isFocused ? "1100" : "1" //Only when current state focused
        };
    }
};


const mapStateToProps = state => {
    return {
        user: state.user.user,
        subaspek_to_edit:state.assessment.subaspek_to_edit
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setSubAspekEdit: subaspek => dispatch(setSubAspekEdit(subaspek)),
    };
  }
const PaSubAspekCreate = connect(mapStateToProps,mapDispatchToProps)(PaSubAspekCreateComponent);

export default withStyles(styles)(PaSubAspekCreate);

