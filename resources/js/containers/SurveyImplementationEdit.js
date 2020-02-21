import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {setLastPage,resetCrntSrvImpl,editSurveyImplementation,getSurveySelect,getQuestionGroups, getUsers, getUsersByName,getUnits}  from '../actions';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
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


class SurveyImplementationEditComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            survey_trx_user_id:0,
            survey_trx_id:0,
            type : null,
            active:false,
            validFrom: new Date(),
            validUntil: new Date(),
            questionGroups:[],
            empOwner : null,            
            surveyors : [],
            prevSurveyors : [],
            unitOwner:   null,            
            selectedSurvey : null
        }
    }

    types = [{value:'D',label:'Department'},{value:'P',label:'Personal'}]

    componentDidMount(){
        this.props.getSurveySelect()
        this.props.getQuestionGroups();
        if(_.isEmpty(this.props.allUsers)){
            this.props.getUsers();
        }
        this.props.getUnits();
        this.props.setLastPage('implementation_edit')
    }



    static getDerivedStateFromProps(nextProps, prevState) {
        // Store id in state so we can compare when props change.
        // Clear out any previously-loaded user data (so we don't render stale stuff).
        const ownerType = [{value:'P',label:'Personal'},{value:'D',label:'Department'}]

        if (nextProps.crntSurveyImpl.survey_trx_user_id !== prevState.survey_trx_user_id) {
            
            return {
            survey_trx_user_id  :   nextProps.crntSurveyImpl.survey_trx_user_id,
            survey_trx_id       :   nextProps.crntSurveyImpl.survey_trx_id,
            type                :   nextProps.crntSurveyImpl.owner_type==='P'? ownerType[0]:ownerType[1],
            active              :   nextProps.crntSurveyImpl.active==='1'?true:false,
            validFrom           :   nextProps.crntSurveyImpl.valid_from,
            validUntil          :   nextProps.crntSurveyImpl.valid_until,
            empOwner            :   nextProps.crntSurveyImpl.emp_owner?
                                {   value:nextProps.crntSurveyImpl.emp_owner.emp_id, 
                                    label:nextProps.crntSurveyImpl.emp_owner.emp_name}
                                :null,                                                                               
            surveyors           :   nextProps.crntSurveyImpl.surveyors?
                                nextProps.crntSurveyImpl.surveyors.map(user=>({value:user.emp_id,label:user.emp_name}))
                                :[],
            prevSurveyors       :   nextProps.crntSurveyImpl.surveyors?
                                nextProps.crntSurveyImpl.surveyors.map(user=>({value:user.emp_id,label:user.emp_name}))
                                :[],
            unitOwner           :   nextProps.crntSurveyImpl.unit_owner?
                                {   value:nextProps.crntSurveyImpl.unit_owner.unit_id, 
                                    label:nextProps.crntSurveyImpl.unit_owner.unit_name}
                                :null,            
            selectedSurvey      :   nextProps.crntSurveyImpl.survey?
                                {   value:nextProps.crntSurveyImpl.survey.id, 
                                    label:nextProps.crntSurveyImpl.survey.judul}
                                :null
          };
        }
        // No state update necessary
        return null;
    }


    typeOnChange = (o)=>{
        this.setState({type:{value:o.value,label:o.label},empOwner:null,unitOwner:null})
    }

    onChange = (e) => { this.setState({[e.target.name]:e.target.value}) }
    onChangeSwitch = name => e =>{this.setState({ ...this.state, [name]: e.target.checked });}

    handleDateChange = name => date => {
        this.setState({...this.state,[name] : date });
      };

    questionGroupsOnChange = (e) =>{
        this.setState({questionGroups:e})
    }

    surveyorsOnChange = (e) =>{
        this.setState({surveyors:e})
    }

    empOwnerOnChange = (e) =>{
        this.setState({empOwner:e})
    }

    unitOwnerOnChange = (e) =>{
        this.setState({unitOwner:e})
    }

    surveyChange = (e) =>{
        this.setState({selectedSurvey:e})
    }


    handleSubmit(){
            const surveyId = null !=this.state.selectedSurvey?this.state.selectedSurvey.value:this.state.selectedSurvey
            const unitId = null != this.state.unitOwner ? this.state.unitOwner.value : this.state.unitOwner
            const empId = null != this.state.empOwner ? this.state.empOwner.value : this.state.empOwner
            const ownerType = null != this.state.type ? this.state.type.value : this.state.type
            let prevSurveyors = []

            if(!_.isEmpty(this.state.prevSurveyors)){
                prevSurveyors = this.state.prevSurveyors.map(s=>s.value)
            }
            let surveyors = []
            if(!_.isEmpty(this.state.surveyors)){
                surveyors = this.state.surveyors.map(s=>s.value)
            }

            
        if(surveyId!==null && ownerType !==null && (empId!==null||unitId!==null) && !_.isEmpty(this.state.surveyors)){
            const newSurveyor = surveyors.filter((selected)=>(
                !prevSurveyors.includes(selected)
            ))

            const toDeleteSurveyor = prevSurveyors.filter((prev)=>(
                ! surveyors.includes(prev)
            ))
            
            let data = {
                survey_trx_id:this.state.survey_trx_id,
                survey_trx_user_id:this.state.survey_trx_user_id,
                surveyId: surveyId,
                validFrom: this.state.validFrom,
                validUntil: this.state.validUntil,
                ownerType:ownerType,
                empOwner:empId,                
                unitOwner:unitId,               
                newSurveyor:newSurveyor,
                toDeleteSurveyor:toDeleteSurveyor,
                active:this.state.active,
                implementation:true
            }
            this.props.editSurveyImplementation(data);
            history.back()
        }


    }

    componentWillUnmount(){
        this.props.resetCrntSrvImpl()
    }

    render() {
      const {classes} = this.props;
      const activeLabel = this.state.active===true?'Active' : 'Not Active'
      let questionGroups = []
      let allUsers = []
      let allUnits = []
      let surveyOptions=[];
      let ownerComponent = null
      if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));
      if(this.props.allUsers) allUsers = this.props.allUsers.map(user=>({value:user.emp_id,label:user.emp_name}));
      if(this.props.allUnits) allUnits = this.props.allUnits.map(unit=>({value:unit.unit_id,label:unit.unit_name}));
      if(this.props.surveyForSelect) surveyOptions = this.props.surveyForSelect.map(survey=>({value:survey.id,label:survey.judul}));

      if(null!==this.state.type){
        if(this.state.type.value==='P'){
          ownerComponent =
            <Grid item xs={5}>
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
            <Grid item xs={5}>
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
    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        Edit Survey Implementation
                    </Typography>
                </Grid>

                <Grid item xs={7} container direction='column'>
                        <Grid item className={classes.marginTops}>
                            <Select
                            options={surveyOptions}
                                value={this.state.selectedSurvey}
                                onChange={this.surveyChange}
                                placeholder='Select the survey tittle'
                                />
                        </Grid>

                        <MuiPickersUtilsProvider    utils={DateFnsUtils}>
                            <Grid container justify='space-between'>
                                <Grid item >
                                <DatePicker
                                    margin="normal"
                                    label="Valid From"
                                    value={this.state.validFrom}
                                    onChange={this.handleDateChange('validFrom')}
                                />
                                </Grid>
                                <Grid item >
                                <DatePicker
                                    margin="normal"
                                    label="Valid Until"
                                    value={this.state.validUntil}
                                    onChange={this.handleDateChange('validUntil')}
                                />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>

                        <Grid container alignItems='center' justify='flex-start' className={classes.marginTops}>
                            <Grid item xs={2}>Owner</Grid>
                            <Grid item xs={5} >
                                <Select
                                value={this.state.type}
                                onChange={this.typeOnChange}
                                options={this.types}
                                placeholder='Select owner type'/>
                            </Grid>
                            {ownerComponent}
                        </Grid>

                        <Grid container alignItems='center' justify='space-between' className={classes.marginTops}>
                            <Grid item>Surveyors</Grid>
                            <Grid item xs={10}>
                                <Select
                                isMulti
                                name="surveyors"
                                value={this.state.surveyors}
                                onChange={this.surveyorsOnChange}
                                options={allUsers}
                                placeholder='Select the surveyors'/>
                            </Grid>
                        </Grid>




                        <Grid item>
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

                        <Grid  spacing={8} container justify='flex-end' className={classes.marginTops}>
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
        crntSurveyImpl : state.survey.crntSurveyImpl
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getQuestionGroups : () => dispatch(getQuestionGroups()),
        getUsers : () => dispatch(getUsers()),
        getUsersByName : name => dispatch(getUsersByName(name)),
        getUnits : () => dispatch(getUnits()),
        getSurveySelect : () => dispatch(getSurveySelect()),
        editSurveyImplementation : data => dispatch(editSurveyImplementation(data)),
        resetCrntSrvImpl : () => dispatch(resetCrntSrvImpl()),
        setLastPage : data => dispatch(setLastPage(data)),
    };
  }

const SurveyImplementationEdit = connect(mapStateToProps,mapDispatchToProps)(SurveyImplementationEditComponent);

export default withStyles(styles)(SurveyImplementationEdit);
