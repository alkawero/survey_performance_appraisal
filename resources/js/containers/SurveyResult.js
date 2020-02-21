import {getTest} from '../test/testApi'
import React,{Component} from 'react';
import { connect } from "react-redux";
import {exportPdf,getAnswerBySurveyor,getSurveyorsBySurvey,getSurveySelect,getQuestionGroups,getQuestionsByGroup,getEmpOwnersBySurvey,getUnitOwnersBySurvey}  from '../actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import history from "../history.js";

import pink from '@material-ui/core/colors/pink';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import PrintIcon from '@material-ui/icons/Print';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';

import {print} from '../services/printPdf'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry sdfsdfa dsaf sdfsd sdf sdf sdafds ffs dfds afas fdsf dsafds ' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

const styles = theme =>({

    button_mini:{
        width: 30,
        height: 30,
        padding:0,

    },
    selectFilter:{
        marginTop:5
    },
    container:{
        margin: -16
    },
    widthAction:{
        minWidth:150
    },
    widthDate:{
        minWidth:150
    },
    gridCard:{        
        border:'solid 1px RGB(102, 126, 234)',
        borderRadius : 5,       
    },
    overFlowContainer:{
        width: '100%',
        height:'100%',
        overflow: 'auto',
        maxHeight: 360,   
        padding:0    

    },
    marginTops :{
        marginTop : 10
    },
    listHeader:{
        backgroundColor:'#667eea',
        color:'white',
        height:40,
        width: '100%',
        textAlign:'center',
        padding:10
    },

    paper1:{
        display:'flex',
        alignItems:'flex-start',
        paddingLeft:10,
        height:50,
        backgroundColor:pink[500],
        color:'#FFFFFF',
        margin : 10
    },
    counterNum:{
        fontSize:32,
        marginRight:50,
        marginLeft:'auto',
    },
    marginDate : {
        marginTop:-22
    },
    filterBar:{
        marginTop:15
    },
    
    gridList:{
        padding:0
    }

  })

    let summaryOptions = [ {value:'score',label:'Score summary'}]

    const ownerTypeOptions = [{value:'all_employees',label:'All Employees'},
                                {value:'all_departments',label:'All Departments'},
                                {value:'one_employee',label:'One Employee'},
                                {value:'one_department',label:'One Department'}]                           

class SurveyResultComponent extends Component {

   state = {
            modalDelete:false,
            filterOpen:false,
            tobeDelete:{},
            groupId : 0,
            anchorEl : null,
            empOwner:  null,
            unitOwner:  null,
            selectedSurvey: null,
            validFrom: new Date(),
            validUntil: new Date(),
            summaryType:null,
            ownerType: {label:'All Employees', value:'all_employees'}
        }

   

    componentDidMount = () => {
        //this.props.getQuestionGroupsLoadQuestion()
        this.props.getSurveySelect()

    }

    handleDateChange = name => date => {
        this.setState({...this.state,[name] : date });
      };

    toggleFIlter = ()=> {
        this.setState({filterOpen:!this.state.filterOpen})
    }

    handleCancel(){
        this.setState({modalDelete:false})
        this.setState({tobeDelete:{}})
    }

    deleteConfirmation (question,group){
        const tobeDelete = {questionId:question,groupId:group}
        this.setState({modalDelete:true})
        this.setState({tobeDelete:tobeDelete})
    }

    handleDelete(){
        this.setState({modalDelete:false})
        this.props.deleteQuestion(this.state.tobeDelete)
        this.setState({tobeDelete:{}})
    }

    getAnswerBySurveyor = (surveyTrxUserId)=>{
        this.setState({surveyorId:surveyTrxUserId})
        this.props.getAnswerBySurveyor(surveyTrxUserId)

    }

    moreOnCLick = (event)=>{
        this.setState({anchorEl:event.currentTarget})
    }

    menuClose = () =>{
        this.setState({anchorEl:null})
      }

   

