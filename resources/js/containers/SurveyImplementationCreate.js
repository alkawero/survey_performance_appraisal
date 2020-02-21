import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {setSelectedSurveyors,getSurveyorsByUnit,addSurveyImplementation,getSurveySelect,getQuestionGroups, getUsers, getUsersByName,getUnits}  from '../actions';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';

import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Switch  from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';


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

class SurveyImplementationCreateComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            tittle:'',
            type : null,
            description:'',
            active:false,
            validFrom: new Date(),
            validUntil: new Date(),
            questionGroups:[],
            empOwner : null,
            selectSurveyorBy:null,
            surveyors : [],
            unitOwner:   null,
            unitSurveyor:null,
            selectedSurvey : null
        }
    }

    types = [{value:'D',label:'Department'},{value:'P',label:'Personal'}]
    surveyorByOpts = [{value:'departement',label:'All staff in department'},{value:'oneByone',label:'choose some employees'}]

    componentDidMount(){
        this.props.getSurveySelect()
        this.props.getQuestionGroups()
        if(_.isEmpty(this.props.allUsers)){
            this.props.getUsers()
        }
        this.props.getUnits()
    }

    typeOnChange = (o)=>{
        this.setState({type:{value:o.value,label:o.label},empOwner:null,unitOwner:null})
    }

    surveyorByOnChange = (o)=>{
        this.setState({selectSurveyorBy:{value:o.value,label:o.label},surveyors:[]})        
    }
    

    onChange = (e) => { this.setState({[e.target.name]:e.target.value}) }
    onChangeSwitch = name => e =>{this.setState({ ...this.state, [name]: e.target.checked });}

    handleDateChange = name => date => {
        this.setState({...this.state,[name] : date })
    }

    questionGroupsOnChange = (e) =>{
        this.setState({questionGroups:e})
    }

    surveyorsOnChange = (e) =>{        
        this.props.setSelectedSurveyors(e)
        if(_.isEmpty(e)){
            this.setState({unitSurveyor:null})
        }
        
    }

    empOwnerOnChange = (e) =>{
        this.setState({empOwner:e})
    }

    unitOwnerOnChange = (e) =>{
        this.setState({unitOwner:e})
    }
    unitSurveyorOnChange = (e) =>{
        this.setState({unitSurveyor:e})        
        this.props.getSurveyorsByUnit(e.value)  
              
    }
    

    surveyChange = (e) =>{
        this.setState({selectedSurvey:e})
    }

    handleSubmit(){
        const surveyId = null !=this.state.selectedSurvey?this.state.selectedSurvey.value:this.state.selectedSurvey
        const unitId = null != this.state.unitOwner ? this.state.unitOwner.value : this.state.unitOwner
        const empId = null != this.state.empOwner ? this.state.empOwner.value : this.state.empOwner
        const ownerType = null != this.state.type ? this.state.type.value : this.state.type
        let surveyors = []
        if(!_.isEmpty(this.props.selectedSurveyors)){
            surveyors = this.props.selectedSurveyors.map(s=>s.value)
        }     

        if(surveyId!== null && ownerType !==null && (empId!==null||unitId!==null) && !_.isEmpty(surveyors)){
            let data = {
                surveyId: surveyId,
                validFrom: this.state.validFrom,
                validUntil: this.state.validUntil,
                ownerType:ownerType,
                empOwner:empId,
                unitOwner:unitId,                
                surveyors:surveyors,
                active:this.state.active,
                implementation:true
            }
            this.props.addSurveyImplementation(data);
            history.back()
        }
    }

    render() {
      const {classes} = this.props;
      const activeLabel = this.state.active===true?'Active' : 'Not Active'
      let questionGroups = []
      let allUsers = []
      let allUnits = []
      let surveyOptions=[];
      let ownerComponent = null
      let surveyorComponent = null
      let surveyors = []

      if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));
      if(this.props.allUsers) allUsers = this.props.allUsers.map(user=>({value:user.emp_id,label:user.emp_name}));
      if(this.props.allUnits) allUnits = this.props.allUnits.map(unit=>({value:unit.unit_id,label:unit.unit_name}));
      if(this.props.surveyForSelect) surveyOptions = this.props.surveyForSelect.map(survey=>({value:survey.id,label:survey.judul}));
      if(this.props.selectedSurveyors)  surveyors = this.props.selectedSurveyors

      if(null!==this.state.type){
        if(this.state.type.value==='P'){
          ownerComponent =
            <Grid item xs={6}>
                 <Select
                name="empOwner"
                value={this.state.empOwner}
                onChange={this.empOwnerOnChange}
                options={allUsers}
                placeholder='Select Employee'
                />
            </Grid>
      }else{
            ownerComponent =
            <Grid item xs={6}>
                <Select
                name="unit_owner"
                value={this.state.unitOwner}
                onChange={this.unitOwnerOnChange}
                options={allUnits}
                placeholder='Select Department'
                />
            </Grid>
      }
    }

    if(null!==this.state.selectSurveyorBy){
        if(this.state.selectSurveyorBy.value==='oneByone'){
            surveyorComponent = 
            <Grid item xs={6}>
                <Select
                isMulti
                name="surveyors"
                value={surveyors}
                onChange={this.surveyorsOnChange}
                options={allUsers}
                placeholder='Select the surveyors'/>                                                        
            </Grid>
        }else{
            surveyorComponent = 
            <Grid item xs={6}>
                <Select
                name="unit_surveyor"
                value={this.state.unitSurveyor}
                onChange={this.unitSurveyorOnChange}
                options={allUnits}
                placeholder='Select Department'
                />
            </Grid>
        }
    }

    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New Survey Implementation
                    </Typography>
                </Grid>

                <Grid item xs={12} container direction='column'>
                        <Grid item className={classes.marginTops}>
                            <Select
                            options={surveyOptions}
                                value={this.state.selectedSurvey}
                                onChange={this.surveyChange}
                                placeholder='Select the survey tittle'
                                />
                        </Grid>

                        <MuiPickersUtilsProvider    utils={DateFnsUtils}>
                            <Grid container justify='flex-start'>
                                
                                <DatePicker
                                    margin="normal"
                                    label="Valid From"
                                    value={this.state.validFrom}
                                    onChange={this.handleDateChange('validFrom')}
                                />
                                
                                <DatePicker
                                    margin="normal"
                                    label="Valid Until"
                                    value={this.state.validUntil}
                                    onChange={this.handleDateChange('validUntil')}
                                />
                                
                            </Grid>
                            </MuiPickersUtilsProvider>

                        <Grid container alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={2}>Owner</Grid>
                            <Grid item xs={4} >
                                <Select
                                value={this.state.type}
                                onChange={this.typeOnChange}
                                options={this.types}
                                placeholder='Select owner type'/>
                            </Grid>
                            {ownerComponent}
                        </Grid>

                        <Grid container alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={2}>Surveyors</Grid>
                            <Grid item xs={4}>
                                <Select
                                value={this.state.selectSurveyorBy}
                                onChange={this.surveyorByOnChange}
                                options={this.surveyorByOpts}
                                placeholder='Select surveyor by'/>
                            </Grid>
                            {surveyorComponent}
                            
                        </Grid>

                        <Grid item >
                            <FormControlLabel
                            control={
                            <Switch
                                    checked={this.state.active}
                                    onChange={this.onChangeSwitch('active')}
                                    value="active"
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
                                    <Button onClick={() => this.handleSubmit()} variant="contained" size="small" color="primary" >
                                        Save
                                    </Button>
                                </Grid>
                        </Grid>

                </Grid>

            </Grid>
        </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
    return {
        questionGroups : state.question.questionGroups,
        allUsers :  state.user.allUsers,
        allUnits : state.user.allUnits,
        surveyForSelect :state.survey. surveyForSelect,
        allUsersUnit :  state.user.allUsersUnit,
        selectedSurveyors : state.survey.selectedSurveyors
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getQuestionGroups : () => dispatch(getQuestionGroups()),
        getUsers : () => dispatch(getUsers()),
        getUsersByName : name => dispatch(getUsersByName(name)),
        getUnits : () => dispatch(getUnits()),
        getSurveySelect : () => dispatch(getSurveySelect()),
        addSurveyImplementation : data => dispatch(addSurveyImplementation(data)),
        getSurveyorsByUnit : unitId => dispatch(getSurveyorsByUnit(unitId)),
        setSelectedSurveyors : data => dispatch(setSelectedSurveyors(data)),
        
    };
  }

const SurveyImplementationCreate = connect(mapStateToProps,mapDispatchToProps)(SurveyImplementationCreateComponent);

export default withStyles(styles)(SurveyImplementationCreate);