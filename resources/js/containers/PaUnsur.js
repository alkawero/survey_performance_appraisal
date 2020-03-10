import React, { useState, useEffect } from "react";
import {setUnsurEdit} from '../actions'
import { connect } from "react-redux";
import { doGet,doDelete } from "../services/api-service";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../history.js";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
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
import ActionButton from "../components/ActionButton";
import TableFooter  from '@material-ui/core/TableFooter';
import TablePagination   from '@material-ui/core/TablePagination';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Delete from "@material-ui/icons/Delete";
import DeleteForever from "@material-ui/icons/DeleteForever";

const PaUnsurComponent = (props) => {

    const { classes } = props;

    const [dataTable, setDataTable] = useState([])
    const [aspekOptions, setAspekOptions] = useState([])
    const [selectedAspek, setSelectedAspek] = useState(null)
    const [subAspekOptions, setSubAspekOptions] = useState([])
    const [selectedSubAspek, setSelectedSubAspek] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [filterParams, setFilterParams] = useState({})
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
        getDataAspek()
        getDataSubAspek()
        getData(page)
        props.setUnsurEdit(null)
    }, [])

    useEffect(() => {
        getDataSubAspek()
    }, [selectedAspek])

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

        const response = await doGet('pa/unsur',params)

        setDataTable(response.data.data)
        setPage(response.data.meta.current_page)
        setTotalRows(response.data.meta.total)
    }

    const getDataAspek = async () =>{
        const params={}
        const response = await doGet('pa/aspek',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(row=>({value:row.id, label:row.name}))
            setAspekOptions(dataForSelect)
        }
    }

    const getDataSubAspek = async () =>{
        const params={aspek_id:selectedAspek!==null ? selectedAspek.value : null }
        const response = await doGet('pa/subaspek',params)
        if(response.data.length>0){
            const dataForSelect = response.data.map(row=>({value:row.id, label:row.name}))
            setSubAspekOptions(dataForSelect)
        }
    }

    const aspekOnChange = (e) =>{
        setSelectedAspek(e)
    }

    const subAspekOnChange = (e) =>{
        setSelectedSubAspek(e)
    }

    const filter = async () => {
        const params = {
            aspek_id : selectedAspek!==null ? selectedAspek.value : null,
            sub_aspek_id : selectedSubAspek!==null ? selectedSubAspek.value : null,
            sub_aspek_ids: subAspekOptions.map(s=>s.value)
        };
        setFilterParams(params)
        getData(page,params)
    };

    const edit = async(unsur)=>{
        props.setUnsurEdit(unsur)
        history.push("/app/unsur/create")
    }
    const confirmDelete = (data_id)=>{
        setTobeDelete(data_id)
    }

    const deleteData = async(data_id)=>{
        const params={id:data_id}
        setDataTable(dataTable.filter(data=>data.id!==data_id))
        await doDelete('pa/unsur',params)
        setTobeDelete(0)
        getData(page,filterParams)
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
                            PA Unsur
                        </Typography>
                    </Grid>

                    <Grid item xs={2} align="right">
                        <Fab
                            onClick={() =>
                                history.push("/app/unsur/create")
                            }
                            size="small"
                            color="secondary"
                            aria-label="Add"
                            className={classes.fab}
                        >
                            <AddIcon />
                        </Fab>
                    </Grid>

                    <Grid container spacing={8} className={classes.filterContainer} >
                        <Grid item spacing={8} xs={9}container>
                            <Grid item xs={4}>
                                <Select
                                    options={aspekOptions}
                                    value={selectedAspek}
                                    onChange={aspekOnChange}
                                    placeholder='Select aspek'
                                    isClearable
                                    />
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    options={subAspekOptions}
                                    value={selectedSubAspek}
                                    onChange={subAspekOnChange}
                                    placeholder='Select sub aspek'
                                    isClearable
                                    />
                            </Grid>
                        </Grid>
                        <Grid item xs={3} container justify="flex-end">
                            <IconButton  onClick={filter} color="primary" aria-label="search">
                                <Search />
                            </IconButton>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} className={classes.tableWrapper}>
                        <div className={classes.table}>
                        <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Sub Aspek
                                        </TableCell>
                                        <TableCell align="center">
                                            Unsur Code
                                        </TableCell>
                                        <TableCell align="center">
                                            Unsur Name
                                        </TableCell>
                                        <TableCell align="center">
                                            Creator
                                        </TableCell>
                                        <TableCell align="center">
                                            Status
                                        </TableCell>
                                        <TableCell align="center">

                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 && dataTable.map(
                                        row => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">
                                                    {row.sub_aspek_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.code}
                                                </TableCell>
                                                <TableCell align="center">
                                                {row.name}
                                                </TableCell>
                                                <TableCell align="center">
                                                {row.created_by_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                {row.status_value}
                                                </TableCell>
                                                <TableCell align="left" style={{width:250}}>
                                                    <ActionButton
                                                        type='icon-button'
                                                        for={['adm']}
                                                        role={props.user.role}
                                                        action={()=>edit(row)}
                                                        icon={<EditIcon fontSize='small'/>}/>

                                                    {tobeDelete!==row.id &&
                                                            <ActionButton
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
                                                                        tooltip={true}
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
                                                </TableCell>
                                            </TableRow>

                                        )
                                    )
                                    }


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
                    <Button
                        onClick={() => {}}
                        color="secondary"
                    >
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

}

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

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUnsurEdit: unsur => dispatch(setUnsurEdit(unsur)),
    };
  }

const PaUnsur = connect(mapStateToProps,mapDispatchToProps)(PaUnsurComponent);

export default withStyles(styles)(PaUnsur);
