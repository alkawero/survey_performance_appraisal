import React, { Component } from "react";
import { connect } from "react-redux";
import {
    clearSurvey,
    toggleActiveSurvey,
    getOneSurvey,
    getSurveys
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
import SendIcon from "@material-ui/icons/Send";
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
import Switch from "@material-ui/core/Switch";
import Select from "react-select";
//import {  } from './../actions/index';
import concat from "lodash/concat";

const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" }
];

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

class SurveyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalDelete: false,
            filterOpen: false
        };
    }

    componentDidMount() {
        this.props.getSurveys();
    }

    componentWillUnmount() {
        this.props.clearSurvey();
    }

    toggleFIlter = () => {
        this.setState({ filterOpen: !this.state.filterOpen });
    };

    handleClose() {
        this.setState({ modalDelete: false });
    }

    handleDelete() {
        this.setState({ modalDelete: false });
    }

    getSurveyDetail(surveyId) {
        this.props.getOneSurvey(surveyId);
        history.push("/app/survey/edit");
    }

    toggleActive = srvId => {
        this.props.toggleActiveSurvey(srvId);
    };

    render() {
        let dataSurvey = [];

        //digabung Survey dan assesment
        if (this.props.surveyPaginate.data)
            dataSurvey = concat(dataSurvey, this.props.surveyPaginate.data);

        const { classes } = this.props;
        const renderFilter = (
            <Grid container justify="flex-end" spacing={16}>
                <Grid item xs={2}>
                    <Select
                        options={options}
                        className={classes.selectFilter}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Select
                        options={options}
                        className={classes.selectFilter}
                    />
                </Grid>

                <Grid item xs={2}>
                    <Select
                        options={options}
                        className={classes.selectFilter}
                    />
                </Grid>

                <Grid item xs={1}>
                    <IconButton
                        onClick={() => this.toggleFIlter()}
                        color="primary"
                        aria-label="Go"
                        size="small"
                    >
                        <SendIcon />
                    </IconButton>
                </Grid>
            </Grid>
        );

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

                        {this.state.filterOpen == true && renderFilter}

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
                                                                this.toggleActive(
                                                                    row.id
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            onClick={() =>
                                                                this.getSurveyDetail(
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
                                </Table>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <Dialog
                    open={this.state.modalDelete}
                    onClose={() => this.handleClose}
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
                            onClick={() => this.handleDelete()}
                            color="secondary"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => this.handleClose()}
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
}

const mapStateToProps = state => {
    return {
        surveyPaginate: state.survey.surveyPaginate,
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSurveys: () => dispatch(getSurveys()),
        getOneSurvey: surveyId => dispatch(getOneSurvey(surveyId)),
        toggleActiveSurvey: srvId => dispatch(toggleActiveSurvey(srvId)),
        clearSurvey: () => dispatch(clearSurvey())
    };
};

const Survey = connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);

export default withStyles(styles)(Survey);