    surveyChange = (e) =>{
        this.setState({selectedSurvey:e,empOwner:null,unitOwner:null})
        this.props.getEmpOwnersBySurvey(e.value)
        this.props.getUnitOwnersBySurvey(e.value)
    }
    empOwnerChange = (e) =>{
        this.setState({empOwner:e})
    }
    summaryTypeChange = val =>{
        this.setState({summaryType:val})
    }

    unitOwnerChange = (e) =>{
        this.setState({unitOwner:e})
    }

    ownerTypeChange = (e) =>{
        this.setState({ownerType:e,  empOwner:null, unitOwner:null, summaryType:null})
        if(e.value.includes('all')){
            summaryOptions = [{value:'score',label:'Score summary'}]
        }else{
            summaryOptions = [{value:'reason',label:'Reason summary'}]
        }
    }

    search = () =>{

        const surveyId = null !=this.state.selectedSurvey?this.state.selectedSurvey.value:'null'
        const unitId = null != this.state.unitOwner ? this.state.unitOwner.value : 'null'
        const empId = null != this.state.empOwner ? this.state.empOwner.value : 'null'
        const from = format(this.state.validFrom,'yyyy-MM-dd')
        const until = format(this.state.validUntil,'yyyy-MM-dd')

        const param = {surveyId:surveyId,unitId:unitId,empId:empId,from:from,until:until}

        if(surveyId=='null' || (unitId=='null' && empId=='null')){
        }else{
            this.props.getSurveyorsBySurvey(param)
            //getTest(`survey/surveyor/${surveyId}/${unitId}/${empId}/${from}/${until}/`)
        }
    }

    exportPdf = ()=> { 
        let ownerID = null
        
        //console.log(surveyId+'-'+unitId+'-'+empId+'-'+this.state.summaryType)
        if( this.state.selectedSurvey==null || 
            (this.state.empOwner==null && this.state.ownerType.value=='one_employee') ||
            (this.state.unitOwner==null && this.state.ownerType.value=='one_department') ||
            this.state.summaryType==null )
            {
            
        }else{            

            if(this.state.ownerType.value=='one_employee'){
                ownerID = this.state.empOwner.value
            }
            else if(this.state.ownerType.value=='one_department'){
                ownerID = this.state.unitOwner.value
            }

            const data = {
                validFrom   : format(this.state.validFrom,'yyyy-MM-dd'),
                validUntil   : format(this.state.validUntil,'yyyy-MM-dd'),
                surveyId    : this.state.selectedSurvey.value,
                ownerType   : this.state.ownerType.value,
                ownerId     : ownerID,
                summaryType :this.state.summaryType.value
            }
            this.props.exportPdf(data)
            //console.log(data)
        }
               
    }


