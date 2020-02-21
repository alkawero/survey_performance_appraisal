import React, { useState, useEffect } from "react";
import { doGet } from "../services/api-service";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import history from "../history.js";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
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

const PaMasterComponent = props => {
    const { classes } = props;

    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const params = {};
        const response = await doGet("pa/master", params);
        setDataTable(response.data);
    };

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
                            PA Master
                        </Typography>
                    </Grid>

                    <Grid item xs={2} align="right">
                        <Fab
                            onClick={() => history.push("/app/pa/create")}
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
                                            Name
                                        </TableCell>
                                        <TableCell align="center">
                                            Periode
                                        </TableCell>
                                        <TableCell align="center">
                                            Semester
                                        </TableCell>
                                        <TableCell align="center">
                                            aspek codes
                                        </TableCell>
                                        <TableCell align="center">
                                            Creator
                                        </TableCell>
                                        <TableCell align="center">
                                            Status
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.length > 0 &&
                                        dataTable.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.periode}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.semester}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.aspek_codes}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.created_by_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.status_value}
                                                </TableCell>
                                            </TableRow>
                                        ))}
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

export default withStyles(styles)(PaMasterComponent);
