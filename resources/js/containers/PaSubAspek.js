import React, { useState, useEffect } from "react";
import {setSubAspekEdit} from '../actions'
import { connect } from "react-redux";
import { doGet } from "../services/api-service";
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


const PaSubAspekComponent = (props) => {

    const { classes } = props;

    const [dataTable, setDataTable] = useState([])
    const [aspekOptions, setAspekOptions] = useState([])
    const [selectedAspek, setSelectedAspek] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [filterParams, setFilterParams] = useState({})

    useEffect(() => {
        getDataAspek()
        getData(page)
        props.setSubAspekEdit(null)
    }, [])

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

        const response = await doGet('pa/subaspek',params)
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

    const aspekOnChange = (e) =>{
        setSelectedAspek(e)
    }

    const filter = async () => {
        const params = {
            aspek_id : selectedAspek!==null ? selectedAspek.value : null
        };
        setFilterParams(params)
        getData(page,params)
    };

    const edit = async(subAspek)=>{
        props.setSubAspekEdit(subAspek)
        history.push("/app/subaspek/create")
    }

    const changePage=(event, newPage)=>{
        setPage(newPage+1)
        getData(newPage+1,filterParams)
    }

    const changeRowsPerPage = (event)=> {
        setRowsPerPage(+event.target.value);
        setPage(1);
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
                            PA Sub Aspek
                        </Typography>
                    </Grid>

                    <Grid item xs={2} align="right">
                        <Fab
                            onClick={() =>
                                history.push("/app/subaspek/create")
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
                                            Aspek
                                        </TableCell>
                                        <TableCell align="center">
                                            Sub Aspek Code
                                        </TableCell>
                                        <TableCell align="center">
                                            Sub Aspek Name
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
                                                {row.aspek_name}
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
                                                <TableCell align="center">
                                                <ActionButton
                                                    type='icon-button'
                                                    for={['adm']}
                                                    role={props.user.role}
                                                    action={()=>edit(row)}
                                                    icon={<EditIcon fontSize='small'/>}/>
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
        setSubAspekEdit: aspek => dispatch(setSubAspekEdit(aspek)),
    };
  }

const PaSubAspek = connect(mapStateToProps,mapDispatchToProps)(PaSubAspekComponent);

export default withStyles(styles)(PaSubAspek);
