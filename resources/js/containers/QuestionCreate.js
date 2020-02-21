import React,{Component} from 'react';
import { connect } from "react-redux";
import {getQuestionGroups,addQuestionGroup,addQuestion}  from '../actions';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import  FormControlLabel  from '@material-ui/core/FormControlLabel';
import  Checkbox  from '@material-ui/core/Checkbox';

const styles = theme =>({

    marginTops:{
        marginTop:5
    },
    container:{
        marginTop: -16,
        marginLeft: 5
    },
    marginOver:{
        marginTop: -25,
    },
    score:{
        maxWidth:50
    }

  })

const types = [
    { value: 'M', label: 'Multiple Choice' },
    { value: 'E', label: 'Essay' },
    { value: 'S', label: 'Score' }
  ]

class QuestionCreateComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            groupNameText   :'',
            groupDescText   :'',
            optionText      :'',
            optionCode      :'',
            addingGroup     : false,
            addingOption    : false,
            questionType    : {value:'',label:'Select Type'},
            options         : [],
            addHeader       : '',
            question        : '',
            needReason      :false,
            group           :{value:'',label:'Select Group'},
            min             :0,
            max             :0,
            colum1Width          : 12

        }
    }

    componentDidMount(){
        this.props.getQuestionGroups();
    }

    handleAddGroup = () =>{
        this.setState({colum1Width:7})
        this.setState({addingGroup : true})
        this.setState({addingOption : false})
        this.setState({addHeader : 'New group'})
    }

    handleAddOption = ()=>{
        this.setState({colum1Width:7})
        this.setState({addingOption : true})
        this.setState({addingGroup : false})
        this.setState({addHeader : 'New option'})
    }

    questionTypeOnChange = (e) =>{
        this.setState({questionType:{value:e.value,label:e.label}})
        this.setState({options :[]})
        if(e.value==='S'){
            let scoreMinMax = [{code:this.state.min,text:this.state.max}]
            this.setState({options:scoreMinMax})
        }
        if(e.value==='E'){
            this.setState({needReason:false})
        }

    }

    groupOnChange = (e) =>{
        this.setState({group:{value:e.value,label:e.label}})

    }

    handleSaveGroup = ()=>{
        if(this.state.groupNameText.trim()!=='' && this.state.groupDescText.trim()!==''){
        const group = {name:this.state.groupNameText, description:this.state.groupDescText}
        this.props.addQuestionGroup(group)
        this.clearForm()
        }
    }

    handleSaveOption = ()=>{
        if(this.state.optionCode.trim()!=='' && this.state.optionText.trim()!==''){
        let optionx = {code:this.state.optionCode,text:this.state.optionText}
        const deletedOptions = this.state.options.filter(option => option.code !== optionx.code)
        const newOptions = [...deletedOptions, optionx]
        this.setState({options:newOptions})
        this.clearForm()
    }

    }

    deleteQuestionOption = (code)=>{
        const deletedOptions = this.state.options.filter(option => option.code !== code)
        this.setState({options:deletedOptions})
    }

    handleChange = name => event => {
        this.setState({ ...this.state, [name]: event.target.checked });
      };

    submit = ()=>{

        if(this.state.question.trim()!==''
        && this.state.question.value!==''
        && this.state.group.value!==''
        && !(this.state.questionType.value=='M'&&this.state.options.length==0)){

            const question = {
                group   : this.state.group.value,
                type    : this.state.questionType.value,
                question: this.state.question,
                options : this.state.options,
                need_reason: this.state.needReason
            }

            this.props.addQuestion(question)
            this.setState({question : ''})
        }
    }

    clearForm = ()=>{
        this.setState({colum1Width:12})
        this.setState({addingGroup : false})
        this.setState({addingOption : false})
        this.setState({addHeader : ''})
        this.setState({groupNameText : ''})
        this.setState({groupDescText : ''})
        this.setState({optionText : ''})
        this.setState({optionCode : ''})
    }

    onChange = (e) => {
        if(e.target.name==='optionCode'){
            this.setState({
                optionCode:e.target.value.toUpperCase()
            })
        }
        else if(e.target.name==='min'){
            this.setState({min:e.target.value})
            let scoreMinMax = [{code:e.target.value,text:this.state.max}]
            this.setState({options:scoreMinMax})
        }
        else if(e.target.name==='max'){
            this.setState({max:e.target.value})
            let scoreMinMax = [{code:this.state.min,text:e.target.value}]
            this.setState({options:scoreMinMax})
        }
        else{
            this.setState({
                [e.target.name]:e.target.value
            })
        }




    }






    render(){
        const {classes} = this.props
        let btnAddOption = null
        let optionsComponent = null
        let questionGroups = []
        let addingGroupComponent = null
        let addingOptionComponent = null
        let scoreRangeComponent = null
        
        let reasonComponent = 
                                <FormControlLabel
                                    control={
                                    <Checkbox
                                        checked={this.state.needReason}
                                        onChange={this.handleChange('needReason')}
                                        value="needReason"
                                        color="primary"
                                    />
                                    }
                                    label="Need reason"
                                />

        if(this.state.questionType.value === 'S'){
            scoreRangeComponent =
            <Grid item xs={2} container justify='space-between' className={classNames(classes.marginOver,'animated', 'slideInLeft')}>
                <TextField
                    id="min"
                    label="Min"
                    name='min'
                    value={this.state.min}
                    onChange={this.onChange}
                    type="number"
                    className={classes.score}
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                    id="max"
                    label="Max"
                    name='max'
                    value={this.state.max}
                    onChange={this.onChange}
                    type="number"
                    className={classes.score}
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                />
            </Grid>

        } 
        else if(this.state.questionType.value === 'M')
            {
             btnAddOption =
             <Grid item xs={1}>
                <IconButton onClick={this.handleAddOption} size="small" color="primary" aria-label="Filter" className='animated slideInLeft'>
                    <AddIcon fontSize='small'/>
                </IconButton>
            </Grid>

            if(this.state.options.length>0){
                optionsComponent =
                <List dense>
                {
                this.state.options.map(option =>
                    (
                    <ListItem key={option.code}>
                    <ListItemAvatar>
                    <Avatar>
                    {option.code}
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText  primary={option.text} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={()=>this.deleteQuestionOption(option.code)} size='small' aria-label="Delete">
                        <DeleteIcon fontSize='small'/>
                      </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                )
                )
                }
                </List>
            }else{
                optionsComponent = 'No option added, please add some options'
            }

        }else{
            reasonComponent = null
        }



        if(this.state.addingGroup===true){
            addingGroupComponent =
                        <React.Fragment>
                        <Grid item >
                            <TextField
                                autoFocus
                                margin="dense"
                                id="groupNameText"
                                name='groupNameText'
                                value={this.state.groupNameText}
                                label="Group name"
                                type="text"
                                onChange={this.onChange}
                                fullWidth
                                />
                        </Grid>

                        <Grid item>
                            <TextField
                                margin="dense"
                                id="groupDescText"
                                name='groupDescText'
                                value={this.state.groupDescText}
                                label="Group description"
                                type="text"
                                onChange={this.onChange}
                                fullWidth
                                />
                        </Grid>
                        <Grid item container justify='flex-end' className={classNames(classes.marginTops,'animated slideInUp')}>
                            <Button size='small' onClick={this.clearForm} color="primary">
                            Cancel
                            </Button>
                            <Button size='small' variant='contained' onClick={this.handleSaveGroup} color="primary">
                            Save
                            </Button>
                        </Grid>
                        </React.Fragment>
        }

        if(this.state.addingOption===true){
            addingOptionComponent =
                        <React.Fragment>
                        <Grid item >
                            <TextField
                                autoFocus
                                maxLength={1}
                                margin="dense"
                                id="optionCode"
                                name='optionCode'
                                value={this.state.optionCode}
                                label="Code (A,B,C,D)"
                                type="text"
                                onChange={this.onChange}
                                inputProps={{
                                    maxLength: 1,
                                  }}
                                fullWidth
                                />
                        </Grid>

                        <Grid item>
                            <TextField
                                margin="dense"
                                id="optionText"
                                name='optionText'
                                value={this.state.optionText}
                                label="Option text"
                                type="text"
                                onChange={this.onChange}
                                fullWidth
                                />
                        </Grid>
                        <Grid item container justify='flex-end' className={classNames(classes.marginTops,'animated slideInUp')}>
                            <Button size='small' onClick={this.clearForm} color="primary">
                                Cancel
                            </Button>
                            <Button size='small' variant='contained' onClick={this.handleSaveOption} color="primary">
                                Save
                            </Button>
                        </Grid>
                        </React.Fragment>
        }

        if(this.props.questionGroups) questionGroups = this.props.questionGroups.map(group=>({value:group.id,label:group.name}));


        return (
            <React.Fragment>
                <Grid container className={classes.container}>                    
                    <Grid item xs={11}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New Question
                    </Typography>
                    </Grid>
                    <Grid item xs={this.state.colum1Width} container direction='column'>
                        <Grid container spacing={24}>
                            <Grid item xs={5}>
                                <Select value={this.state.group} onChange={this.groupOnChange} options={questionGroups}/>
                            </Grid>
                            <Grid item xs={1}>
                            <IconButton onClick={this.handleAddGroup} size="small" color="primary" aria-label="Filter" className={classes.fab}>
                                    <AddIcon fontSize='small'/>
                            </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container spacing={24} className={classes.marginTops}>
                            <Grid item xs={5}>
                                <Select value={this.state.questionType} name='questionType' placeholder='select type' onChange={this.questionTypeOnChange} options={types}/>
                            </Grid>
                            {btnAddOption}
                            {scoreRangeComponent}
                        </Grid>

                        <Grid container spacing={24} className={classes.marginTops}>
                            <Grid item xs={5}>
                                {optionsComponent}
                            </Grid>
                        </Grid>


                        <Grid container spacing={24} className={classes.marginTops}>
                            <Grid item xs={5}>
                            <TextField
                                id='question'
                                name='question'
                                value={this.state.question}
                                label="Type the question here"
                                placeholder="question"
                                multiline
                                margin="normal"
                                rows={3}
                                fullWidth
                                onChange={this.onChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={24} className={classes.marginTops}>
                            <Grid item xs={2}>
                            {reasonComponent}
                            </Grid>
                        </Grid>

                        <Grid container className={classes.marginTops}>
                            <Grid container item spacing={8} xs={5} justify='flex-end'>
                                <Grid item >
                                    <Button size='small' onClick={()=>history.back()} color="primary">
                                    Back
                                    </Button>
                                </Grid>
                                <Grid item >
                                    <Button size='small' variant='contained' onClick={this.submit} color="primary">
                                    Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={4}container direction='column'>
                        <Grid item>
                        <Typography variant="h6" gutterBottom>
                            {this.state.addHeader}
                        </Typography>
                        </Grid>
                     {addingGroupComponent}

                     {addingOptionComponent}
                    </Grid>
                </Grid>


            </React.Fragment>
          );
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
        addQuestionGroup:group => dispatch(addQuestionGroup(group)),
        addQuestion: question => dispatch(addQuestion(question))
    };
  }


const QuestionCreate = connect(mapStateToProps,mapDispatchToProps)(QuestionCreateComponent);

export default withStyles(styles)(QuestionCreate);
