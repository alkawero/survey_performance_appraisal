import React, { useState, useEffect } from "react";
import { doGet, doPost } from "../services/api-service";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import SwapVert from '@material-ui/icons/SwapVert';
import Remove from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import Select from "react-select";

const PaAspekCreateKabagComponent = props => {
    const [status, setStatus] = useState(true);
    const [subAspeks, setSubAspeks] = useState([]);
    const [unsurs, setUnsurs] = useState([]);
    const [dataEmployees, setDataEmployees] = useState([]);
    const [allStaffInUnit, setAllStaffInUnit] = useState([]);
    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        getAllStaffInUnit()
    }, [])

    const { classes } = props;

    const clear = () => {
        setStatus(true);
    };




    const getAllStaffInUnit = async () => {
        const params = {
            unit_id:props.user.unit_id,
            aspek_id:props.assessment.aspek_for_assessment.id,
            leader_id:props.user.emp_id
        }

        if(dataEmployees.length<1){
            const response = await doGet("pa/assessment/aspek/available", params);
            if (response.data.length > 0) {
                const dataForSelect = response.data.map(employee => ({
                    value: employee.emp_id,
                    label: employee.emp_name
                }));
                setAllStaffInUnit(dataForSelect);
            }
        }
    };

    const cancel = () => {
        history.back();
    };
    const statusChange = e => {
        setStatus(!status);
    };

    const staffsOnChange = e => {
        setStaffs(e);
    };

    const addSubAspek = () => {
        const newSubAspek = {
            aspek_code:props.assessment.aspek_for_assessment.code,
            sub_aspek_code:`${props.assessment.aspek_for_assessment.code}.${subAspeks.length+1}`,
            sub_aspek_name:"",
            order:subAspeks.length+1}
        setSubAspeks([...subAspeks, newSubAspek])
    };

    const addUnsur = (sub_code) => {
        const unsursInSameSubAspek = unsurs.filter(u=>u.sub_aspek_code===sub_code)
        const newUnsur = {sub_aspek_code:sub_code,
            unsur_code:`${sub_code}.${unsursInSameSubAspek.length+1}`,
            unsur_name:"", order:unsursInSameSubAspek.length+1,
            bobot:0,
            showCategory:false,
            category_1_label:"",
            category_2_label:"",
            category_3_label:"",
            category_4_label:""}
        setUnsurs([...unsurs, newUnsur])
    };

    const deleteSubAspek = (sub_code) => {
        let indexSubAspek=1;
        const oldDeletedSubAspeks = subAspeks.filter(sub=>sub.sub_aspek_code!==sub_code) //delete subaspek
        let deletedUnsurs = unsurs.filter(u=>u.sub_aspek_code!==sub_code)//delete unsurs

        const newSubAspeks = oldDeletedSubAspeks.map(sub=>{
                                let indexUnsur=1;
                                const newSubAspekCode = `${sub.aspek_code}.${indexSubAspek}`;
                                let tobeReplaceUnsurs = deletedUnsurs.filter(u=>u.sub_aspek_code===sub.sub_aspek_code)
                                let otherUnsurs = deletedUnsurs.filter(u=>u.sub_aspek_code!==sub.sub_aspek_code)
                                const replacedUnsur = tobeReplaceUnsurs.map(u=>({...u, sub_aspek_code:newSubAspekCode, unsur_code:`${newSubAspekCode}.${indexUnsur++}`}))
                                deletedUnsurs = [...otherUnsurs, ...replacedUnsur]
                                return {...sub,sub_aspek_code:newSubAspekCode, order:indexSubAspek++}
                            })
        setSubAspeks(newSubAspeks)


        setUnsurs(deletedUnsurs)
    };

    const deleteUnsur = (unsur_code,sub_code) => {
        let index=1;
        const deletedUnsur = unsurs.filter(u=>u.unsur_code!==unsur_code)

        const tobeReplaceUnsur = deletedUnsur.filter(u=>u.sub_aspek_code===sub_code)
        const otherUnsur = deletedUnsur.filter(u=>u.sub_aspek_code!==sub_code)

        const replacedUnsur = tobeReplaceUnsur.map(u2=>{
                                return {...u2, unsur_code:`${sub_code}.${index}`, order:index++}
                            })
        setUnsurs([...otherUnsur,...replacedUnsur])
    };

    const subAspekNameChange = (sub_code, e) => {
        let newSubAspek = subAspeks.filter(sub=>sub.sub_aspek_code === sub_code)[0]
        newSubAspek = {...newSubAspek, sub_aspek_name: e.target.value}

        const otherSubAspeks = subAspeks.filter(sub=>sub.sub_aspek_code !== sub_code)
        const sorted = [...otherSubAspeks, newSubAspek].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setSubAspeks(sorted)
    };

    const unsurNameChange = (unsur_code, e) => {
        let newUnsur = unsurs.filter(unsur=>unsur.unsur_code === unsur_code)[0]
        newUnsur = {...newUnsur, unsur_name: e.target.value}

        const otherUnsurs = unsurs.filter(unsur=>unsur.unsur_code !== unsur_code)
        const sorted = [...otherUnsurs, newUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    };

    const bobotUnsurChange = (unsur_code, e) => {
        const newBobot = parseInt(e.target.value);
        let currentOldUnsur = unsurs.filter(
            unsur => unsur.unsur_code === unsur_code
        )[0];
        const newUnsur = { ...currentOldUnsur, bobot: newBobot };
        let otherOldUnsur = unsurs.filter(
            unsur => unsur.unsur_code !== unsur_code
        );
        const sorted = [...otherOldUnsur, newUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    }

    const toggleScoreLabel = (unsur_code) => {
        let selectedUnsur = unsurs.filter(u=>u.unsur_code===unsur_code)[0]
        const otherUnsurs = unsurs.filter(u=>u.unsur_code!==unsur_code)

        selectedUnsur= {...selectedUnsur, showCategory:!selectedUnsur.showCategory}

        const sorted = [...otherUnsurs, selectedUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    };

    const categoryLabelChange = (score,unsur_code,e) => {
        let selectedUnsur = unsurs.filter(u=>u.unsur_code===unsur_code)[0]
        const otherUnsurs = unsurs.filter(u=>u.unsur_code!==unsur_code)

        switch(score){
            case 1:
                selectedUnsur= {...selectedUnsur, category_1_label:e.target.value}
            break;
            case 2:
                selectedUnsur= {...selectedUnsur, category_2_label:e.target.value}
            break;
            case 3:
                selectedUnsur= {...selectedUnsur, category_3_label:e.target.value}
            break;
            case 4:
                selectedUnsur= {...selectedUnsur, category_4_label:e.target.value}
            break;
        }


        const sorted = [...otherUnsurs, selectedUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    }


    const setThisCategoriesForAllUnsur = (unsur_code) => {
        let selectedUnsur = unsurs.filter(u=>u.unsur_code===unsur_code)[0]

        let UnsursSameSubaspek = unsurs.filter(u=>u.sub_aspek_code===selectedUnsur.sub_aspek_code)

        let UnsursOtherSubaspek = unsurs.filter(u=>u.sub_aspek_code!==selectedUnsur.sub_aspek_code)

        const newUnsurs = UnsursSameSubaspek.map(unsur=>({...unsur,
                                        category_1_label:selectedUnsur.category_1_label,
                                        category_2_label:selectedUnsur.category_2_label,
                                        category_3_label:selectedUnsur.category_3_label,
                                        category_4_label:selectedUnsur.category_4_label}))

        const sorted = [...UnsursOtherSubaspek, ...newUnsurs].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    }


    const submit = () => {
        create();
        clear();
       history.back();
    };

    const create = async () => {
        let params = {
                pa_master_id:props.assessment.aspek_for_assessment.master.id,
                aspek_id: props.assessment.aspek_for_assessment.id,
                sub_aspeks:subAspeks,
                unsurs:unsurs,
                participants:staffs.map(staff=>(staff.value)),
                status: status == true ? 1 : 0,
                creator: props.user.emp_id
            };

        await doPost("pa/assessment/aspek", params, "save assessment by aspek");

    };

    const OpenCloseCategory = ({open, unsur_code})=> {
        if(open){
            return (<Tooltip title="Hide score categories">
                        <IconButton aria-label="Add Score Categories" onClick={()=>toggleScoreLabel(unsur_code)}>
                            <Remove/>
                        </IconButton>
                    </Tooltip>)
        }

        return (<Tooltip title="Show score categories">
                        <IconButton aria-label="Add Score Categories" onClick={()=>toggleScoreLabel(unsur_code)}>
                            <Add/>
                        </IconButton>
                    </Tooltip>)
    }

    return (
        <Grid container direction="column">
            <Grid container>
                <Grid container>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="animated slideInLeft"
                    >
                        Create Detail of Aspek for Staffs
                    </Typography>
                </Grid>
                <Grid container spacing={8} >
                    <Grid item>
                    <Typography variant="subtitle1">
                        Master : {props.assessment.aspek_for_assessment.master.name}
                    </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={8} >
                    <Grid item xs={1}>
                        <TextField
                            id="Code"
                            label="Code"
                            value={props.assessment.aspek_for_assessment.code}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={7}>
                    <TextField
                        id="Name"
                        label="Name"
                        value={props.assessment.aspek_for_assessment.name}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                    />
                    </Grid>
                    <Grid item xs={1} container justify="center" alignContent="center">
                        {`Total
                        ${unsurs.reduce((acc,current)=>acc+current.bobot, 0)}
                         %`}
                    </Grid>
                    <Grid item xs={1} container justify="center" alignContent="center">|</Grid>
                    <Grid item xs={1} container justify="center" alignContent="center">Max {props.assessment.aspek_for_assessment.fixed_bobot} %</Grid>

                    <Grid item xs={1} container justify='center' alignContent="center">
                            <Tooltip title="Add sub aspek">
                                <IconButton aria-label="add sub aspek" onClick={addSubAspek}>
                                    <Add/>
                                </IconButton>
                            </Tooltip>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12} container>
                        {
                            subAspeks.map(sub=>(
                                <Grid container spacing={8} className={classes.sub_aspek_row}>
                                    <Grid item xs={2}>
                                        <TextField
                                            id="Sub Aspek Code"
                                            label="Sub Aspek Code"
                                            value={sub.sub_aspek_code}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            style={{backgroundColor:"white", borderRadius:4}}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <TextField
                                            id="Sub Aspek Name"
                                            label="Sub Aspek Name"
                                            value={sub.sub_aspek_name}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            onChange={()=>subAspekNameChange(sub.sub_aspek_code,event)}
                                            style={{backgroundColor:"white", borderRadius:4}}
                                        />

                                    </Grid>
                                    <Grid item xs={1} container justify="center" alignContent="center">
                                    {`${unsurs.filter(u=>u.sub_aspek_code===sub.sub_aspek_code).reduce((acc,current)=>acc+current.bobot, 0)}
                                     %`}
                                    </Grid>
                                    <Grid item xs={2} container justify='center' alignContent="center">
                                        <Tooltip title="Delete Sub Aspek">
                                            <IconButton aria-label="delete" onClick={()=>deleteSubAspek(sub.sub_aspek_code)}>
                                            <Delete/>
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Add Unsur">
                                            <IconButton aria-label="delete" onClick={()=>addUnsur(sub.sub_aspek_code)}>
                                                <Add/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid container className={classes.unsur_container} >
                                    {
                                        unsurs.filter(u=>u.sub_aspek_code===sub.sub_aspek_code).map(unsur=>(
                                            <Grid item xs={12} container spacing={8} className={classes.unsur_row}>
                                                <Grid item xs={2}>
                                                    <TextField
                                                        id="Unsur Code"
                                                        label="Unsur Code"
                                                        value={unsur.unsur_code}
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{backgroundColor:"white", borderRadius:4}}
                                                    />

                                                </Grid>
                                                <Grid item xs={7}>
                                                    <TextField
                                                        id="Unsur Name"
                                                        label="Unsur Name"
                                                        value={unsur.unsur_name}
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={()=>unsurNameChange(unsur.unsur_code,event)}
                                                        style={{backgroundColor:"white", borderRadius:4}}
                                                    />

                                                </Grid>
                                                <Grid item xs={1} container justify="center" alignItems="center">
                                                <Grid item>
                                                        <TextField
                                                            id="outlined-number"
                                                            type="number"
                                                            margin="dense"
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                min:
                                                                    "0",
                                                                max:
                                                                    "100",
                                                                step:
                                                                    "1"
                                                            }}
                                                            onChange={()=>bobotUnsurChange(unsur.unsur_code,event)}
                                                            value={
                                                                unsurs.filter(u =>u.unsur_code ===unsur.unsur_code)[0].bobot
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        %
                                                    </Grid>
                                                </Grid>

                                                <Grid item xs={2} container justify='center' alignContent="center">
                                                    <Tooltip title="Delete Unsur">
                                                        <IconButton aria-label="delete" onClick={()=>deleteUnsur(unsur.unsur_code,unsur.sub_aspek_code)}>
                                                            <Delete/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <OpenCloseCategory open={unsur.showCategory} unsur_code={unsur.unsur_code}/>
                                                </Grid>
                                                {   unsur.showCategory &&
                                                    <Grid container className={classes.category_container}>
                                                        <Grid item xs={12} container spacing={8} className={classes.category_row}>
                                                            <Grid item container justify="center" alignContent="center" className={classes.side_row_button}>
                                                                <Tooltip title="Same for all">
                                                                    <IconButton aria-label="delete" onClick={()=>setThisCategoriesForAllUnsur(unsur.unsur_code)}>
                                                                        <SwapVert/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <TextField
                                                                        id="score4"
                                                                        label="scored 4 means"
                                                                        value={unsur.category_4_label}
                                                                        margin="dense"
                                                                        placeholder="meaning if the score is 4"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        onChange={()=>{categoryLabelChange(4,unsur.unsur_code,event)}}
                                                                        style={{backgroundColor:"white", borderRadius:4}}
                                                                    />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <TextField
                                                                    id="score3"
                                                                    label="scored 3 means"
                                                                    value={unsur.category_3_label}
                                                                    placeholder="meaning if the score is 3"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={()=>{categoryLabelChange(3,unsur.unsur_code,event)}}
                                                                    style={{backgroundColor:"white", borderRadius:4}}
                                                                />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <TextField
                                                                    id="score2"
                                                                    label="scored 2 means"
                                                                    value={unsur.category_2_label}
                                                                    placeholder="meaning if the score is 2"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={()=>{categoryLabelChange(2,unsur.unsur_code,event)}}
                                                                    style={{backgroundColor:"white", borderRadius:4}}
                                                                />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <TextField
                                                                    id="score1"
                                                                    label="scored 1 means"
                                                                    value={unsur.category_1_label}
                                                                    placeholder="meaning if the score is 1"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={()=>{categoryLabelChange(1,unsur.unsur_code,event)}}
                                                                    style={{backgroundColor:"white", borderRadius:4}}
                                                                />
                                                            </Grid>

                                                        </Grid>
                                                    </Grid>
                                                }

                                            </Grid>
                                        ))
                                    }
                                    </Grid>
                                </Grid>
                            ))
                        }
                    </Grid>

                </Grid>

                <Grid container className={classes.marginTops}>
                    <Grid item xs={12}>
                        <Select
                        isMulti
                        name="staffs"
                        value={staffs}
                        onChange={staffsOnChange}
                        options={allStaffInUnit}
                        placeholder='Select staffs'/>
                    </Grid>
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
        assessment:state.assessment
    };
};

const styles = theme => ({
    marginTops: {
        marginTop: 10
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
    },
    unsur_row:{
        padding:'0 10px 15px 10px',
        backgroundColor:"#e4ffe4",
        borderRadius:4
    },
    sub_aspek_row:{
        marginTop:20,
        backgroundColor:"#c5e7ff",
        borderRadius:4
    },
    unsur_container:{
        margin:10
    },
    category_container:{
        marginLeft:15,
    },
    category_row:{
        paddingRight:5,
        backgroundColor:"#c9bfff",
        borderRadius:4
    },
    category_field:{
        flex:10
    },
    side_row_button:{
        flex:1
    }

});

const PaAspekCreateKabag = connect(mapStateToProps)(PaAspekCreateKabagComponent);

export default withStyles(styles)(PaAspekCreateKabag);


