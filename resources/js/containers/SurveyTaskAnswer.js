import React,{Component} from 'react'
import { connect } from "react-redux"
import {setLastPage,saveSurveyAnswer}  from '../actions'

import BackButton from '../components/BackButton'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import PersonIcon from '@material-ui/icons/Person'
import GroupIcon from '@material-ui/icons/Group'
import TextField from '@material-ui/core/TextField'
import PrevIcon from '@material-ui/icons/NavigateBefore'
import ReplayIcon from '@material-ui/icons/Replay'
import SendIcon from '@material-ui/icons/CheckCircle'
import NextIcon from '@material-ui/icons/NavigateNext'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List  from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar  from '@material-ui/core/ListItemAvatar'
import Avatar  from '@material-ui/core/Avatar'



const styles = theme =>({

    paperQuest:{
        width: '100%',
        height:'100%',
        background:'linear-gradient(90deg, #667eea 0%,#b06ab3 100% )',
        padding : 10,
        color:'#FFFFFF'
    },
    paperAnser:{
        width: '100%',
        height:'100%',
        background:'linear-gradient(90deg, #b06ab3 0%,#667eea  100% )',
        padding : 10,
        color:'#FFFFFF',
            overflow: 'auto',
            maxHeight: 350,

    },

    header:{
        display : 'block',
        textAllign:'center',
        fontSize:32
    },
    number:{
        display : 'block',
        fontSize:24,
        paddingLeft:25
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
      },
    whiteFont:{
        color:'#FFFFFF',
    },
    error: {
        color:'red',
        fontSize:24,
    },
    reason:{
        marginTop:10,        
    },
    errorComponent:{
        marginRight:'auto'
    },
    avatar:{
        margin: 5,
        color: '#fff',
        backgroundColor: '#ea1e63',
        borderRadius: '50%',
        maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px',

    },
    blueAvatar:{
        color: '#fff',
        backgroundColor: '#3f51b5',
    },
    font20:{
        fontSize:20,
    },
    


  })

const scoreText = ['Kurang','Cukup','Baik','Sangat Baik']

class SurveyTaskAnswerComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            modalDelete:false,
            filterOpen:false,
            currentQuestion:0,
            answerMap:[],
            errors:[],
            reasonMap:[],

        }

    }

    componentDidMount(){
        this.props.setLastPage('implementation_answer')
    }

    gotoNextQuestion = () =>{
        const max = this.props.currentTask.questions.length - 1
        const need_reason = this.props.currentTask.questions[this.state.currentQuestion].need_reason
        
        //if((!need_reason) || (this.state.reasonMap.map((reason)=>(reason.questionId)).includes(this.props.currentTask.questions[this.state.currentQuestion].id))){
            this.setState({currentQuestion:this.state.currentQuestion!==max ? this.state.currentQuestion+1:max})
        //}    
    }

    gotoPrevQuestion = () =>{
        this.setState({currentQuestion:this.state.currentQuestion!==0 ? this.state.currentQuestion-1:0})
    }

    gotoFirstQuestion = () =>{
        this.setState({currentQuestion:0})
    }


    answering = answer =>{
        this.setState({answer:answer})
        let newArray = []
        const questionId = this.props.currentTask.questions[this.state.currentQuestion].id
        const questionType = this.props.currentTask.questions[this.state.currentQuestion].type

        if(this.state.answerMap.length>0)
        newArray = this.state.answerMap.filter((answer)=>{
            return answer.questionId !== questionId
        })

        const answerObject = {no:this.state.currentQuestion,questionId:questionId, answer:answer, type:questionType}
        newArray.push(answerObject)

        this.setState({answerMap:newArray})

        
    }

    isSelected(code,questionId){
        if(_.isEmpty(this.state.answerMap)) return false
        else{
                const answers  = this.state.answerMap.filter(answer=>{
                return answer.questionId == questionId
                })
            if(_.isEmpty(answers))  return false

            return code === answers[0].answer
        }
    }

    onChange = (e) => {
        let newArray = []
        const questionId = this.props.currentTask.questions[this.state.currentQuestion].id
        const questionType = this.props.currentTask.questions[this.state.currentQuestion].type
        if(!_.isEmpty(this.state.answerMap))
        newArray = this.state.answerMap.filter((answer)=>{
            return answer.questionId !== questionId
        })

        if(e.target.value.trim()!==''){
            let answerObject = {no:this.state.currentQuestion,questionId:questionId, answer:e.target.value, type:questionType}
            newArray.push(answerObject)
        }

        this.setState({answerMap:newArray})
     }

     reasonOnChange = (e)=>{
        //console.log(e.target.value) 
        let newReasonMap = []
        const questionId = this.props.currentTask.questions[this.state.currentQuestion].id
        
        if(!_.isEmpty(this.state.reasonMap))
            newReasonMap = this.state.reasonMap.filter((reason)=>{
                return reason.questionId !== questionId
        })

        if(e.target.value.trim()!==''){
            let reasonObject = {questionId:questionId, reason:e.target.value}
            newReasonMap.push(reasonObject)
        }
        

        this.setState({reasonMap:newReasonMap})
     }

     submit = () => {

        //const need_reason = this.props.currentTask.questions[this.state.currentQuestion].need_reason
        
        //if((!need_reason) || (this.state.reasonMap.map((reason)=>(reason.questionId)).includes(this.props.currentTask.questions[this.state.currentQuestion].id))){
            if(this.state.answerMap.length==this.props.currentTask.questions.length){
                const emptyAnswers = this.state.answerMap.filter(answer => {
                    return answer.answer.trim() === ''
                })
        
                
                if(!_.isEmpty(emptyAnswers)){
                    this.setState({errors:emptyAnswers.map(answer=>answer.no+1)})
                }else{
                    const answerFiltered = this.state.answerMap.map(answer => {
                        
                        if(answer.type==='E'){
                            return {question_id:answer.questionId, text:answer.answer}
                        }
                        else
                        {
                            let currentReason = []
                            if(!_.isEmpty(this.state.reasonMap))
                                currentReason = this.state.reasonMap.filter((reason)=>{
                                    return reason.questionId === answer.questionId
                            })
        
                            if(_.isEmpty(currentReason))
                                currentReason = [{questionId:0,reason:''}]
                            
                            if(answer.type==='M'){
                                //return {question_id:answer.questionId, code:answer.answer}
                                return {question_id:answer.questionId, code:answer.answer, text:currentReason[0].reason}
                            }else{
                                //return {question_id:answer.questionId, score:answer.answer}
                                return {question_id:answer.questionId, score:answer.answer, text:currentReason[0].reason}
                            } 
                            
                        }
                     })
                    const data = {
                        trxUserId : this.props.currentTask.trx_user_id,
                        answers : answerFiltered
                    }
                    this.props.saveSurveyAnswer(data)
                    history.back()
                }
            }else{
                const answeredQuestionNos = this.state.answerMap.map(ans=>(ans.no))
                
                //create new array Nomer mulai dari 0
                let index=0
                const arrayNomer = this.props.currentTask.questions.map(()=>(index++))                                    
                //dicari yang nomernya tidak ada di answered
                const notAnsweredNumber = arrayNomer.filter((no)=>(!answeredQuestionNos.includes(no)))                         
                const notAnsweredNumberPlus1 = notAnsweredNumber.map((x)=>(++x))
                //dikasih plus1 karena di answerMap no mulai dari 0
                this.setState({errors:notAnsweredNumberPlus1})           
            }
            
        //}                

     }

    errorClick = (error) => {
        this.setState({currentQuestion:error})
    }

    render(){
        const { classes } = this.props
        let ownerName=''
        let question=''
        let task =  this.props.currentTask
        const currentQuestion = this.state.currentQuestion
        let answerHeader = null
        let answerComponent = null
        let answerText = ''
        let reasonText = ''
        let submitComponent = null
        let ownerIcon = null
        let errorComponent = null
        let prevComponent = ''
        let reasonComponent = null
        let nextComponent = <Button onClick={this.gotoNextQuestion} size='small' color="primary" className={classes.button}>
                                Next
                            <NextIcon />
                            </Button>

        if(!_.isEmpty(task) && !_.isEmpty(task.questions)){
            ownerName = task.owner_name
            question  = task.questions[currentQuestion].question

            const questionId = this.props.currentTask.questions[this.state.currentQuestion].id
            
            if(!_.isEmpty(this.state.answerMap)){//get answer text
                const answers  = this.state.answerMap.filter(answer=>{
                    return answer.questionId == questionId
                    })
                if(!_.isEmpty(answers))  answerText = answers[0].answer
            }

            if(!_.isEmpty(this.state.reasonMap)){//get reason text
                const reasons  = this.state.reasonMap.filter(reason=>{
                    return reason.questionId == questionId
                    })
                if(!_.isEmpty(reasons))  reasonText = reasons[0].reason
            }

            if(task.owner_type==='M'){
                ownerIcon = <PersonIcon className={classes.leftIcon}/>
            }else{
                ownerIcon = <GroupIcon className={classes.leftIcon}/>
            }

            //if(this.state.answerMap.length===task.questions.length){
                submitComponent =     <Button onClick={this.submit} size='small' color="primary" className={classes.button}>                                        
                                        <SendIcon/>
                                        submit
                                    </Button>                                    
            //}

            const max = this.props.currentTask.questions.length - 1
            if(this.state.currentQuestion !== 0){
                prevComponent =     <Button onClick={this.gotoPrevQuestion} size='small' color="primary" className={classes.button}>                                        
                                        <PrevIcon  />
                                        previous
                                    </Button>                                
            }
            if(this.state.currentQuestion===max){
                nextComponent = ''
            }

            if(task.questions[currentQuestion].type==='M'){

                answerHeader = 'Choose the answer'
                answerComponent =
                <List component="nav" dense={true}>
                {
                    task.questions[currentQuestion].options.map(option =>
                        <ListItem  button selected={this.isSelected(option.code,option.question_id)}
                            key={option.code}
                            onClick={()=>this.answering(option.code)}
                        >
                            <ListItemAvatar>
                                <Avatar className={classes.blueAvatar}>
                                {option.code}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF',fontSize:20 }}>{option.text}</Typography>}/>
                        </ListItem>
                )
                }
                </List>

            }
            else if(task.questions[currentQuestion].type==='S'){
                const op = task.questions[currentQuestion].options[0]
                const min = parseInt(op.code)
                const max = parseInt(op.text)
                let values=[]
                for (var i = min; i <= max; i++) {
                    values.push(''+i)
                }
                answerHeader = 'Choose the score'
                answerComponent =
                <List component="nav" dense={true}>
                  {values.map(i =>
                    <ListItem  button selected={this.isSelected(i,op.question_id)}
                        key={i}
                        onClick={()=>this.answering(i)}
                    >
                        <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF',fontSize:20 }}>
                        {i} - {scoreText[i-1]}
                        </Typography>} />
                    </ListItem>
                  )
                }
                </List>
                
            }
            else{
                answerHeader = 'Type your answer'
                answerComponent =
                <React.Fragment>
                    <TextField
                    id='answerText'
                    name='answerText'
                    value={answerText}
                    label="What do you think ?"
                    placeholder="Type Here"
                    multiline
                    margin="normal"
                    rows={3}
                    fullWidth
                    onChange={this.onChange}
                    InputProps={{
                        classes: {
                            input: classes.whiteFont
                        }
                    }}
                    InputLabelProps={{
                        className: classes.whiteFont
                      }}

                    />
                </React.Fragment>

            }
            
            if(task.questions[currentQuestion].need_reason===1){
                reasonComponent =
                <React.Fragment>
                    <Paper className={classes.paperAnser}>
                        <div className={classes.header}>Please tell your reason</div>
                        <TextField
                        id='reasonText'
                        name='reasonText'
                        value={reasonText}
                        label="tell your reason"
                        placeholder="Type Here"
                        multiline
                        margin="normal"
                        rows={3}
                        fullWidth
                        onChange={this.reasonOnChange}
                        InputProps={{
                            classes: {
                                input: classes.whiteFont
                            }
                        }}
                        InputLabelProps={{
                            className: classes.whiteFont
                        }}

                        />
                    </Paper>    
                </React.Fragment>
            }
          

        if(!_.isEmpty(this.state.errors))
            errorComponent =<React.Fragment>
                            <Grid item>
                                <span className={classes.error}>please answer all question : </span>
                            </Grid>
                                {this.state.errors.map(error=>
                                    <Grid item key={error} >
                                    <Button onClick={()=>this.errorClick(error-1)} className={classes.avatar}>{error}</Button>
                                    </Grid>
                                )}

                            </React.Fragment>
        return (
        <React.Fragment>
        <Grid container spacing={8} direction='column' className={classes.container}>
            <Grid container direction='row' alignContent="center">
                <Grid item xs={1}><BackButton/></Grid>
                <Grid container alignItems='center' item xs={2} >What do you think about </Grid>
                <Grid item xs={5}container alignItems='center'>
                    <Button variant="contained" color="primary" >
                        {ownerIcon}
                        {ownerName}
                    </Button>
                    <Typography variant="h6">

                    </Typography>
                </Grid>
                <Grid item xs={1} container justify='center'>
                    {prevComponent}
                </Grid>
                <Grid item xs={1} container justify='center'>
                    <IconButton onClick={this.gotoFirstQuestion}  color="primary" aria-label="Detail" >
                           <ReplayIcon  />
                    </IconButton>
                </Grid>
                <Grid item xs={1} container justify='center'>
                    {nextComponent}
                </Grid>
                <Grid item xs={1} container justify='center'>
                    {submitComponent}
                </Grid>
            </Grid>

            <Grid container direction='row' justify='space-between'>
                <Grid item xs={7} container justify='center'>
                    <Paper className={classes.paperQuest}>
                    <div className={classes.header}>Question {currentQuestion+1}</div>
                    {question}
                    </Paper>
                </Grid>
                <Grid item xs={4} container justify='center'>
                    <Paper className={classes.paperAnser}>
                    <div className={classes.header}>{answerHeader}</div>
                    {answerComponent}
                    </Paper>
                </Grid>
            </Grid>


            <Grid container direction='row' alignItems='center' justify='flex-end' className={classes.reason}>
                
                <Grid item xs={6} className={classes.errorComponent}>
                    {errorComponent}
                </Grid>
                <Grid item xs={4}>                
                    {reasonComponent}
                </Grid>
                    
            </Grid>
        </Grid>

        </React.Fragment>
                )

        }else{
         return (
            <React.Fragment>
                <BackButton/>No Question available in this survey
            </React.Fragment>
         )
        }
    }

}

const mapStateToProps = state => {
    return {
        currentTask : state.survey.currentTask
     }
  }

  const mapDispatchToProps = dispatch => {
    return {
        saveSurveyAnswer : data => dispatch(saveSurveyAnswer(data)),
        setLastPage : data => dispatch(setLastPage(data)),
    }
  }


const SurveyTaskAnswer = connect(mapStateToProps,mapDispatchToProps)(SurveyTaskAnswerComponent)

export default withStyles(styles)(SurveyTaskAnswer)

