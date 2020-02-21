import React,{Component} from 'react';
import { connect } from "react-redux";
import {getUsers,getUserAdmins,addUserAdmin,deleteUserAdmin}  from '../actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
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
        minWidth:180
    },
    widthDate:{
        minWidth:150
    },
    switchIcon:{
        height:10,
        width:10,
        color:'#ffffff'
    },
    fab:{
        marginTop : -30
    },
    selectUser:{
        marginTop:5
    },
    table:{
        border : 'solid 1px RGB(204, 204, 204)',
        borderRadius : 5,
        display:'inline-block',
        width:'-webkit-fill-available'    
    }


  })

class UserAdminComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalDelete:false,
            addUserAdmin:false,
            employee:null,
            toBeDelete:0
        }

    }

    componentDidMount(){
        if(_.isEmpty(this.props.allUsers)){
            this.props.getUsers();
        }
        if(_.isEmpty(this.props.userAdmins)){
            this.props.getUserAdmins();
        }
        
    }

    openAddUserAdmin = ()=> {
        this.setState({addUserAdmin:true})
    }

    addUserAdmin = ()=> {
        const employee = {emp_id:this.state.employee.value}
        this.props.addUserAdmin(employee)
        this.setState({addUserAdmin:false})
        this.setState({employee:null})
    }

    empOnChange = (e) =>{
        this.setState({employee:e})
    }

    handleClose(){
        this.setState({modalDelete:false})
    }

    confirmDelete = (empId) =>{
        this.setState({toBeDelete:empId, modalDelete:true})
    }

    handleDelete(){
        this.props.deleteUserAdmin(this.state.toBeDelete)
        this.setState({modalDelete:false})
    }

    
    render(){
        let dataSurvey = []
        let allUsers = []
        let userAdmins = []
        if(this.props.allUsers) allUsers = this.props.allUsers.map(user=>({value:user.emp_id,label:user.emp_name}));
        if(this.props.userAdmins) userAdmins = this.props.userAdmins
        const isSelectEmployee = this.state.employee!=null
      
        const { classes } = this.props;
        const renderFilter =
                            <Grid container justify='flex-start' spacing={16}>
                                <Grid item xs={11} className={classes.selectUser}>
                                <Select
                                    name="employee"
                                    value={this.state.employee}
                                    onChange={this.empOnChange}
                                    options={allUsers}
                                    placeholder='Select Employee to become admin'
                                    />
                                </Grid>                               

                                {isSelectEmployee && <Grid item xs={1} className='animated slideInLeft'>
                                    <IconButton onClick={this.addUserAdmin} color="primary"
                                    aria-label="Go" size="small">
                                            <SaveAltIcon/>
                                    </IconButton>
                                </Grid>}
                            </Grid>


        return (
        <React.Fragment>
        <Grid container spacing={8} direction='column' className={classes.container}>
            <Grid container direction='row' alignContent="flex-start">
                <Grid item  xs={10}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                    User Admin
                    </Typography>
                </Grid>

                <Grid item  xs={2} align="right">
                    <Fab onClick={this.openAddUserAdmin} size="small" color="secondary" aria-label="Add" className={classes.fab}>
                        <AddIcon />
                    </Fab>
                </Grid>

            {this.state.addUserAdmin==true && renderFilter }

            <Grid item xs={12} className={classes.table}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">id</TableCell>
                        <TableCell align="left">name</TableCell>
                        <TableCell align="center" className={classes.widthAction}>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {userAdmins.map(user => {
                        return (
                            <TableRow key={user.emp_id}>
                            <TableCell align="center">{user.emp_id}</TableCell>
                            <TableCell align="left">{user.emp_name}</TableCell>
                            <TableCell align="center">
                            <IconButton onClick={()=>this.confirmDelete(user.emp_id)} size="small" color="secondary" aria-label="Delete" >
                                <DeleteIcon fontSize='small'/>
                            </IconButton>
                            </TableCell>
                            </TableRow>
                        )
                    })
                    }
                    </TableBody>
                </Table>
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
  <Button onClick={()=>this.handleDelete()} color="secondary" >
    Delete
  </Button>
  <Button onClick={()=>this.handleClose()} color="primary" variant="contained"  autoFocus>
    Cancel
  </Button>
</DialogActions>
</Dialog>
</React.Fragment>
          );
    }

}

const mapStateToProps = state => {
    return {
        allUsers :  state.user.allUsers,
        userAdmins : state.user.userAdmins,
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        getUsers : () => dispatch(getUsers()),
        getUserAdmins : () => dispatch(getUserAdmins()),
        addUserAdmin : employee => dispatch(addUserAdmin(employee)),
        deleteUserAdmin: userId =>  dispatch(deleteUserAdmin(userId))
        
        
    };
  }


const UserAdmin = connect(mapStateToProps,mapDispatchToProps)(UserAdminComponent);

export default withStyles(styles)(UserAdmin);