    render(){
        const { classes } = this.props;
        let answers = [];
        let surveyOptions=[];
        let empOwnerOptions=[];
        let unitOwnerOptions=[];
        let surveyorList = []
        let noSurveyorInfo = 'No surveyors'
        let questionsComponent = <center>No answers </center>
        let totalSurveyors = 0;
        let score = 0;
        let selectOwnerComponent = null
        let keyId=0

        if(this.props.surveyForSelect) surveyOptions = this.props.surveyForSelect.map(survey=>({value:survey.id,label:survey.judul}));
        if(this.props.surveyorAnswer) answers = this.props.surveyorAnswer;
        if(this.props.surveyorsBySurvey) {
            surveyorList = this.props.surveyorsBySurvey;
            totalSurveyors = this.props.surveyorsBySurvey.length
        }
        if(this.props.empOwnersBySurvey) empOwnerOptions = this.props.empOwnersBySurvey.map(owner=>({value:owner.id,label:owner.name}));
        if(this.props.unitOwnersBySurvey) unitOwnerOptions = this.props.unitOwnersBySurvey.map(owner=>({value:owner.id,label:owner.name}));
        if(!_.isEmpty(surveyorList)) noSurveyorInfo = null

        if(!_.isEmpty(answers)){

            questionsComponent =
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Question</TableCell>
                                        <TableCell align="center" className={classes.widthDate}>Type</TableCell>
                                        <TableCell align="left" className={classes.widthAction}>Answer</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {answers.map(row => {
                                        score = score + row.score;
                                        let questionType = null
                                        switch (row.type){
                                            case 'M':
                                            questionType = 'Multiple Choice'
                                            break;
                                            case 'S' :
                                            questionType = 'Score'
                                            break;
                                            default : questionType = 'Essay'
                                        }
                                        return (
                                            <TableRow key={row.id}>
                                            <TableCell align="left">{row.question}</TableCell>
                                            <TableCell align="center">{questionType}</TableCell>
                                            <TableCell align="left" className={classes.tableCell}>
                                                {row.answer}
                                            </TableCell>
                                            </TableRow>
                                        )
                                    }
                                    )}
                                    </TableBody>
                                </Table>
            }else{
                if(this.state.groupId!=0)
                questionsComponent = 'The surveyor has not answer the survey yet'
            }

            if(this.state.ownerType.value=='one_employee'){
                selectOwnerComponent = <Select
                                        isClearable={true}
                                        value={this.state.empOwner}
                                        options={empOwnerOptions}
                                        className={classes.selectFilter}
                                        onChange={this.empOwnerChange}
                                        placeholder='Employee Owner'/>
            }else if(this.state.ownerType.value=='one_department'){
                selectOwnerComponent =  <Select
                                        isClearable={true}
                                        value={this.state.unitOwner}
                                        options={unitOwnerOptions}
                                        className={classes.selectFilter}
                                        onChange={this.unitOwnerChange}
                                        placeholder='Department Owner'/>
            }

        return (
        <React.Fragment>
        <Grid container spacing={8} direction='column' className={classes.container}>

            <Grid container direction='row' alignContent="flex-start" justify='space-between'>
                <Grid item >
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        Survey Result
                    </Typography>
                </Grid>
                
                <Grid item xs={2} container justify='flex-end'>                    
                    <IconButton onClick={this.search} color="primary"
                    aria-label="Go" size="small">
                        <SearchIcon fontSize='small'/>
                    </IconButton>
                    <IconButton onClick={this.exportPdf} color="primary"
                    aria-label="Go" size="small">
                        <PrintIcon fontSize='small'/>
                    </IconButton>
                </Grid>
            </Grid>

            <MuiPickersUtilsProvider    utils={DateFnsUtils}>
            <Grid container direction='row' spacing={8} justify='space-between' className={classes.filterBar}>
                <Grid item xs={4}>
                <Select
                   options={surveyOptions}
                    className={classes.selectFilter}
                    value={this.state.selectedSurvey}
                    onChange={this.surveyChange}
                    placeholder='Survey Tittle'
                    />
                </Grid>

                <Grid item xs={2}>
                <Select
                    value={this.state.ownerType}
                    options={ownerTypeOptions}
                    className={classes.selectFilter}
                    onChange={this.ownerTypeChange}
                    placeholder='Select Owner'/>
                </Grid>

                {selectOwnerComponent!=null &&
                    <Grid item xs={2}>
                       {selectOwnerComponent}                
                    </Grid>
                }

                
                <Grid item xs={1} className={classes.marginDate}>
                <DatePicker
                    margin="normal"
                    label="Valid From"
                    value={this.state.validFrom}
                    onChange={this.handleDateChange('validFrom')}
                />
                </Grid>
                <Grid item xs={1} className={classes.marginDate}>
                <DatePicker
                    margin="normal"
                    label="Valid Until"
                    value={this.state.validUntil}
                    onChange={this.handleDateChange('validUntil')}
                />
                </Grid>

                <Grid item  xs={2}>
                    <Select
                    value={this.state.summaryType}
                    options={summaryOptions}
                    className={classes.selectFilter}
                    onChange={this.summaryTypeChange}
                    placeholder='Summary Type'/>
                </Grid>

            </Grid>
            </MuiPickersUtilsProvider>

            <Grid container spacing={8} direction='row' alignContent="center" className={classes.marginTops}>
                {(!_.isEmpty(surveyorList)) &&
                    <Grid item xs={3} className={classes.gridCard} style={{padding:0}}>
                        <div className={classes.listHeader}>Surveyors </div>                                                
                        <List className={classes.overFlowContainer}>                        
                        {noSurveyorInfo}
                        {surveyorList.map(surveyor=>                             
                            (
                                <ListItem key={keyId++} alignItems="flex-start" button onClick={()=>this.getAnswerBySurveyor(surveyor.pivot_id)}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                    primary={surveyor.name}
                                    />
                                </ListItem>
                            )
                        )
                        }
                        </List>
                    </Grid>
                }

                {(!_.isEmpty(surveyorList)) &&
                <Grid item xs={9} container justify='center' className={classes.gridCard} style={{padding:0}}>
                    <div className={classes.listHeader}>Questions and Answers </div>
                    <div className={classes.overFlowContainer}>{questionsComponent}</div>
                </Grid>
                }
            </Grid>
            
            {('alka'==='mau') &&
            <Grid justify='flex-end' container direction='row' className={classes.marginTops}>
                <Paper className={classes.paper1}>
                    <span className={classes.counterName}>Score By the Surveyor</span>
                    <span className={classes.counterNum}>{score}</span>
                </Paper>
                <Paper className={classes.paper1}>
                    <span className={classes.counterName}>Total Surveyors</span>
                    <span className={classes.counterNum}>{totalSurveyors}</span>
                </Paper>
                <Paper className={classes.paper1}>
                    <span className={classes.counterName}>Total Score</span>
                    <span className={classes.counterNum}>{score}</span>
                </Paper>
            </Grid>
            }
    </Grid>

<Dialog
open={this.state.modalDelete}
onClose={()=>this.handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">{"Delete confirmation ?"}</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    Apakah anda yakin akan menghapus data tersebut ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={()=>this.handleDelete()} color="secondary" >
    Delete
  </Button>
  <Button onClick={()=>this.handleCancel()} color="primary" variant="contained"  autoFocus>
    Cancel
  </Button>
</DialogActions>
</Dialog>

<Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.menuClose}>
        <MenuItem onClick={this.editGroup}>Edit</MenuItem>
        <MenuItem onClick={this.deleteGrup}>Delete</MenuItem>
      </Menu>
</React.Fragment>
          );
    }

}

const mapStateToProps = state => {
    return {
        questionsByGroup : state.question.questionsByGroup,
        surveyForSelect : state.survey.surveyForSelect,
        empOwnersBySurvey: state.survey.empOwnersBySurvey,
        unitOwnersBySurvey: state.survey.unitOwnersBySurvey,
        surveyorsBySurvey : state.survey.surveyorsBySurvey,
        surveyorAnswer : state.survey.surveyorAnswer,
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getSurveySelect : () => dispatch(getSurveySelect()),
        getEmpOwnersBySurvey: surveyId => dispatch(getEmpOwnersBySurvey(surveyId)),
        getUnitOwnersBySurvey: surveyId => dispatch(getUnitOwnersBySurvey(surveyId)),
        getSurveyorsBySurvey: data => dispatch(getSurveyorsBySurvey(data)),
        getAnswerBySurveyor: surveyTrxUserId => dispatch(getAnswerBySurveyor(surveyTrxUserId)),
        exportPdf             : data => dispatch(exportPdf(data)),
    };
  }



const SurveyResult = connect(mapStateToProps,mapDispatchToProps)(SurveyResultComponent);

export default withStyles(styles)(SurveyResult);



