import React, { useState, useEffect } from "react";
import { doGet } from "../services/api-service";
import { connect } from "react-redux";
import {getDataDoAssessment,getAssessmentDetail}  from '../actions';
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../history.js";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import RefreshIcon from '@material-ui/icons/Refresh';
import DoneIcon from "@material-ui/icons/Done";
import PriorityHigh from "@material-ui/icons/PriorityHigh";
import Visibility from "@material-ui/icons/Visibility";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ActionButton from "../components/ActionButton";
import InputIcon from "@material-ui/icons/Input";
import TableFooter  from '@material-ui/core/TableFooter';
import TablePagination   from '@material-ui/core/TablePagination';
import Tooltip   from '@material-ui/core/Tooltip';

const PaMyAssessmentComponent = props => {
    const { classes } = props;

    const [dataTable, setDataTable] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [filterParams, setFilterParams] = useState({})

    const changePage=(event, newPage)=>{
        setPage(newPage+1)
        getData(newPage+1,filterParams)
    }

    const changeRowsPerPage = (event)=> {
        setRowsPerPage(+event.target.value);
        setPage(1);
    }

    useEffect(() => {
        getData(page,filterParams)
    }, []);

    useEffect(() => {
        getData(page,filterParams)
    }, [rowsPerPage])


    const btnRefresh = ()=>{
        getData(page,filterParams)
    }

    const getData = async (toPage, filterParams) =>{
        let params={
            page:toPage,
            rowsPerPage:rowsPerPage,
            user_id: props.user.emp_id
        }

        if(filterParams)
        params = {...params, ...filterParams}

        const response = await doGet(
            "pa/assessment/my",
            params
        );
        setDataTable(response.data.data)
        setPage(response.data.meta.current_page)
        setTotalRows(response.data.meta.total)
    };

    const doAssessment = $assessmentUserId => {
        props.getDataDoAssessment($assessmentUserId)
        history.push("/app/assessment/do");
    };

    const DoneAction = ({user_id, row})=>{
        if(user_id == row.atasan_id && row.fill_by_atasan == 1 ||
            user_id == row.owner && row.fill_by_staff == 1){
            return (
                    <ActionButton
                    title="detail"
                    type="icon-button"
                    for={["usr","adm","ldr"]}
                    role={props.user.role}
                    action={() =>goToDetail(row.id)}
                    disabled={row.status === 0}
                    icon={<Visibility fontSize="small" />}
                />
            )
        }else{
            return(
                <ActionButton
                    title="enter"
                    type="icon-button"
                    for={["usr", "adm","ldr"]}
                    role={props.user.role}
                    action={() =>doAssessment(row.id)}
                    disabled={row.active === 0}
                    icon={<InputIcon fontSize="small" />}
                />
            )
        }
    }

    const ApprovalStatus = ({approval})=>{

        if(approval===1){
            return(
                <Tooltip title="approved by staff">
                    <DoneIcon fontSize="small" color="primary"/>
                </Tooltip>
            )
        }else if(approval===2){
            return(
                <Tooltip title="rejected by staff">
                    <PriorityHigh fontSize="small" color="secondary"/>
                </Tooltip>
            )
        }else{
            return null
        }

    }

    const goToDetail = (assessment_user_id) =>{
        props.getAssessmentDetail(assessment_user_id)
        history.push("/app/assessment/detail")
    }


    return (
        <React.Fragment>
            <Grid
                container
                spacing={8}
                direction="column"
                className={classes.container}
            >
                <Grid container direction="row" alignContent="flex-start">
                    <Grid item xs={10}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            className="animated slideInLeft"
                        >
                            Assessment List
                        </Typography>
                    </Grid>

                    <Grid item  xs={2} align="right">
                        <ActionButton
                             type='fab'
                             title="refresh"
                             tooltip={true}
                             for={['adm','usr','ldr']}
                             role={props.user.role}
                             action={btnRefresh}
                             icon={<RefreshIcon />}
                             class={classes.fab}/>

                    </Grid>

                    <Grid item xs={12} className={classes.tableWrapper}>
                        <div className={classes.table}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Owner
                                        </TableCell>
                                        <TableCell align="center">
                                            Assessment
                                        </TableCell>
                                        <TableCell align="center">
                                            Valid From
                                        </TableCell>
                                        <TableCell align="center">
                                            Valid Until
                                        </TableCell>
                                        <TableCell align="center">
                                            Status
                                        </TableCell>
                                        <TableCell align="center">
                                            total score
                                        </TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 &&
                                        dataTable.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell align="left">
                                                    {row.owner_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.master_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.valid_from}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.valid_until}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.status_value}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.total_score}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Grid container alignItems="center">
                                                        <ApprovalStatus approval={row.approval_staff}/>
                                                        {props.user &&
                                                        <DoneAction
                                                            user_id = {props.user.emp_id}
                                                            row = {row}
                                                        />
                                                        }
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>

                                <TableFooter>
                                    <tr>
                                        <td colspan="5">
                                            <Grid container justify="flex-end">
                                                <Grid item>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={totalRows}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page-1}
                                                    backIconButtonProps={{
                                                        'aria-label': 'previous page',
                                                    }}
                                                    nextIconButtonProps={{
                                                        'aria-label': 'next page',
                                                    }}
                                                    onChangePage={changePage}
                                                    onChangeRowsPerPage={changeRowsPerPage}
                                                />
                                                </Grid>
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
                open={false}
                onClose={() => {}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete confirmation ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Apakah anda yakin akan menghapus data tersebut ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {}} color="secondary">
                        Delete
                    </Button>
                    <Button
                        onClick={() => {}}
                        color="primary"
                        variant="contained"
                        autoFocus
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};



const styles = theme => ({
    button_mini: {
        width: 30,
        height: 30,
        padding: 0
    },
    selectFilter: {
        marginTop: 5
    },
    container: {
        margin: -16
    },
    widthAction: {
        minWidth: 180
    },
    widthDate: {
        minWidth: 150
    },
    switchIcon: {
        height: 10,
        width: 10,
        color: "#ffffff"
    },
    fab: {
        marginTop: -30
    },
    tableWrapper: {
        overflow: "auto"
    },
    table: {
        border: "solid 1px RGB(204, 204, 204)",
        borderRadius: 5,
        display: "inline-block",
        width: "-webkit-fill-available"
    }
});
const mapDispatchToProps = dispatch => {
    return {
        getDataDoAssessment : data => dispatch(getDataDoAssessment(data)),
        getAssessmentDetail : data => dispatch(getAssessmentDetail(data)),

    };
  }

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const PaMasterCreate = connect(mapStateToProps,mapDispatchToProps)(PaMyAssessmentComponent);
export default withStyles(styles)(PaMasterCreate);


