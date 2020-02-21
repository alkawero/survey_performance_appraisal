import React, {useState,useEffect} from 'react'
import { doGet,doPost } from "../services/api-service";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';

import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Switch  from '@material-ui/core/Switch';




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
    }
})

const PaAssessmentCreateComponent = (props) =>{

    const [active, setActive] = useState(false)
    const [selectedParticipantBy, setSelectedParticipantBy] = useState(null)
    const [selectedParticipants, setSelectedParticipants] = useState([])
    const [participantOptions, setParticipantOptions] = useState([])
    const [unitParticipantOptions, setUnitParticipantOptions] = useState([])
    const [masterOptions, setMasterOptions] = useState([])
    const [selectedUnitParticipant, setSelectedUnitParticipant] = useState(null)
    const [selectedPaMaster, setSelectedPaMaster] = useState(null)
    const [selectedLeader, setSelectedLeader] = useState(null)


    const participantByOpts = [
        {value:'departement',label:'All staff in department'},
        {value:'allNonAkLeader',label:'All non akademik leader'},
        {value:'allAkLeader',label:'All akademik leader'},
        {value:'oneByone',label:'choose some employees'}
    ]

    useEffect(() => {
        getDataMaster()
        getDataParticipants()
    }, [])

    const getDataMaster = async () =>{
        const params={}
        const response = await doGet('pa/master',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(master=>({value:master.id, label:`${master.name} - semester ${master.semester} - periode ${master.periode}`}))
            setMasterOptions(dataForSelect)
        }

    }

    const getDataParticipants = async () =>{
        const params={}
        const response = await doGet('user',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(emp=>({value:emp.emp_id, label:emp.emp_name}))
            setParticipantOptions(dataForSelect)
        }

    }

    const getDataUnit = async () =>{
        const params={}
        const response = await doGet('unit',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(unit=>({value:unit.unit_id, label:unit.unit_name}))
            setUnitParticipantOptions(dataForSelect)
        }

    }


    const participantByOnChange = (o)=>{
        setSelectedParticipantBy(o)
        if(o.value==="oneByone"){
            if(_.isEmpty(participantOptions)){
                getDataParticipants()
            }
        }
        else if(o.value==="allAkLeader"){
            const underDepartement = 1;
            getDataLeader(underDepartement)
        }
        else if(o.value==="allNonAkLeader"){
            const underDepartement = 3;
            getDataLeader(underDepartement)
        }else{
            if(_.isEmpty(unitParticipantOptions)){
                getDataUnit()
            }
        }

    }

    const activeChange = e => {
        setActive(!active);
    };





    const leaderOnChange = e => {
        setSelectedLeader(e);
    };


    const participantsOnChange = (e) =>{
        setSelectedParticipants(e)
    }


    const unitParticipantOnChange = (e) =>{
        setSelectedUnitParticipant(e)
        getParticipantsByUnit(e.value)
    }

    const getParticipantsByUnit = async(unit_id)=>{
        const params={}
        const response = await doGet('user/unit/'+unit_id,params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(employee=>({value:employee.emp_id, label:employee.emp_name}))
            setSelectedParticipants(dataForSelect)
        }
    }

    const getDataLeader = async(underDepartement)=>{
        const params={under_departement:underDepartement}
        const response = await doGet('user/leader/',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(employee=>({value:employee.emp_id, label:employee.emp_name}))
            setSelectedParticipants(dataForSelect)
        }
    }

    const masterOnChange = (e) =>{
        setSelectedPaMaster(e)
    }

    const handleSubmit = async() => {
        if(selectedPaMaster!== null && !_.isEmpty(selectedParticipants)){
            create()
            history.back()
        }
    }

    const create= async()=>{
        const params = {
            pa_master_id: selectedPaMaster.value,
            participants:selectedParticipants.map((data)=>(data.value)),
            leader_id:selectedLeader.value,
            status:active,
            creator:props.user.emp_id
        }
        await doPost('pa/assessment',params,'save assessment')
    }


      const {classes} = props;
      const activeLabel = active===true?'Active' : 'Not Active'



    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New Assessment
                    </Typography>
                </Grid>

                <Grid item xs={12} container direction='column'>
                        <Grid item className={classes.marginTops}>
                            <Select
                            options={masterOptions}
                                value={selectedPaMaster}
                                onChange={masterOnChange}
                                placeholder='Select PA Master'
                                />
                        </Grid>




                        <Grid container spacing={8} alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={1}>Participant</Grid>
                                <Grid item xs={ null!==selectedParticipantBy && selectedParticipantBy.value==='departement' ? 6 : 11}>
                                    <Select
                                    value={selectedParticipantBy}
                                    onChange={participantByOnChange}
                                    options={participantByOpts}
                                    placeholder='Select participant by'/>
                                </Grid>
                                {
                                null!==selectedParticipantBy && selectedParticipantBy.value==='departement' &&

                                <Grid item xs={5}>
                                    <Select
                                    name="unit_participants"
                                    value={selectedUnitParticipant}
                                    onChange={unitParticipantOnChange}
                                    options={unitParticipantOptions}
                                    placeholder='Select Department'
                                    />
                                </Grid>
                                }


                        </Grid>


                        <Grid container alignItems='center' justify='flex-end' className={classes.marginTops}>
                            <Grid item xs={1}> {selectedParticipants.length} </Grid>
                            <Grid item xs={11}>
                            <Select
                                isMulti
                                name="participants"
                                value={selectedParticipants}
                                onChange={participantsOnChange}
                                options={participantOptions}
                                placeholder='Select the participants'/>
                            </Grid>
                        </Grid>

                        <Grid container spacing={8} alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={1}>Leader </Grid>
                            <Grid item xs={11}>
                            <Select
                                name="leader"
                                value={selectedLeader}
                                onChange={leaderOnChange}
                                options={participantOptions}
                                placeholder='Select the Leader'/>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <FormControlLabel
                            control={
                            <Switch
                                    checked={active}
                                    onChange={activeChange}
                                    color="primary"
                                    />
                                    }
                                    label={activeLabel}
                                />
                        </Grid>

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

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};



const PaAssessmentCreate = connect(mapStateToProps)(PaAssessmentCreateComponent);

export default withStyles(styles)(PaAssessmentCreate);
