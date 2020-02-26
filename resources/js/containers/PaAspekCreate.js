import React, { useState, useEffect } from "react";
import { doGet, doPost,doPut } from "../services/api-service";
import {setAspekEdit} from '../actions'
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Add from '@material-ui/icons/Add';
import Done from '@material-ui/icons/Done';
import Delete from '@material-ui/icons/Delete';
import SwapVert from '@material-ui/icons/SwapVert';
import MoreVert from '@material-ui/icons/MoreVert';
import Remove from '@material-ui/icons/Remove';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Select from "react-select";
import DebouncedTextField from "../components/DebouncedTextField";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Widgets from '@material-ui/icons/Widgets';



const PaAspekCreateComponent = props => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openChildMenu, setOpenChildMenu] = React.useState(false);
    const [groupOptions, setGroupOptions] = useState([])
    const [status, setStatus] = useState(true);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [detailByHrd, setDetailByHrd] = useState(false);
    const [detailers, setDetailers] = useState([]);
    const [subAspeks, setSubAspeks] = useState([]);
    const [unsurs, setUnsurs] = useState([]);
    const [dataEmployees, setDataEmployees] = useState([]);
    const [masterOptions, setMasterOptions] = useState([])
    const [selectedPaMaster, setSelectedPaMaster] = useState(null)
    const [aspekWeight, setAspekWeight] = useState(0)
    const [masterTotalWeight, setMasterTotalWeight] = useState(0)
    const [selectedunsurCode, setSelectedunsurCode] = useState("")



    useEffect(() => {
        getDataEmployees()
        getDataMaster()
        getDataGroup()
    }, [])

    useEffect(() => {
        if(props.aspek_to_edit){
            setCode(props.aspek_to_edit.code)
            setName(props.aspek_to_edit.name)
            setNote(props.aspek_to_edit.note)
        }
    }, [props.aspek_to_edit])

    const { classes } = props;


    const getDataMaster = async () =>{
        const params={}
        const response = await doGet('pa/master',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(master=>({value:master.id, label:`${master.name} - semester ${master.semester} - periode ${master.periode}`}))
            setMasterOptions(dataForSelect)
        }

    }

    const getDataGroup = async () =>{
        const params={}
        const response = await doGet('pa/external/group',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(group=>({value:group, label:group}))
            setGroupOptions(dataForSelect)
        }
    }


    const getDataEmployees = async () => {
        if(dataEmployees.length<1){
            const response = await doGet("user", {});
            if (response.data.length > 0) {
                const dataForSelect = response.data.map(employee => ({
                    value: employee.emp_id,
                    label: employee.emp_name
                }));
                setDataEmployees(dataForSelect);
            }
        }
    };

    const toggleExternalDataMenu = (unsurCode,event) => {
        if(anchorEl)
        setAnchorEl(null);
        else
        setAnchorEl(event.currentTarget);
        setSelectedunsurCode(unsurCode)
      };

    const aspekWeightChange = (e) =>{
        setAspekWeight(e.target.value)
    }

    const masterOnChange = async(e) =>{
        setSelectedPaMaster(e)
        const respose = await doGet("pa/master/"+e.value+"/weight",{})
        setMasterTotalWeight(respose.data.master_weight)
        setAspekWeight(100-parseInt(respose.data.master_weight))
    }

    const cancel = () => {
        history.back();
    };
    const statusChange = e => {
        setStatus(!status);
    };

    const detailByHrdChange = e => {
        if(detailByHrd===false){
            getDataEmployees()
        }
        setDetailByHrd(!detailByHrd);
    };

    const detailersOnChange = e => {
        setDetailers(e);
    };

    const codeChange = e => {
        setCode(e.target.value);
    };
    const nameChange = value => {
        setName(value);
    };
    const noteChange = value => {
        setNote(value);
    };

    const addSubAspek = () => {
        const newSubAspek = {aspek_code:code, sub_aspek_code:`${code}.${subAspeks.length+1}`, sub_aspek_name:"", order:subAspeks.length+1}
        setSubAspeks([...subAspeks, newSubAspek])
    };

    const addUnsur = (sub_code) => {
        const unsursInSameSubAspek = unsurs.filter(u=>u.sub_aspek_code===sub_code)
        const newUnsur = {sub_aspek_code:sub_code,
            unsur_code:`${sub_code}.${unsursInSameSubAspek.length+1}`,
            unsur_name:"",
            order:unsursInSameSubAspek.length+1,
            showCategory:false,
            external_data:null,
            is_optional:false,
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

    const toggleScoreLabel = (unsur_code) => {
        let selectedUnsur = unsurs.filter(u=>u.unsur_code===unsur_code)[0]
        const otherUnsurs = unsurs.filter(u=>u.unsur_code!==unsur_code)

        selectedUnsur= {...selectedUnsur, showCategory:!selectedUnsur.showCategory}

        const sorted = [...otherUnsurs, selectedUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    };

    const subAspekNameChange = (value,sub_code) => {
        let newSubAspek = subAspeks.filter(sub=>sub.sub_aspek_code === sub_code)[0]
        newSubAspek = {...newSubAspek, sub_aspek_name: value}

        const otherSubAspeks = subAspeks.filter(sub=>sub.sub_aspek_code !== sub_code)
        const sorted = [...otherSubAspeks, newSubAspek].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setSubAspeks(sorted)
    };

    const unsurNameChange = (value,unsur_code) => {
        let newUnsur = unsurs.filter(unsur=>unsur.unsur_code === unsur_code)[0]
        newUnsur = {...newUnsur, unsur_name: value}

        const otherUnsurs = unsurs.filter(unsur=>unsur.unsur_code !== unsur_code)
        const sorted = [...otherUnsurs, newUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setUnsurs(sorted)
    };

    const categoryLabelChange = (value,unsur_code,score) => {
        let selectedUnsur = unsurs.filter(u=>u.unsur_code===unsur_code)[0]
        const otherUnsurs = unsurs.filter(u=>u.unsur_code!==unsur_code)

        switch(score){
            case 1:
                selectedUnsur= {...selectedUnsur, category_1_label:value}
            break;
            case 2:
                selectedUnsur= {...selectedUnsur, category_2_label:value}
            break;
            case 3:
                selectedUnsur= {...selectedUnsur, category_3_label:value}
            break;
            case 4:
                selectedUnsur= {...selectedUnsur, category_4_label:value}
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

    const submit = async() => {
        if(!props.aspek_to_edit){
            create();
        }else{
            await edit()
            props.setAspekEdit()
        }
        history.back();
    };

    const edit =async ()=>{
        const params = {
            id:props.aspek_to_edit.id,
            code: code,
            name: name,
            note: note,
            status: status == true ? 1 : 0,
            updated_by: props.user.emp_id
        };
        await doPut("pa/aspek", params, "save aspek");
    }

    const setExternalData = (ex_data) =>{
        if(ex_data==="optional" || ex_data==="mandatory"){
            let newUnsur = unsurs.find(unsur=>unsur.unsur_code === selectedunsurCode)
            newUnsur = {...newUnsur, is_optional: ex_data==="optional", external_data:null}

            const otherUnsurs = unsurs.filter(unsur=>unsur.unsur_code !== selectedunsurCode)
            const sorted = [...otherUnsurs, newUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
            setUnsurs(sorted)
        }else{
            let newUnsur = unsurs.find(unsur=>unsur.unsur_code === selectedunsurCode)
            newUnsur = {...newUnsur, external_data: ex_data, is_optional:false}

            const otherUnsurs = unsurs.filter(unsur=>unsur.unsur_code !== selectedunsurCode)
            const sorted = [...otherUnsurs, newUnsur].sort((a, b) => (a.order > b.order) ? 1 : -1)
            setUnsurs(sorted)
        }

        setAnchorEl(null)
    }


    const create = async () => {
        let params = {
                code: code,
                name: name,
                note: note,
                status: status == true ? 1 : 0,
                creator: props.user.emp_id
        }

        if(detailByHrd){
            params = {
                ...params,
                is_custom:0,
                sub_aspeks:subAspeks,
                unsurs:unsurs,
            };
        }else{
            params = {
                ...params,
                is_custom:1,
                fixed_bobot:aspekWeight,
                master_id:selectedPaMaster.value,
                detailers:detailers.map(user=>(user.value)),
            };
        }


        await doPost("pa/aspek", params, "save aspek");


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
                        Create New Aspek
                    </Typography>
                </Grid>
                <Grid container spacing={8} >
                    <Grid item xs={1}>
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

                    <Grid item xs={6}>
                    <DebouncedTextField
                        id="Name"
                        label="Name"
                        key_id_1="name"
                        value={name}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={nameChange}
                    />
                    </Grid>
                    <Grid item xs={2}>
                    <DebouncedTextField
                        id="note"
                        label="note"
                        key_id_1="note"
                        value={note}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={noteChange}
                    />
                    </Grid>

                    {
                    !props.aspek_to_edit &&

                    <Grid item xs={2} container alignItems="center">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={detailByHrd}
                                    onChange={detailByHrdChange}
                                    color="primary"
                                    inputProps={{
                                        "aria-label": "primary checkbox"
                                    }}
                                />
                            }
                            label={detailByHrd ? "Detail By HRD" : "Detail By Leader (custom)"}
                        />
                    </Grid>
                    }
                    <Grid item xs={1} container justify='center' alignContent="center">
                        {   detailByHrd===true &&
                            <Tooltip title="Add sub aspek">
                                <IconButton aria-label="add sub aspek" onClick={addSubAspek}>
                                    <Add/>
                                </IconButton>
                            </Tooltip>
                        }
                    </Grid>
                </Grid>

                {   detailByHrd===true &&
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
                                    <Grid item xs={8}>
                                        <DebouncedTextField
                                            label="Sub Aspek Name"
                                            value={sub.sub_aspek_name}
                                            key_id_1 = {sub.sub_aspek_code}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            style={{backgroundColor:"white", borderRadius:4}}
                                            onChange={subAspekNameChange}
                                        />

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
                                    <Grid container className={classes.unsur_container}>
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
                                                    <DebouncedTextField
                                                        id="Unsur Name"
                                                        label="Unsur Name"
                                                        key_id_1={unsur.unsur_code}
                                                        value={unsur.unsur_name}
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={unsurNameChange}
                                                        style={{backgroundColor:"white", borderRadius:4}}
                                                    />

                                                </Grid>

                                                <Grid item xs={3} container alignItems="center">
                                                    <Tooltip title="Delete Unsur">
                                                        <IconButton size="small" aria-label="delete" onClick={()=>deleteUnsur(unsur.unsur_code,unsur.sub_aspek_code)}>
                                                            <Delete fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <OpenCloseCategory open={unsur.showCategory} unsur_code={unsur.unsur_code}/>

                                                    {!unsur.external_data && !unsur.is_optional &&
                                                    <IconButton  size="small" onClick={(event)=>toggleExternalDataMenu(unsur.unsur_code,event)} >
                                                            <MoreVert fontSize="small"/>
                                                    </IconButton>
                                                    }

                                                    {unsur.external_data && !unsur.is_optional &&
                                                    <Tooltip title={unsur.external_data}>
                                                        <IconButton  size="small" onClick={(event)=>toggleExternalDataMenu(unsur.unsur_code,event)} >
                                                                <Widgets fontSize="small" style={{color:"red"}}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    }
                                                    {
                                                        unsur.is_optional && <Typography type="body2" onClick={(event)=>toggleExternalDataMenu(unsur.unsur_code,event)} className={classes.pointer}>optional</Typography>
                                                    }

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
                                                                <DebouncedTextField
                                                                        id="score4"
                                                                        label="scored 4 means"
                                                                        value={unsur.category_4_label}
                                                                        key_id_1={unsur.unsur_code}
                                                                        key_id_2={4}
                                                                        margin="dense"
                                                                        placeholder="meaning if the score is 4"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        onChange={categoryLabelChange}
                                                                        style={{backgroundColor:"white", borderRadius:4}}
                                                                    />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <DebouncedTextField
                                                                    id="score3"
                                                                    label="scored 3 means"
                                                                    value={unsur.category_3_label}
                                                                    key_id_1={unsur.unsur_code}
                                                                    key_id_2={3}
                                                                    placeholder="meaning if the score is 3"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={categoryLabelChange}
                                                                    style={{backgroundColor:"white", borderRadius:4}}
                                                                />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <DebouncedTextField
                                                                    id="score2"
                                                                    label="scored 2 means"
                                                                    value={unsur.category_2_label}
                                                                    key_id_1={unsur.unsur_code}
                                                                    key_id_2={2}
                                                                    placeholder="meaning if the score is 2"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={categoryLabelChange}
                                                                    style={{backgroundColor:"white", borderRadius:4}}
                                                                />
                                                            </Grid>
                                                            <Grid item className={classes.category_field}>
                                                                <DebouncedTextField
                                                                    id="score1"
                                                                    label="scored 1 means"
                                                                    value={unsur.category_1_label}
                                                                    key_id_1={unsur.unsur_code}
                                                                    key_id_2={1}
                                                                    placeholder="meaning if the score is 1"
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={categoryLabelChange}
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
                }

                { !props.aspek_to_edit &&  detailByHrd===false &&
                <>
                <Grid spacing={8} container className={classes.marginTops}>
                    <Grid item xs={6} >
                            <Select
                                options={masterOptions}
                                value={selectedPaMaster}
                                onChange={masterOnChange}
                                placeholder='Select PA Master'
                                />
                    </Grid>
                <Grid item xs={3} container alignContent="center">weight selected master : {masterTotalWeight} %</Grid>
                <Grid spacing={8} item xs={3} container alignItems="center" alignContent="center">
                    <Grid item>weight of this aspek</Grid>
                    <Grid item>
                    <TextField
                        type="number"
                        margin="dense"
                        InputLabelProps={{
                            shrink: true
                        }}
                        inputProps={{
                            min:
                                "0",
                            max:
                                `${100-masterTotalWeight}`,
                            step:
                                "1"
                        }}
                        onChange={aspekWeightChange}
                        value={
                            aspekWeight
                        }
                    />

                    </Grid>
                    %
                </Grid>
                </Grid>
                <Grid container className={classes.marginTops}>
                    <Grid item xs={12}>
                        <Select
                        isMulti
                        name="detailer"
                        value={detailers}
                        onChange={detailersOnChange}
                        options={dataEmployees}
                        placeholder='Select Leaders'/>
                    </Grid>
                </Grid>
                </>
                }


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

            <Menu
                id="ex-data-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={toggleExternalDataMenu}
            >

                <MenuItem onClick={()=>setExternalData("optional")}>Optional</MenuItem>
                <MenuItem onClick={()=>setExternalData("mandatory")}>Mandatory</MenuItem>
                <MenuItem onClick={()=>setExternalData(null)}>No External Data</MenuItem>
                <MenuItem onClick={()=>setExternalData("hris_ijin")}>Data HRIS Ijin</MenuItem>
                <MenuItem onClick={()=>setExternalData("hris_absen")}>Data HRIS Absen</MenuItem>
                <MenuItem onClick={()=>setExternalData("perspective_rekan")}>Data Customer Perspective Rekan</MenuItem>
                <MenuItem onClick={()=>setExternalData("perspective_leader")}>Data Customer Perspective Atasan</MenuItem>
                <MenuItem onClick={()=>setExternalData("perspective_staff")}>Data Customer Perspective Staff</MenuItem>
                <MenuItem onClick={()=>setOpenChildMenu(!openChildMenu)}>
                    Data Input by HRD
                    {openChildMenu ? <ExpandLess /> : <ExpandMore />}
                </MenuItem>
                <Collapse in={openChildMenu} timeout="auto" unmountOnExit>
                    {groupOptions.map(group=>(
                        <MenuItem onClick={()=>setExternalData(group.value)}>{group.value}</MenuItem>
                    ))
                    }
                </Collapse>
            </Menu>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        user: state.user.user,
        aspek_to_edit:state.assessment.aspek_to_edit
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setAspekEdit: aspek => dispatch(setAspekEdit(aspek)),
    };
  }

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
        padding:'0 0px 15px 10px',
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
    },
    pointer:{
        cursor: 'pointer'
    }
});

const PaAspekCreate = connect(mapStateToProps,mapDispatchToProps)(PaAspekCreateComponent);

export default withStyles(styles)(PaAspekCreate);


