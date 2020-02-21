import React,{Component, useState} from 'react';
import { connect } from "react-redux";
import {deleteQuestionGroup,updateQuestionGroup,clearQuestionGroup,clearQuestion,toggleActiveQuestion,getQuestionGroups,toggleSnackBar,getQuestionsByGroup,deleteQuestion}  from '../actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import history from "../history.js";

import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Switch from '@material-ui/core/Switch';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import MoreIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
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
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
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
    overFlowContainer:{
        width: '100%',
        height:'100%',
         overflow: 'auto',
        maxHeight: 500,

    },
    gridCard:{        
        border:'solid 1px RGB(102, 126, 234)',
        borderRadius : 5,       
    },   
    listHeader:{
        backgroundColor:'#667eea',
        color:'white',
        height:40,
        width: '100%',
        textAlign:'center',
        padding:10
    }, 
    modalOption: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
      },
      modalEdit:{
        position: 'absolute',
        padding: theme.spacing.unit,
        outline: 'none',  
      },
      paperEdit:{
        padding: 20
      },
      fab:{
          marginTop : -30
      },
      tableWrapper: {
        overflowX: 'auto',
      },
      widthAction:{
        minWidth:180
    }

  })

class QuestionComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalDelete:false,
            filterOpen:false,
            tobeDelete:{},
            groupId : 0,
            anchorEl : null,
            openOption : false,
            options : [],
            openEditGroup:false,
            selectedGroup:null,
            deleteMenuText:'Delete'
        }

    }


    getModalStyle() {
        const top = 30;
        const left = 65;

        return {
          top: `${top}%`,
          margin:'auto',
          left: `${left}%`,
          // transform: `translate(-${top}%, -${left}%)`,
        };
      }
    
      getModalEditStyle() {
        const top = 30;
        const left = 10;

        return {
          top: `${top}%`,
          margin:'auto',
          left: `${left}%`,
          // transform: `translate(-${top}%, -${left}%)`,
        };
      }

    componentDidMount = async() => {
        this.props.getQuestionGroups()
        //this.props.getQuestionGroupsLoadQuestion()

    }

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

    handleDeleteQuestion(){
        this.setState({modalDelete:false})
        this.props.deleteQuestion(this.state.tobeDelete)
        this.setState({tobeDelete:{}})
    }

    toggleActive = (questionId)=>{
        const data = {questionId:questionId, groupId:this.state.groupId}
        this.props.toggleActiveQuestion(data)
        //this.props.getQuestionsByGroup( )
    }

    getQuestionsByGroup = (groupId)=>{
        this.setState({groupId:groupId})
        this.props.getQuestionsByGroup( groupId)
    }

    moreOnCLick =  (id,name,desc) => event =>{
        this.setState({anchorEl:event.currentTarget, selectedGroup:{id:id,name:name,description:desc}})        
    }

    menuClose = () =>{
        this.setState({anchorEl:null})        
        this.setState({deleteMenuText:'Delete',selectedGroup:null})
    }

    editGroup = () =>{
        this.setState({openEditGroup:true})
        
    }

    closeEditGroup= () =>{
        this.setState({openEditGroup:false})
      }

    deleteGroup = () =>{
        if(this.state.deleteMenuText==='Delete'){
            this.setState({deleteMenuText:'Click again to delete'})
        }else{
            this.setState({deleteMenuText:'Delete'})
            this.menuClose()
            this.props.deleteQuestionGroup(this.state.selectedGroup.id)
        }
    }

    handleCloseOptions = () =>{
        this.setState({openOption:false})
    }
    openOption = (op) =>{
        this.setState({openOption:true})
        this.setState({options:op})
    }

    componentWillUnmount(){
        this.props.clearQuestion()
        this.props.clearQuestionGroup()
    }

    groupNameOnChange = (e) =>{
        const prevGroup = {...this.state.selectedGroup}
        prevGroup.name = e.target.value
        this.setState({selectedGroup:prevGroup})
    }

    groupDescOnChange = (e) =>{
        const prevGroup = {...this.state.selectedGroup}
        prevGroup.description = e.target.value
        this.setState({selectedGroup:prevGroup})
    }

    saveGroupEdit = () =>{        
        this.props.updateQuestionGroup(this.state.selectedGroup)
        this.setState({openEditGroup:false})
        this.menuClose()
    }



    render(){
        const { classes } = this.props;
        let dataQuestion = [];
        let groups = [];
        let typeComponent = null
        let optionsComponent = null
        let questionsComponent = <center>Please Select the group first to see the questions</center>
        if(this.props.questionsByGroup) dataQuestion = this.props.questionsByGroup;
        if(this.props.questionGroups) groups = this.props.questionGroups;

        if(!_.isEmpty(this.state.options)){
            optionsComponent =
            <List className={classes.root}>
                {this.state.options.map(op=>(
                    <ListItem key={op.code} alignItems="flex-start">
                        <ListItemText
                        primary={`${op.code} . ${op.text}`}
                        />
                    </ListItem>
                ))
                }
            </List>
        }

        if(!_.isEmpty(dataQuestion)){

            questionsComponent =
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Question</TableCell>
                                        <TableCell align="center" className={classes.widthDate}>Type</TableCell>
                                        <TableCell align="center">Reason</TableCell>
                                        <TableCell align="center" className={classes.widthAction}>Action</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {dataQuestion.map(row => {

                                        if(row.type==='S'){
                                            typeComponent =
                                            <Chip
                                                label={`Score ${row.score[0]} - ${row.score[1]}`}
                                                color='primary'
                                            />

                                        }else
                                        if(row.type==='M'){
                                            typeComponent =
                                            <Chip
                                                label="Multiple Choice"
                                                onClick={()=>{this.openOption(row.options)}}
                                                color='primary'
                                            />

                                        }else{
                                            typeComponent = <Chip color='primary' label='Essay'/>
                                        }


                                        return(
                                        <TableRow key={row.id}>
                                        <TableCell align="left">{row.question}</TableCell>
                                        <TableCell align="center">{typeComponent}</TableCell>
                                        <TableCell align="center">{row.need_reason===1 && <CheckIcon />}</TableCell>
                                        <TableCell align="center" className={classes.widthAction}>
                                            <Switch
                                            checked={row.active===1} 
                                            color='primary'
                                            onChange={()=>this.toggleActive(row.id)}/>
                                            <IconButton onClick={()=>this.deleteConfirmation(row.id,this.state.groupId)} size="small" color="secondary" aria-label="Delete" >
                                                <DeleteIcon fontSize='small'/>
                                            </IconButton>
                                        </TableCell>
                                        </TableRow>
                                    )
                                }
                                    )}
                                    </TableBody>
                                </Table>
            }else{
                if(this.state.groupId!=0)
                questionsComponent = 'The group is not have any questions, please add some questions'
            }

        const renderFilter =
                            <Grid container justify='flex-end' spacing={16} >
                                <Grid item xs={2}>
                                <Select options={options} className={classes.selectFilter}/>
                                </Grid>

                                <Grid item xs={2}>
                                <Select options={options} className={classes.selectFilter}/>
                                </Grid>

                                <Grid item xs={2}>
                                <Select options={options} className={classes.selectFilter}/>
                                </Grid>

                                <Grid item xs={1}>
                                    <IconButton onClick={() => this.toggleFIlter()} color="primary"
                                    aria-label="Go" size="small">
                                            <SendIcon fontSize='small'/>
                                    </IconButton>
                                </Grid>
                            </Grid>


        return (
        <React.Fragment>
        <Grid container spacing={8} direction='column' className={classes.container}>
            <Grid container direction='row' alignContent="flex-start">
                <Grid item  xs={10}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        Master Question
                    </Typography>
                </Grid>

                <Grid item  xs={2} align="right">                    
                    <Fab onClick={() => history.push('/app/question/create')} size="small" color="secondary" aria-label="Add" className={classes.fab}>
                        <AddIcon />
                    </Fab>
                </Grid>

            {this.state.filterOpen==true && renderFilter             }

            <Grid item xs={3} className={classes.gridCard}>
                <div className={classes.listHeader}>Question Groups </div>                                                
                <List className={classes.overFlowContainer}>
                {groups.map(group=>(
                    <ListItem key={group.id} alignItems="flex-start" button onClick={()=>this.getQuestionsByGroup(group.id)}>
                        <ListItemText
                        primary={group.name}
                        secondary={group.description}
                        />
                        <ListItemSecondaryAction>
                            <IconButton aria-label="Delete" size='small'
                                aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.moreOnCLick(group.id,group.name,group.description)}>
                            <MoreIcon fontSize='small'/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
                }
                </List>
            </Grid>

            <Grid item xs={9} className={classes.gridCard}>
                <div className={classes.listHeader}>Questions </div>                                                
                <div className={classes.overFlowContainer}>{questionsComponent}</div>
            </Grid>
        </Grid>
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
  <Button onClick={()=>this.handleDeleteQuestion()} color="secondary" >
    Delete
  </Button>
  <Button onClick={()=>this.handleCancel()} color="primary" variant="contained"  autoFocus>
    Cancel
  </Button>
</DialogActions>
</Dialog>

<Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.menuClose}>
        <MenuItem onClick={this.editGroup}>Edit</MenuItem>
        <MenuItem onClick={this.deleteGroup}>{this.state.deleteMenuText}</MenuItem>
</Menu>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.openOption}
          onClose={this.handleCloseOptions}
          style={{alignItems:'center',justifyContent:'center'}}
        >
          <div style={this.getModalStyle()}  className={classes.modalOption}>
                {optionsComponent}
          </div>
        </Modal>

        <Modal
          aria-labelledby="modal-edit-group"
          aria-describedby="modal-edit-group"
          open={this.state.openEditGroup}
          onClose={this.closeEditGroup}
          style={{alignItems:'center',justifyContent:'center'}}
        >
          <div style={this.getModalEditStyle()}  className={classes.modalEdit}>
            <EditGroup group={this.state.selectedGroup} 
            nameOnChange={this.groupNameOnChange} 
            descOnChange={this.groupDescOnChange}
            save={this.saveGroupEdit}/>
          </div>
        </Modal>

</React.Fragment>
          );
    }

}

