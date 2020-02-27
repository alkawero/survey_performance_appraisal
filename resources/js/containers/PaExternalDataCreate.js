import React, {useState,useEffect} from 'react'
import { doGet,doPost } from "../services/api-service";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Add from "@material-ui/icons/Add";
import Done from "@material-ui/icons/Done";
import Remove from "@material-ui/icons/Remove";
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Switch  from '@material-ui/core/Switch';
import IconButton  from '@material-ui/core/IconButton';
import TextField  from '@material-ui/core/TextField';
import DebouncedTextField from "../components/DebouncedTextField";

const PaExternalDataCreateComponent = (props) =>{

    const [active, setActive] = useState(false)
    const [selectedKeyBy, setSelectedKeyBy] = useState(null)
    const [selectedParticipants, setSelectedParticipants] = useState([])
    const [participantOptions, setParticipantOptions] = useState([])
    const [unitOwnerOptions, setUnitOwnerOptions] = useState([])
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedUnitOwner, setSelectedUnitOwner] = useState([])
    const [selectedPaGroup, setSelectedPaGroup] = useState(null)
    const [selectedLeader, setSelectedLeader] = useState(null)
    const [newGroup, setNewGroup] = useState("")
    const [addNewGroup, setAddNewGroup] = useState(false)
    const [periode, setPeriode] = useState("")


    const keyByOpts = [
        {value:'all-dep',label:'All departments'},
        {value:'some-dep',label:'Some departments'},
    ]

    useEffect(() => {
        getPeriode()
        getDataGroup()
        getDataUnit()
    }, [])


    const getPeriode = async () =>{
        const params={indicator:'periode_active'}
        const response = await doGet('pa/setting/value',params)
        setPeriode(response.data)
    }

    const getDataGroup = async () =>{
        const params={}
        const response = await doGet('pa/external/group',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(group=>({value:group, label:group}))
            setGroupOptions(dataForSelect)
        }
    }


    const getDataUnit = async () =>{
        const params={}
        const response = await doGet('unit',params)
        if(response.data.length>0){
            let i=1;
            const dataForSelect = response.data.map(unit=>(
                {value:unit.unit_id, label:unit.unit_name, order:i++})
                )
            const sorted = dataForSelect.sort((a, b) => (a.order > b.order) ? 1 : -1)
            setUnitOwnerOptions(sorted)
        }

    }


    const keyByOnChange = (o)=>{
        setSelectedKeyBy(o)
        if(o.value==="all-dep"){
            setSelectedUnitOwner(
                unitOwnerOptions
            )
        }

    }


    const unitOwnerOnChange = (units) =>{
        const sorted = units.sort((a, b) => (a.order > b.order) ? 1 : -1)
        setSelectedUnitOwner(sorted)
    }



    const removeUnit = (unit_id) =>{
        setSelectedUnitOwner(
            selectedUnitOwner.filter(unit=>(unit.value!=unit_id))
        )
    }

    const groupOnChange = (e) =>{
        setSelectedPaGroup(e)
    }

    const newGroupChange = (e) =>{
        setNewGroup(e.target.value)
    }

    const saveGroup = async () =>{
        const newGroupTemp = {value:newGroup, label:newGroup}
        setGroupOptions([...groupOptions, newGroupTemp])
        setNewGroup("")
        setAddNewGroup(false)
    }

    const valueChange = (value, unit_id) =>{
        const filtered = selectedUnitOwner.find(u=>u.value===unit_id)
        const newUnit = {...filtered, text:value}

        const removed = selectedUnitOwner.filter(u=>u.value!==unit_id)

        const sorted = [...removed, newUnit].sort((a, b) => (a.order > b.order) ? 1 : -1)
        setSelectedUnitOwner(sorted)
    }

    const handleSubmit = async() => {
        create()
        history.back()
    }

    const create= async()=>{
        const params = {
            data   : selectedUnitOwner.map(unit=>({
                group:selectedPaGroup.value,
                key_name:"unit_id",
                key_id:unit.value,
                value:unit.text,
                periode: periode,
                created_by  :   props.user.emp_id})),
        }
        await doPost('pa/external',params,'save external data')
    }


      const {classes} = props;
      const activeLabel = active===true?'Active' : 'Not Active'



    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New external data
                    </Typography>
                </Grid>

                <Grid item xs={12} container direction='column'>

                    <Grid item container className={classes.marginTops}>
                        <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        label='periode'
                        value={periode}/>
                    </Grid>

                    <Grid item container spacing={16} className={classes.marginTops}>
                        <Grid item xs={5} justify="center" container alignItems="center">
                            <Select
                                options={groupOptions}
                                value={selectedPaGroup}
                                onChange={groupOnChange}
                                placeholder='Select PA Group'
                                className={classes.select}
                                />
                        </Grid>
                        { addNewGroup===false &&
                        <Grid item xs={1}>
                            <IconButton onClick={()=>{setAddNewGroup(true)}} color="primary">
                                <Add />
                            </IconButton>
                        </Grid>
                        }

                        { addNewGroup===true &&
                        <>
                        <Grid item xs={5}>
                            <TextField  fullWidth variant="outlined" margin="dense" label="new group" value={newGroup} onChange={newGroupChange}/>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={saveGroup} color="primary">
                                <Done />
                            </IconButton>
                        </Grid>
                        </>
                        }
                    </Grid>

                        <Grid container spacing={8} alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={1}>Participant</Grid>
                                <Grid item xs={ null!==selectedKeyBy && selectedKeyBy.value==='some-dep' ? 6 : 11}>
                                    <Select
                                    value={selectedKeyBy}
                                    onChange={keyByOnChange}
                                    options={keyByOpts}
                                    placeholder='Select data owner'/>
                                </Grid>
                                {
                                null!==selectedKeyBy && selectedKeyBy.value==='some-dep' &&

                                <Grid item xs={5}>
                                    <Select
                                    name="unit_participants"
                                    value={selectedUnitOwner}
                                    onChange={unitOwnerOnChange}
                                    options={unitOwnerOptions}
                                    placeholder='Select Department'
                                    isMulti
                                    />
                                </Grid>
                                }


                        </Grid>

                        {
                            selectedUnitOwner.map(unit=>(
                                <Grid item container spacing={8} className={classes.marginTops}>
                                    <Grid item xs={6}>
                                        <DebouncedTextField
                                        id={unit.value}
                                        key_id_1={unit.value}
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        label={`value for ${unit.label}`}
                                        value={selectedUnitOwner.find(u=>u.value===unit.value).text}
                                        onChange={valueChange}/>
                                    </Grid>
                                    <Grid item xs={1} container alignItems="center">
                                        <IconButton onClick={()=>removeUnit(unit.value)} color="primary">
                                            <Remove />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))

                        }


                        <Grid spacing={8} container justify='flex-end' className={classes.marginTops}>
                                <Grid item>
                                    <Button onClick={() => history.back()} size="small" >
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={handleSubmit} variant="contained" size="small" color="primary" >
                                        Save
                                    </Button>
                                </Grid>
                        </Grid>

                </Grid>

            </Grid>
        </React.Fragment>
    )

}

const styles = theme =>({
    container: {
        marginTop: -16,
        marginLeft: 5
    },
    marginTops:{
        marginTop:10
    },
    selectDept:{
        paddingTop:25
    },
    select:{
        width:'100%'
    }
})

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};



const PaExternalDataCreate = connect(mapStateToProps)(PaExternalDataCreateComponent);

export default withStyles(styles)(PaExternalDataCreate);
