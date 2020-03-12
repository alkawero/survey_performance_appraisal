import React, { useState, useEffect } from "react";
import { doGet,doPatch,doDelete } from "../services/api-service";
import { connect } from "react-redux";
import history from "../history.js";
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
import Done from "@material-ui/icons/Done";
import IconButton from '@material-ui/core/IconButton';

import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "../components/ActionButton";
import AddIcon from "@material-ui/icons/Add";
import TableFooter  from '@material-ui/core/TableFooter';
import TablePagination   from '@material-ui/core/TablePagination';
import TextField  from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Delete from "@material-ui/icons/Delete";
import DeleteForever from "@material-ui/icons/DeleteForever";

const PaExternalDataComponent = props => {
    const { classes } = props;

    const [editedData, setEditedData] = useState({})
    const [dataTable, setDataTable] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [filterParams, setFilterParams] = useState({})
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [periodeOptions, setPeriodeOptions] = useState([])
    const [selectedPeriode, setSelectedPeriode] = useState(null)
    const [tobeDelete, setTobeDelete] = useState(0)

    const changePage=(event, newPage)=>{
        setPage(newPage+1)
        getData(newPage+1,filterParams)
    }

    const changeRowsPerPage = (event)=> {
        setRowsPerPage(+event.target.value);
        setPage(1);
    }

    useEffect(() => {
        getDataGroup()
        getDataPeriode()
        getData(page,filterParams)
    }, []);

    useEffect(() => {
        getData(page,filterParams)
    }, [rowsPerPage])



    const getData = async (toPage, filterParams) =>{
        let params={
            page:toPage,
            rowsPerPage:rowsPerPage
        }

        if(filterParams)
        params = {...params, ...filterParams}

        const response = await doGet("pa/external", params);

        setDataTable(response.data.data)
        setPage(response.data.meta.current_page)
        setTotalRows(response.data.meta.total)
    };

    const getDataGroup = async () =>{
        const params={}
        const response = await doGet('pa/external/group',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(group=>({value:group, label:group}))
            setGroupOptions(dataForSelect)
        }
    }

    const getDataPeriode = async () =>{
        const params={}
        const response = await doGet('pa/external/periode',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(periode=>({value:periode, label:periode}))
            setPeriodeOptions(dataForSelect)
        }
    }

    const filter = () =>{
        const params = {
            group: selectedGroup!==null ? selectedGroup.value : null,
            periode : selectedPeriode!==null ? selectedPeriode.value : null,
        };
        setFilterParams(params)
        getData(page,params)
    }

    const valueChange = (atribut, e) =>{
        setEditedData({...editedData, [atribut]:e.target.value})
    }

    const groupOnChange = (e) =>{
        setSelectedGroup(e)
    }

    const periodeOnChange = (e) =>{
        setSelectedPeriode(e)
    }

    const edit = (data)=>{
        setEditedData(data)
    }

    const confirmDelete = (data_id)=>{
        setTobeDelete(data_id)
    }

    const deleteData = async(data_id)=>{
        const params={id:data_id}
        await doDelete('pa/external',params)
        setTobeDelete(0)
        getData(page,filterParams)
    }



    const doneEditing = async ()=>{
        const params = {
            id :    editedData.id,
            group   :   editedData.group,
            key_name    :   editedData.key_name,
            key_id  :   editedData.key_id,
            value   :   editedData.value,
            periode : editedData.periode,
            updated_by: props.user.emp_id
        }
        await doPatch('pa/external',params,'update external data')
        getDataGroup()
        getDataPeriode()
        getData(page,filterParams)
        setEditedData({})
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
                            External data
                        </Typography>
                    </Grid>

                    <Grid item xs={2} align="right">
                        <ActionButton
                            type="fab"
                            for={["adm"]}
                            role={props.user.role}
                            action={() =>
                                history.push("/app/pa/external/create")
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
                                    options={groupOptions}
                                    value={selectedGroup}
                                    onChange={groupOnChange}
                                    placeholder='Select group'
                                    isClearable
                                    />
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    options={periodeOptions}
                                    value={selectedPeriode}
                                    onChange={periodeOnChange}
                                    placeholder='Select periode'
                                    isClearable
                                    />
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>

                        <Grid item xs={2} container justify="flex-end">
                            <IconButton  onClick={filter} color="primary" aria-label="search">
                                <Search />
                            </IconButton>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} className={classes.tableWrapper}>
                        <div className={classes.table}>
                            <Table>
                                <TableHead>
                                    <TableRow >
                                        <TableCell align="center">
                                        group
                                        </TableCell>
                                        <TableCell align="center">
                                        name by key
                                        </TableCell>
                                        <TableCell align="center">
                                        value
                                        </TableCell>
                                        <TableCell align="center">
                                        periode
                                        </TableCell>
                                        <TableCell align="center">
                                        created by
                                        </TableCell>

                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 &&
                                        dataTable.map(row => (
                                            <TableRow key={row.id} className={classes.table_row}>
                                                <TableCell align="center">
                                                    {editedData.id!==row.id && row.group}

                                                    {editedData.id===row.id &&
                                                    <TextField
                                                    value={editedData.group}
                                                    id={row.id}
                                                    label="group"
                                                    variant="outlined"
                                                    margin="dense"
                                                    onChange={()=>valueChange("group",event)}/>}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {row.name_by_key}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {editedData.id!==row.id && row.value}

                                                    {editedData.id===row.id &&
                                                    <TextField
                                                    value={editedData.value}
                                                    id={row.value}
                                                    label="value"
                                                    variant="outlined"
                                                    margin="dense"
                                                    onChange={()=>valueChange("value",event)}/>}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {editedData.id!==row.id && row.periode}

                                                    {editedData.id===row.id &&
                                                    <TextField
                                                    value={editedData.periode}
                                                    id={row.periode}
                                                    label="periode"
                                                    variant="outlined"
                                                    margin="dense"
                                                    onChange={()=>valueChange("periode",event)}/>}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.created_by}
                                                </TableCell>
                                                <TableCell align="left" style={{width:250}}>
                                                    {!editedData.id &&
                                                    <>
                                                    <ActionButton
                                                        title="edit"
                                                        type='icon-button'
                                                        for={['adm']}
                                                        role={props.user.role}
                                                        action={()=>edit(row)}
                                                        icon={<EditIcon fontSize='small'/>}
                                                    />
                                                        {tobeDelete!==row.id &&
                                                            <ActionButton
                                                            title="delete"
                                                            type='icon-button'
                                                                    for={['adm']}
                                                                    role={props.user.role}
                                                                    action={()=>confirmDelete(row.id)}
                                                                    icon={<Delete />}
                                                            />
                                                        }
                                                        {tobeDelete===row.id &&
                                                            <>are you sure ?
                                                            <ClickAwayListener onClickAway={()=>setTobeDelete(0)}>
                                                                    <ActionButton
                                                                        title="click again to delete"
                                                                        type='icon-button'
                                                                        for={['adm']}
                                                                        role={props.user.role}
                                                                        action={()=>deleteData(row.id)}
                                                                        icon={<DeleteForever />}
                                                                    />
                                                            </ClickAwayListener>
                                                            </>
                                                        }
                                                    </>
                                                    }

                                                    {editedData.id===row.id &&
                                                    <ActionButton
                                                        title="done"
                                                        type='icon-button'
                                                        for={['adm']}
                                                        role={props.user.role}
                                                        action={doneEditing}
                                                        icon={<Done />}
                                                    />
                                                    }


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

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};
const PaExternalData = connect(mapStateToProps)(PaExternalDataComponent);
export default withStyles(styles)(PaExternalData);
