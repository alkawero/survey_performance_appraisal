
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {updateSurvey,getQuestionGroups,resetCurrentSurvey}  from '../actions';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';


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


class SurveyEditComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            id:0,
            tittle:'',
            description:'',
            questionGroups:[],

        }
    }


    componentDidMount(){
        this.props.getQuestionGroups();

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // Store id in state so we can compare when props change.
        // Clear out any previously-loaded user data (so we don't render stale stuff).
        if (nextProps.currentSurvey.id !== prevState.id) {
          return {
            tittle:nextProps.currentSurvey.judul,
            description:nextProps.currentSurvey.description,
            questionGroups: nextProps.currentSurvey.question_groups?
                            nextProps.currentSurvey.question_groups.map(group=>({value:group.id,label:group.name}))
                            :nextProps.currentSurvey.question_groups,
            id:nextProps.currentSurvey.id
          };
        }
        // No state update necessary
        return null;
    }

    onChange = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    questionGroupsOnChange = (e) =>{
        this.setState({questionGroups:e})
    }



    clearform = () =>{
        this.setState({
            tittle:'',
            description:'',
            questionGroups:[],
        })
    }


    handleSubmit = ()=>{
        let survey = {
            id:this.state.id,
            tittle:this.state.tittle,
            description:this.state.description,
            questionGroups:this.state.questionGroups.map(select=>select.value),
        }
        this.props.updateSurvey(survey);
        history.back()
        this.props.resetCurrentSurvey(survey);

    }


    render() {
      const {classes} = this.props;
      let questionGroups = []
      if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));


    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        Edit Master Survey
                    </Typography>
                </Grid>

                <Grid item xs={7} container direction='column'>
                        <Grid item className={classes.marginTops}>
                                <TextField
                                    id='tittle'
                                    name='tittle'
                                    value={this.state.tittle || ''}
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
                                value={this.state.description || ''}
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
        questionGroups  : state.question.questionGroups,
        currentSurvey   : state.survey.currentSurvey
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getQuestionGroups : () => dispatch(getQuestionGroups()),
        updateSurvey : data => dispatch(updateSurvey(data)),
        resetCurrentSurvey : () => dispatch(resetCurrentSurvey()),
    };
  }

const SurveyEdit = connect(mapStateToProps,mapDispatchToProps)(SurveyEditComponent);

export default withStyles(styles)(SurveyEdit);
