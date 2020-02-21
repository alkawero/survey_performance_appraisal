import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {getQuestionGroups}  from '../actions';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Select from 'react-select';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Switch  from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


/*alka*/
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


class SurveyCreateComponent1 extends Component {
    constructor(props){
        super(props)
        this.state = {
            tittle:'',
            type : {value:'',label:'Select Type'},
            description:'',
            active:false,
            validFrom: new Date(),
            validUntil: new Date(),
            questionGroups:[],
            activeStep : 0,
            skipped : new Set()

        }
    }

    types = [{value:'D',label:'Department'},{value:'P',label:'Personal'}]

    steps = this.getSteps();

    getSteps() {
        return ['Survey Form', 'Set Owner', 'Set Surveyor'];
      }

    getStepContent(step) {
        switch (step) {
          case 0:
            return 'Select campaign settings...';
          case 1:
            return 'What is an ad group anyways?';
          case 2:
            return 'This is the bit I really care about!';
          default:
            return 'Unknown step';
        }
      }

      isStepOptional(step) {
        return step === 1;
      }

      isStepSkipped(step) {
        return this.state.skipped.has(step);
      }

      handleNext() {
        let newSkipped = this.state.skipped;
        if (this.isStepSkipped(this.state.activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(this.state.activeStep);
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(newSkipped);
      }

      handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
      }

      handleSkip() {
        if (!this.isStepOptional(this.state.activeStep)) {
          // You probably want to guard against something like this,
          // it should never occur unless someone's actively trying to break something.
          throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(prevSkipped => {
          const newSkipped = new Set(prevSkipped.values());
          newSkipped.add(this.state.activeStep);
          return newSkipped;
        });
      }

      handleReset() {
        setActiveStep(0);
      }

    componentDidMount(){
        this.props.getQuestionGroups();
    }

    typeOnChange = (o)=>{
        this.setState({type:{value:o.value,label:o.label}})
    }

    onChange = (e) => { this.setState({[e.target.name]:e.target.value}) }
    onChangeSwitch = name => e =>{this.setState({ ...this.state, [name]: e.target.checked });}

    handleDateChange = name => date => {
        this.setState({...this.state,[name] : date });
      };

    questionGroupsOnChange = (e) =>{
        this.setState({questionGroups:e})
    }

    handleSubmit(){

    }

    render() {
      const {classes} = this.props;
      const activeLabel = this.state.active===true?'Active' : 'Not Active'
      let questionGroups = []
      if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));

    return (
        <React.Fragment>

            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New Master Survey
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Stepper activeStep={this.state.activeStep}>
                    {this.steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (this.isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (this.isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                    })}
                </Stepper>
                </Grid>

                <Grid item xs={6}>
                {this.state.activeStep === this.steps.length ? (
                    <div>
                        <Typography >
                        All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={this.handleReset} >
                        Reset
                        </Button>
                    </div>
                    ) : (
                    <div>
                        <Typography >{this.getStepContent(this.state.activeStep)}</Typography>
                        <div>
                        <Button disabled={this.state.activeStep === 0} onClick={()=>this.handleBack} >
                            Back
                        </Button>
                        {this.isStepOptional(this.state.activeStep) && (
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleSkip}
                            >
                            Skip
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>this.handleNext}
                        >
                            {this.state.activeStep === this.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                        </div>
                    </div>
                    )}
                </Grid>

                <Grid item xs={7} container direction='column'>
                <MuiPickersUtilsProvider    utils={DateFnsUtils}>
                        <Grid container justify='space-between'>
                            <Grid item xs={4} className={classes.selectDept} >
                                <Select value={this.state.type} onChange={this.typeOnChange} options={this.types}/>
                            </Grid>
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

                        <Grid item>
                            <Select
                            isMulti
                            name="questionGroups"
                            value={this.state.questionGroups}
                            onChange={this.questionGroupsOnChange}
                            options={questionGroups}
                            placeholder='Select the question group'/>
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
                                        Cancel
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
        questionGroups : state.question.questionGroups
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getQuestionGroups : () => dispatch(getQuestionGroups()),
    };
  }

const SurveyCreate1 = connect(mapStateToProps,mapDispatchToProps)(SurveyCreateComponent1);

export default withStyles(styles)(SurveyCreate1);
