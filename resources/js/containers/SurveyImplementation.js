import React,{Component} from 'react';
import { connect } from "react-redux";
import { doGet } from "../services/api-service";
import {setLastPage,setImplPage,setImplRowPerPage,getSurveySelect, clearSurveyTask,toggleActiveSurveyImpl,getCrntSrvImpl,toggleSnackBar,getsurveyTasks,getsurveyTaskDetail}  from '../actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import history from "../history.js";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import RefreshIcon from '@material-ui/icons/Refresh';
import InputIcon from '@material-ui/icons/Input';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';

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
import Switch  from '@material-ui/core/Switch';
import  TextField  from '@material-ui/core/TextField';
import Select from 'react-select';
import concat from "lodash/concat";
import ActionButton from '../components/ActionButton'
import TablePagination   from '@material-ui/core/TablePagination';
import TableFooter  from '@material-ui/core/TableFooter';


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
    long:{
        minWidth:150    ,
    },
    switchIcon:{
        height:10,
        width:10,
        color:'#ffffff'
    },
    fab:{
        marginTop : -30
    },
    marginTops:{
        marginTop:10
    },
    tableWrapper: {
        overflowX: 'auto',
      },

    overrides: {
        MuiTableCell: {
         root: {
            backgroundColor: 'white'
          },
        paddingDefault: {
           padding: '40px 24px 40px 16px',
         },
        },
    },
    table:{
        border:'solid 1px RGB(204, 204, 204)',
        borderRadius : 5,
        display:'inline-block',
    },
    td:{
        display:'flex',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    spacing:{
        marginLeft:5,
        marginRight:5
    }

  })


const filterTaskOptions = [{value:'my_task',label:'My Survey Task'},{value:'all_task',label:'All Survey Task'}]


class SurveyImplementationComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalDelete:false,
            filterOpen:false,
            filterSurvey:null,
            filterOwnerName:'',
            filterTask:{value:'all_task',label:'All Survey Task'},
            firstTime:true,
            periodeOptions:[],
            filterPeriode:null
        }

    }

    componentDidMount(){
        this.setState({firstTime:false})
        this.refresh(this.props.page,this.props.rowsPerPage)
        this.props.getSurveySelect()
        this.getPeriodeOptions()

    }

    componentWillUnmount(){
        this.props.clearSurveyTask()

        this.props.setLastPage('implementation')
    }

    getPeriodeOptions = async() =>{
        const response = await doGet('survey/trx/periode',{});
        if(response){
            const periodeOpt= response.data.map(data=>({label:data, value:data}))
            this.setState({periodeOptions:periodeOpt})
        }
    }

    filterPeriodeChange = (e) =>{
        this.setState({filterPeriode:e})
    }

    filterSurveyChange = (e) =>{
        this.setState({filterSurvey:e})
    }

    filterNameOnChange = (e)=> {
        this.setState({filterOwnerName:e.target.value})
    }

    filterTaskChange = async(value)=> {
        await this.setState({filterTask:value})
        this.refresh(this.props.page,this.props.rowsPerPage)
    }

    prevPage = ()=>{
        let prev = this.props.page-1
        this.props.setImplPage(prev)
        this.refresh(prev,this.props.rowsPerPage)
    }

    nextPage = ()=>{
        let next = this.props.page+1
        this.props.setImplPage(next)
        this.refresh(next,this.props.rowsPerPage)
    }

    btnRefresh = ()=>{
        this.refresh(this.props.page,this.props.rowsPerPage)
    }

    refresh = (page=1,pagination=5)=> {
        let surveyorId = this.props.user.role=='usr' ? this.props.user.emp_id : 'admin'
        const surveyId  = this.state.filterSurvey == null ? 'null': this.state.filterSurvey.value
        const ownerName  = this.state.filterOwnerName == ''? 'null' : this.state.filterOwnerName

        if(this.props.user.role==='adm' && this.state.filterTask.value==='my_task'){
            surveyorId = this.props.user.emp_id
        }
        const data = {surveyorId:surveyorId,surveyId:surveyId,ownerName:ownerName,page:page,pagination:pagination}

        this.props.getsurveyTasks(data)
    }

    toggleFIlter = ()=> {
        this.setState({filterOpen:!this.state.filterOpen})
    }

    handleClose(){
        this.setState({modalDelete:false})
    }

    handleDelete(){
        this.setState({modalDelete:false})
        this.props.toggleSnackBar(true)
    }

    answerSurvey(surveyId){
        this.props.getsurveyTaskDetail(surveyId)
        history.push('/app/survey/task/answer')
    }

    edit(surveyTrxUserId){
        this.props.getCrntSrvImpl(surveyTrxUserId)
        history.push('/app/survey/implementation/edit')
    }

    addHandle = ()=>{
        history.push('/app/survey/implementation/create')
    }

    toggleActive = (trxId)=>{
        const surveyId = this.state.filterSurvey===null?'null':this.state.filterSurvey.value
        const ownerName = this.state.filterOwnerName===''?'null':this.state.filterOwnerName
        const param = {surveyTrxId:trxId, surveyId:surveyId, ownerName:ownerName, page:this.props.page, pagination:this.props.rowsPerPage}

        this.props.toggleActiveSurveyImpl(param)

    }

    handleChangePage=(e,newPage)=>{

        console.log(this.props.page+' - '+newPage)

    }

    handleChangeRowsPerPage=(e)=>{
        this.props.setImplRowPerPage(parseInt(e.target.value))
        //this.setState({rowsPerPage:parseInt(e.target.value)})
        this.props.setImplPage(1)
        this.refresh(1,e.target.value)
    }

    render(){
        let dataSurvey = [];
        let surveyOptions=[];
        let totalData = 0
        let from = 1
        let to = 5
        let current_page = 1
        let last_page = 2
        if(this.props.surveyForSelect) surveyOptions = this.props.surveyForSelect.map(survey=>({value:survey.id,label:survey.judul}));

        if(this.props.surveyTasks.data){
            dataSurvey = concat(dataSurvey,this.props.surveyTasks.data)
            totalData = this.props.surveyTasks.meta.total
            from = this.props.surveyTasks.meta.from
            to = this.props.surveyTasks.meta.to
            last_page = this.props.surveyTasks.meta.last_page
            current_page = this.props.surveyTasks.meta.current_page
        }
        const isAdmin = this.props.user.role=='adm'
        let allTask = false
        if(isAdmin && this.state.filterTask.value==='all_task'){
            allTask=true
        }

        const { classes } = this.props;
        const rowsPerPage = this.props.rowsPerPage
        //const page = this.props.page ? this.props.page : this.state.page
        return (
        <React.Fragment>
        <Grid container spacing={8} direction='column' className={classes.container}>
            <Grid container direction='row' alignContent="flex-start">
                <Grid item  xs={10}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                    {(isAdmin && 'Survey Implementation')|| 'Survey List'}
                    </Typography>
                </Grid>

                <Grid item  xs={2} align="right">
                        <ActionButton
                             type='fab'
                             for={['adm']}
                             role={this.props.user.role}
                             action={this.addHandle}
                             icon={<AddIcon />}
                             class={classes.fab}/>
                        <ActionButton
                             type='fab'
                             for={['usr','ldr']}
                             role={this.props.user.role}
                             action={this.btnRefresh}
                             icon={<RefreshIcon />}
                             class={classes.fab}/>

                </Grid>

                {isAdmin && <Grid container justify='flex-start' spacing={16}>
                    <Grid item xs={3} >
                        <Select className={classes.marginTops}
                                options={surveyOptions}
                                value={this.state.filterSurvey}
                                onChange={this.filterSurveyChange}
                                placeholder='Filter survey'
                                isClearable={true}
                                />
                    </Grid>

                    <Grid item xs={2}>
                        <Select className={classes.marginTops}
                            options={this.state.periodeOptions}
                            value={this.state.filterPeriode}
                            onChange={this.filterPeriodeChange}
                            placeholder='Filter periode'
                            isClearable={true}
                            />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            id="filterOwner"
                            label="owner name"
                            fullWidth
                            value={this.state.filterOwnerName}
                            onChange = {this.filterNameOnChange}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <IconButton onClick={() => this.refresh(this.props.page,rowsPerPage)} color="primary" className={classes.marginTops}
                        aria-label="Go" size="small">
                                <SearchIcon fontSize='small'/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} >
                            <Select className={classes.marginTops}
                                options={filterTaskOptions}
                                value={this.state.filterTask}
                                onChange={this.filterTaskChange}
                                placeholder='Filter task'
                                />
                    </Grid>
                </Grid>
                }


            <Grid item xs={12} container justify='center' className={classes.tableWrapper}>
            <div className={classes.table}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" className={classes.long}>Title</TableCell>
                        <TableCell align="center" className={classes.long}>Periode</TableCell>
                        <TableCell align="center" className={classes.long}>Description</TableCell>
                        <TableCell align="center">Owner</TableCell>
                        <TableCell align="center" className={classes.widthDate}>Valid From</TableCell>
                        <TableCell align="center" className={classes.widthDate}>Valid Until</TableCell>
                        <TableCell align="center" >Status</TableCell>
                        {(!isAdmin || !allTask) && <TableCell align="center" >Done</TableCell>}
                        <TableCell align="center" className={classes.widthAction}>Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {dataSurvey.map(row => {
                        const done = row.done===true?<DoneIcon color='primary'/>:''
                        return (
                            <TableRow key={row.id}>
                            <TableCell align="left">{row.judul}</TableCell>
                            <TableCell align="left">{row.periode}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.owner_name}</TableCell>
                            <TableCell align="center">{(!row.expired&&row.valid_from)||'expired'}</TableCell>
                            <TableCell align="center">{(!row.expired&&row.valid_until)||'expired'}</TableCell>
                            <TableCell align="center">
                            {   isAdmin && <Switch
                                checked={row.active==='1'}
                                color='primary'
                                onChange={()=>this.toggleActive(row.survey_trx_id)}/>
                            }
                            {   (!isAdmin) && <Switch
                                checked={row.active==='1'}
                                color='primary'/>
                            }
                            </TableCell>
                            {(!isAdmin || !allTask) && <TableCell align="center">{done}</TableCell>}
                            <TableCell align="center">

                            {(!isAdmin || !allTask) && <ActionButton
                                type='icon-button'
                                for={['usr','adm','ldr']}
                                role={this.props.user.role}
                                action={()=>this.answerSurvey(row.id)}
                                disabled = {row.done || row.active==='0' || row.expired || !row.started}
                                icon={<InputIcon fontSize='small'/>}/>}

                            <ActionButton
                                title="edit"
                                type='icon-button'
                                for={['adm']}
                                role={this.props.user.role}
                                action={()=>this.edit(row.id)}
                                icon={<EditIcon fontSize='small'/>}/>
                            </TableCell>
                            </TableRow>
                        )
                    })
                    }
                    </TableBody>
                        <TableFooter>
                            {1==0 && <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={totalData}
                                rowsPerPage={rowsPerPage}
                                page={this.props.page+1}
                                SelectProps={{
                                native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />}
                            <tr>
                                <td colSpan="7">
                                <Grid container justify='flex-end' alignItems='center'>
                                    <span className={classes.spacing}> Rows per page : </span>

                                    <select value={rowsPerPage} onChange={this.handleChangeRowsPerPage}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                    </select>

                                    <span className={classes.spacing}>
                                    {` ${from} - ${to} of ${totalData}`}
                                    </span>

                                    <IconButton disabled={current_page===1}
                                    onClick={this.prevPage} color="primary"
                                    aria-label="Go" size="small">
                                            <NavigateBeforeIcon fontSize='small'/>
                                    </IconButton>

                                    <IconButton disabled={current_page===last_page}
                                    onClick={this.nextPage} color="primary"
                                    aria-label="Go" size="small">
                                            <NavigateNextIcon fontSize='small'/>
                                    </IconButton>
                                </Grid>
                                </td>
                            </tr>

                        </TableFooter>
                </Table>
                </div>
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
        surveyPaginate : state.survey.surveyPaginate,
        user : state.user.user,
        surveyTasks : state.survey.surveyTasks,
        surveyForSelect :state.survey. surveyForSelect,
        rowsPerPage:state.ui.implementation_row_per_page,
        page:state.ui.implementation_page,
        unmount:state.ui.implementation_unmount,
        lastPage:state.ui.lastPage,
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        toggleSnackBar: isShow => dispatch(toggleSnackBar(isShow)),
        getsurveyTasks : empId => dispatch(getsurveyTasks(empId)),
        getsurveyTaskDetail : surveyId => dispatch(getsurveyTaskDetail(surveyId)),
        getCrntSrvImpl : surveyTrxUserId => dispatch(getCrntSrvImpl(surveyTrxUserId)),
        toggleActiveSurveyImpl : trxId => dispatch(toggleActiveSurveyImpl(trxId)),
        clearSurveyTask : () => dispatch(clearSurveyTask()),
        getSurveySelect : () => dispatch(getSurveySelect()),
        setImplRowPerPage : row => dispatch(setImplRowPerPage(row)),
        setImplPage : page => dispatch(setImplPage(page)),
        setLastPage : data => dispatch(setLastPage(data)),


    };
  }




const SurveyImplementation = connect(mapStateToProps,mapDispatchToProps)(SurveyImplementationComponent);

export default withStyles(styles)(SurveyImplementation);