const mapStateToProps = state => {
    return {
        questionsByGroup : state.question.questionsByGroup,
        questionGroups : state.question.questionGroups
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        toggleSnackBar: bool => dispatch(toggleSnackBar(bool)),
        getQuestionsByGroup: groupId => dispatch(getQuestionsByGroup(groupId)),
        deleteQuestion: id => dispatch(deleteQuestion(id)),
        getQuestionGroups : () => dispatch(getQuestionGroups()),
        toggleActiveQuestion: questionId => dispatch(toggleActiveQuestion(questionId)),
        clearQuestion : () => dispatch(clearQuestion()),
        clearQuestionGroup : () => dispatch(clearQuestionGroup()),
        updateQuestionGroup: data => dispatch(updateQuestionGroup(data)),
        deleteQuestionGroup: data => dispatch(deleteQuestionGroup(data)),
        
        
    };
  }



const Question = connect(mapStateToProps,mapDispatchToProps)(QuestionComponent);


const styles2 = theme =>({
      paperEdit:{
        width:500,  
        padding: 20
      },
      iconButton:{
        marginTop:10 
      }
  })

const EditGroupComponent = props => {
    const {classes} = props;
    return(
        <React.Fragment>
            <Paper className={classes.paperEdit}>
                <Grid container >
                    
                        <TextField
                            id="groupName"
                            label="Group Name"
                            name='groupName'
                            value={props.group.name}
                            onChange={props.nameOnChange}
                            margin="normal"  
                            fullWidth                      
                        />
                        <TextField
                            id="groupDesc"
                            label="Group Description"
                            name='groupDesc'
                            value={props.group.description}
                            onChange={props.descOnChange}
                            margin="normal"  
                            fullWidth                      
                        />
                        <IconButton onClick={props.save} color="primary" aria-label="Filter" className={classNames('animated slideInLeft',classes.iconButton)}>
                            <DoneIcon />
                        </IconButton>
                    
                    
                    
                </Grid>
            </Paper>
        </React.Fragment>
    )
}
const EditGroup = withStyles(styles2)(EditGroupComponent);

export default withStyles(styles)(Question);



