import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {addSurvey,getQuestionGroups, getUsers, getUsersByName,getUnits}  from '../actions';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Switch  from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '50%',
        flexShrink: 0,
      },
      secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
      },

})


class SurveyCreateComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            tittle:'',
            ownerType : {value:'',label:'Select owner type'},
            description:'',
            active:false,
            validFrom: new Date(),
            validUntil: new Date(),
            questionGroups:[],
            empOwner : {value:'',label:'Select Employee'},
            surveyors : [],
            unitOwner:   {value:'',label:'Select department'},
            implementation:false
        }
    }

    ownerTypes = [{value:'D',label:'Department'},{value:'P',label:'Personal'}]

    componentDidMount(){
        this.props.getQuestionGroups();
        this.props.getUsers();
        this.props.getUnits();
    }

    ownerTypeOnChange = (o)=>{
        this.setState({ownerType:{value:o.value,label:o.label}})
        this.setState({ unitOwner:{value:'',label:'Select department'},
                        empOwner:{value:'',label:'Select Employee'}})
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

    panelImplementationChange = () =>{
        this.setState({implementation:!this.state.implementation})
    }

    clearform = () =>{
        this.setState({
            tittle:'',
            ownerType : {value:'',label:'Select owner type'},
            description:'',
            active:false,
            validFrom: new Date(),
            validUntil: new Date(),
            questionGroups:[],
            empOwner : {value:'',label:'Select Employee'},
            surveyors : [],
            unitOwner:   {value:'',label:'Select department'},
            implementation:false
        })
    }


    handleSubmit = ()=>{
        let survey = {
            validFrom: this.state.validFrom,
            validUntil: this.state.validUntil,
            tittle:this.state.tittle,
            description:this.state.description,
            questionGroups:this.state.questionGroups.map(select=>select.value),
            ownerType:this.state.ownerType.value,
            empOwner:this.state.empOwner.value,
            unitOwner:this.state.unitOwner.value,
            surveyors:this.state.surveyors.map(select=>select.value),
            active:this.state.active===true?'1':'0',
            implementation:this.state.implementation
        }
        this.props.addSurvey(survey);
        this.clearform()
    }

    render() {
      const {classes} = this.props;
      const activeLabel = this.state.active===true?'Active' : 'Not Active'
      let questionGroups = []
      let allUsers = []
      let allUnits = []
      let ownerComponent = null
      let implementationComponent = null
      if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));
      if(this.props.allUsers) allUsers = this.props.allUsers.map(user=>({value:user.emp_id,label:user.emp_name}));
      if(this.props.allUnits) allUnits = this.props.allUnits.map(unit=>({value:unit.unit_id,label:unit.unit_name}));

      if(this.state.ownerType.value==='P'){
          ownerComponent =
            <Grid item xs={5}>
                <Select
                name="empOwner"
                value={this.state.empOwner}
                onChange={this.empOwnerOnChange}
                options={allUsers}
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
                />
            </Grid>
      }


    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        Create New Master Survey
                    </Typography>
                </Grid>

                <Grid item xs={7} container direction='column'>
                        <Grid item className={classes.marginTops}>
                                <TextField
                                    name='tittle'
                                    value={this.state.tittle}
                                    label="Tittle"
                                    placeholder="Tittle"
                                    fullWidth
                                    onChange={this.onChange}
                                    />
                        </Grid>

                        <Grid item >
                        <TextField
                                id='description'
                                name='description'
                                value={this.state.description}
                                label="Type the description here"
                                placeholder="description"
                                multiline
                                margin="normal"
                                rows={3}
                                fullWidth
                                onChange={this.onChange}
                                />
                        </Grid>

                        <Grid container alignItems='center' justify='space-between' className={classes.marginTops}>
                            <Grid item>Question group</Grid>
                            <Grid item xs={10}>
                                <Select
                                isMulti
                                name="questionGroups"
                                value={this.state.questionGroups}
                                onChange={this.questionGroupsOnChange}
                                options={questionGroups}
                                placeholder='Select the question group'/>
                            </Grid>
                        </Grid>

                        <Grid item className={classes.marginTops}>
                        <ExpansionPanel expanded={this.state.implementation} onChange={this.panelImplementationChange}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>
                                {
                                    this.state.implementation===false?'Skip implementation':'Create new implementation'
                                }
                            </Typography>
                            <Typography className={classes.secondaryHeading}>
                                {
                                    this.state.implementation===false?'click to create implementation':'please complete the form'
                                }
                            </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction='column'>
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

                                <Grid container alignItems='center' justify='space-between' className={classes.marginTops}>
                                    <Grid item xs={2}>Owner</Grid>
                                    <Grid item xs={5} >
                                        <Select value={this.state.ownerType} onChange={this.ownerTypeOnChange} options={this.ownerTypes}/>
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
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </Grid>
                        {implementationComponent}

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
        allUnits : state.user.allUnits
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getQuestionGroups : () => dispatch(getQuestionGroups()),
        getUsers : () => dispatch(getUsers()),
        getUsersByName : name => dispatch(getUsersByName(name)),
        getUnits : () => dispatch(getUnits()),
        addSurvey : data => dispatch(addSurvey(data)),


    };
  }

const SurveyCreate = connect(mapStateToProps,mapDispatchToProps)(SurveyCreateComponent);

export default withStyles(styles)(SurveyCreate);
