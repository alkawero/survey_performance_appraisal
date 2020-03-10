import React, { useState, useEffect } from "react";
import {setUnsurEdit} from '../actions'
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

const styles = theme => ({
    marginTops: {
        marginTop: 15
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

const PaUnsurCreateComponent = props => {
    const [status, setStatus] = useState(true);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [aspek, setAspek] = useState(null);
    const [subAspek, setSubAspek] = useState(null);
    const [dataAspek, setDataAspek] = useState([]);
    const [dataSubAspek, setSubDataAspek] = useState([]);
    const { classes } = props;

    useEffect(() => {
        getDataAspek();
    }, []);

    useEffect(() => {
        if(props.unsur_to_edit){
            setCode(props.unsur_to_edit.code)
            setName(props.unsur_to_edit.name)
        }
    }, [props.unsur_to_edit])

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

    const getDataSubAspek = async aspek_id => {
        const params = { aspek_id: aspek_id };
        const response = await doGet("pa/subaspek", params);
        if (response.data.length > 0) {
            const dataForSelect = response.data.map(subaspek => ({
                value: subaspek.id,
                label: `${subaspek.code} - ${subaspek.name}`
            }));
            setSubDataAspek(dataForSelect);
        }
    };


    const submit = async() => {
        if(!props.unsur_to_edit){
            create();
        }else{
            await edit()
            props.setUnsurEdit()
        }
        history.back();
    };

    const edit =async ()=>{
        const params = {
            id:props.unsur_to_edit.id,
            code: code,
            name: name,
            updated_by: props.user.emp_id
        };
        await doPut("pa/unsur", params, "save unsur");
    }

    const create = async () => {
        if (aspek !== null) {
            const params = {
                sub_aspek_id: subAspek.value,
                code: code,
                name: name,
                status: status == true ? 1 : 0,
                creator: props.user.emp_id
            };
            await doPost("pa/unsur", params, "save sub aspek");

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
        setSubAspek(null);
        getDataSubAspek(e.value);
    };

    const subAspekChange = e => {
        setSubAspek(e);
    };

    const title = props.unsur_to_edit ? "Edit Unsur" : "Create New Unsur"
    return (
        <Grid container direction="column">
            <Grid item xs={6} container>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="animated slideInLeft"
                    >
                        {title}
                    </Typography>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <Select
                            isClearable={true}
                            value={aspek}
                            options={dataAspek}
                            onChange={aspekChange}
                            placeholder="Select Aspek"
                            styles={selectCustomZindex}
                        />
                    </Grid>
                </Grid>

                <Grid container className={classes.marginTops}>
                    <Grid item xs={12}>
                        <Select
                            isClearable={true}
                            value={subAspek}
                            options={dataSubAspek}
                            onChange={subAspekChange}
                            placeholder="Select Sub Aspek"
                            styles={selectCustomZindex}
                        />
                    </Grid>
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

const mapStateToProps = state => {
    return {
        user: state.user.user,
        unsur_to_edit:state.assessment.unsur_to_edit
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUnsurEdit: unsur => dispatch(setUnsurEdit(unsur)),
    };
  }

const PaUnsurCreate = connect(mapStateToProps,mapDispatchToProps)(PaUnsurCreateComponent);

export default withStyles(styles)(PaUnsurCreate);

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
