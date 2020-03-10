import React, { useState, useEffect } from "react";
import { doGet,doPatch } from "../services/api-service";
import { connect } from "react-redux";
import {
    clearSurvey,
    toggleActiveSurvey,
    getOneSurvey,
} from "../actions";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../history.js";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import Search from "@material-ui/icons/Search";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter  from '@material-ui/core/TableFooter';
import TablePagination   from '@material-ui/core/TablePagination';
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Select from "react-select";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
];



const SurveyComponent = props =>{
    const [dataSurvey, setDataSurvey] = useState([])
    const [expandFilter, setExpandFilter] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [totalRows, setTotalRows] = useState(0)
    const [filterParams, setFilterParams] = useState({})


    useEffect(() => {
        getDataSurvey(page,filterParams)
    }, []);

    useEffect(() => {
        getDataSurvey(page,filterParams)
    }, [rowsPerPage])

    const changePage=(event, newPage)=>{
        setPage(newPage+1)
        getDataSurvey(newPage+1,filterParams)
    }

    const changeRowsPerPage = (event)=> {
        setRowsPerPage(+event.target.value);
        setPage(1);
    }

    const getDataSurvey = async (toPage, filterParams) =>{
        let params={
            page:toPage,
            rowsPerPage:rowsPerPage
        }

        if(filterParams)
        params = {...params, ...filterParams}

        const response = await doGet('survey',params)

        setDataSurvey(response.data.data)
        setPage(response.data.current_page)
        setTotalRows(response.data.total)


    }

    const getSurveyDetail = (surveyId) =>{
        props.getOneSurvey(surveyId);
        history.push("/app/survey/edit");
    }

    const toggleActive = async (srvId) => {
        await doPatch('survey/toggle/'+srvId,{});
        filter()
    };


    const filter = async () => {
        const params = {

        };
        setFilterParams(params)
        getDataSurvey(page,params)
    };



    const { classes } = props;

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
                                Master Survey
                            </Typography>
                        </Grid>

                        <Grid item xs={2} align="right">
                            <Fab
                                onClick={() =>
                                    history.push("/app/survey/create")
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
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            {
                                expandFilter &&
                                <>
                                    <Grid item xs={4}>
                                    </Grid>
                                    <Grid item xs={4}>
                                    </Grid>
                                    <Grid item xs={4}>
                                    </Grid>
                                </>
                            }

                        </Grid>
                        <Grid item xs={1}>

                        </Grid>

                        <Grid item xs={2} container justify="flex-end" alignItems='baseline'>
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
                                                Title
                                            </TableCell>
                                            <TableCell align="center">
                                                Description
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={classes.widthDate}
                                            >
                                                Status
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                className={classes.widthAction}
                                            >
                                                Action
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataSurvey.map(row => {
                                            const done =
                                                row.done === true ? (
                                                    <DoneIcon color="primary" />
                                                ) : (
                                                    ""
                                                );
                                            return (
                                                <TableRow key={row.id}>
                                                    <TableCell align="left">
                                                        {row.judul}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.description}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Switch
                                                            checked={
                                                                row.active ===
                                                                "1"
                                                            }
                                                            color="primary"
                                                            onChange={() =>
                                                                toggleActive(
                                                                    row.id
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            onClick={() =>
                                                                getSurveyDetail(
                                                                    row.id
                                                                )
                                                            }
                                                            size="small"
                                                            color="primary"
                                                            aria-label="Detail"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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
        getOneSurvey: surveyId => dispatch(getOneSurvey(surveyId)),
        toggleActiveSurvey: srvId => dispatch(toggleActiveSurvey(srvId)),
        clearSurvey: () => dispatch(clearSurvey())
    };
};

const Survey = connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);

export default withStyles(styles)(Survey);
