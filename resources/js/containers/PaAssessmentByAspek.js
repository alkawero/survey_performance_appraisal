import React, { useState, useEffect } from "react";
import { doGet } from "../services/api-service";
import { connect } from "react-redux";
import history from "../history.js";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
import DoneIcon from "@material-ui/icons/Done";
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


const PaAssessmentByAspekComponent = (props) => {

    const { classes } = props;

    const [dataTable, setDataTable] = useState([])

    useEffect(() => {
       getData()
    }, [])

    const getData = async () =>{
        const params={leader_id:props.user.emp_id, aspek_id:props.assessment.aspek_for_assessment.id}
        const response = await doGet('pa/assessment/aspek',params)
        setDataTable(response.data)
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
                    <Grid item xs={10} spacing={8} container alignItems="center">
                        <Grid item>
                            <IconButton color="primary" aria-label="back" component="span" onClick={()=>{history.push('/app/aspek')}}>
                                <KeyboardBackspace />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="h6"
                                gutterBottom
                                className="animated slideInLeft"
                            >
                                {`aspek [${props.assessment.aspek_for_assessment.code}] ${props.assessment.aspek_for_assessment.name} assignments`}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={2} align="right">
                        <Fab
                            onClick={() =>
                                history.push("/app/aspek/kabag/create")
                            }
                            size="small"
                            color="secondary"
                            aria-label="Add"
                            className={classes.fab}
                        >
                            <AddIcon />
                        </Fab>
                    </Grid>


                    <Grid item xs={12} className={classes.tableWrapper}>
                        <div className={classes.table}>
                        <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Total Staff
                                        </TableCell>
                                        <TableCell align="center">
                                            employees
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 && dataTable.map(
                                        row => (
                                            <TableRow key={row.id}>
                                                 <TableCell align="center">
                                                    {row.total_participant}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                    row.employee_names.toString()
                                                    }
                                                </TableCell>
                                            </TableRow>

                                        )
                                    )
                                    }


                                </TableBody>
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
        user: state.user.user,
        assessment:state.assessment
    };
};

const PaAssessmentByAspek  = connect(mapStateToProps)(PaAssessmentByAspekComponent);
export default withStyles(styles)(PaAssessmentByAspek);
