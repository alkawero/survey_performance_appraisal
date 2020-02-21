import React, { useState, useEffect } from "react";
import { doGet,doDownloadExcel } from "../services/api-service";
import { connect } from "react-redux";
import history from "../history.js";
import {getDataDoAssessment,getAssessmentDetail}  from '../actions';
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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
import Select from 'react-select';
import Search from "@material-ui/icons/Search";
import Visibility from "@material-ui/icons/Visibility";

import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import IconButton from '@material-ui/core/IconButton';
import Print from "@material-ui/icons/Print";
import ActionButton from "../components/ActionButton";
import AddIcon from "@material-ui/icons/Add";
import TableFooter  from '@material-ui/core/TableFooter';
import TablePagination   from '@material-ui/core/TablePagination';

const PaAssessmentComponent = props => {
    const { classes } = props;

    const [dataTable, setDataTable] = useState([]);
    const [masterOptions, setMasterOptions] = useState([])
    const [expandFilter, setExpandFilter] = useState(false)
    const [selectedPaMaster, setSelectedPaMaster] = useState(null)
    const [selectedParticipants, setSelectedParticipants] = useState([])
    const [participantOptions, setParticipantOptions] = useState([])
    const [unitParticipantOptions, setUnitParticipantOptions] = useState([])
    const [selectedUnitParticipant, setSelectedUnitParticipant] = useState(null)
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
        getDataMaster()
        getDataParticipants()
        getData(page,filterParams)
        getDataUnit()
    }, []);

    useEffect(() => {
        getData(page,filterParams)
    }, [rowsPerPage])

    const getDataMaster = async () =>{
        const params={}
        const response = await doGet('pa/master',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(master=>({value:master.id, label:`${master.name} - semester ${master.semester} - periode ${master.periode}`}))
            setMasterOptions(dataForSelect)
        }

    }

    const filter = async () => {
        const params = {
            participant_ids: selectedParticipants.length > 0 ? selectedParticipants.map(p=>(p.value)):null,
            master_id : selectedPaMaster!==null ? selectedPaMaster.value : null,
            unit_id : selectedUnitParticipant!==null ? selectedUnitParticipant.value : null
        };
        setFilterParams(params)
        getData(page,params)
    };

    const getData = async (toPage, filterParams) =>{
        let params={
            page:toPage,
            rowsPerPage:rowsPerPage
        }

        if(filterParams)
        params = {...params, ...filterParams}

        const response = await doGet("pa/assessment", params);

        setDataTable(response.data.data)
        setPage(response.data.meta.current_page)
        setTotalRows(response.data.meta.total)
    };

    const getDataParticipants = async () =>{
        const params={}
        const response = await doGet('user',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(emp=>({value:emp.emp_id, label:emp.emp_name}))
            setParticipantOptions(dataForSelect)
        }

    }

    const getDataUnit = async () =>{
        const params={}
        const response = await doGet('unit',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(unit=>({value:unit.unit_id, label:unit.unit_name}))
            setUnitParticipantOptions(dataForSelect)
        }

    }

    const toggleExpandFilter = ()=>{
        setExpandFilter(!expandFilter)
    }
    const unitParticipantOnChange = (e) =>{
        setSelectedUnitParticipant(e)
    }

    const participantsOnChange = (e) =>{
        setSelectedParticipants(e)
    }


    const masterOnChange = (e) =>{
        setSelectedPaMaster(e)
    }

    const goToDetail = (assessment_user_id) =>{
        props.getAssessmentDetail(assessment_user_id)
        history.push("/app/assessment/detail")
    }

    const exporting = (e) =>{
        const params = {
            file_name:'assessments',
            participant_ids: selectedParticipants.length > 0 ? selectedParticipants.map(p=>(p.value)):null,
            master_id : selectedPaMaster!==null ? selectedPaMaster.value : null,
            unit_id : selectedUnitParticipant!==null ? selectedUnitParticipant.value : null
        };
        doDownloadExcel("pa/assessment/export/excel",params)
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

                    <Grid item xs={2} align="right">
                        <ActionButton
                            type="fab"
                            for={["adm"]}
                            role={props.user.role}
                            action={() =>
                                history.push("/app/assessment/create")
                            }
                            icon={<AddIcon />}
                            color="secondary"
                            class={classes.fab}
                        />

                    </Grid>

                    <Grid container spacing={8} className={classes.filterContainer} >
                        <Grid item spacing={8} xs={9}container>
                            <Grid item xs={4}>
                                <Select
                                    options={masterOptions}
                                    value={selectedPaMaster}
                                    onChange={masterOnChange}
                                    placeholder='Select PA Master'
                                    isClearable
                                    />
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    isClearable
                                    name="unit_participants"
                                    value={selectedUnitParticipant}
                                    onChange={unitParticipantOnChange}
                                    options={unitParticipantOptions}
                                    placeholder='Select Department'
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    isMulti
                                    name="participants"
                                    value={selectedParticipants}
                                    onChange={participantsOnChange}
                                    options={participantOptions}
                                    placeholder='Select the participants'/>
                            </Grid>
                            {
                                expandFilter &&
                                <>
                                    <Grid item xs={4}>
                                        <Select
                                            options={masterOptions}
                                            value={selectedPaMaster}
                                            onChange={masterOnChange}
                                            placeholder='Select PA Master'
                                            />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Select
                                            isMulti
                                            name="participants"
                                            value={selectedParticipants}
                                            onChange={participantsOnChange}
                                            options={participantOptions}
                                            placeholder='Select the participants'/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Select
                                            name="unit_participants"
                                            value={selectedUnitParticipant}
                                            onChange={unitParticipantOnChange}
                                            options={unitParticipantOptions}
                                            placeholder='Select Department'
                                        />
                                    </Grid>
                                </>
                            }

                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={toggleExpandFilter} color="primary"size="small" aria-label="toggleFilter">
                                    {!expandFilter && <ExpandMore fontSize="small"/>}
                                    {expandFilter &&<ExpandLess fontSize="small"/>}
                            </IconButton>
                        </Grid>

                        <Grid item xs={2} container justify="flex-end">
                            <IconButton  onClick={filter} color="primary" aria-label="search">
                                <Search />
                            </IconButton>
                            <IconButton onClick={exporting} color="primary" aria-label="search">
                                <Print />
                            </IconButton>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} className={classes.tableWrapper}>
                        <div className={classes.table}>
                            <Table>
                                <TableHead>
                                    <TableRow >
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
                                        <TableCell align="center">
                                            finalscore
                                        </TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 &&
                                        dataTable.map(row => (
                                            <TableRow key={row.id} className={classes.table_row}>
                                                <TableCell align="center">
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
                                                    {row.score_category}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <ActionButton
                                                        type="icon-button"
                                                        for={["adm"]}
                                                        role={props.user.role}
                                                        action={() =>goToDetail(row.id)}
                                                        disabled={row.status === 0 || row.is_custom===0}
                                                        icon={<Visibility fontSize="small" />}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                                <TableFooter>
                                    <tr>
                                        <td colspan="10">
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
    },
    filterContainer:{
        marginBottom:10
    },
    table_row:{
        '&:hover': {
            backgroundColor: "#f2effd",
            color:"white"
          }
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
const PaAssessment = connect(mapStateToProps,mapDispatchToProps)(PaAssessmentComponent);
export default withStyles(styles)(PaAssessment);
