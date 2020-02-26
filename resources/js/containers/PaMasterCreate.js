import React, { useState, useEffect } from "react";
import { doGet, doPost } from "../services/api-service";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";


const PaMasterCreateComponent = props => {

    const [status, setStatus] = useState(true);
    const [withCustomAspek, setWithCustomAspek] = useState(false)
    const [name, setName] = useState("");
    const [aspeks, setAspeks] = useState([]);
    const [dataAspek, setDataAspek] = useState([]);
    const [bobotAspek, setBobotAspek] = useState([]);
    const [dataSubAspek, setDataSubAspek] = useState([]);
    const [bobotSubAspek, setBobotSubAspek] = useState([]);
    const [dataUnsur, setDataUnsur] = useState([]);
    const [bobotUnsur, setBobotUnsur] = useState([]);
    const [bobotAtasan, setBobotAtasan] = useState(0);
    const [bobotBawahan, setBobotBawahan] = useState(0);
    const [error, setError] = useState("");

    const { classes } = props;

    useEffect(() => {
        getDataAspek();
    }, []);

    useEffect(() => {
        if (aspeks.length > 0) {
            const bobots = aspeks.map(aspek => ({
                aspek_id: aspek.value,
                bobot: 0
            }));
            setBobotAspek(bobots);
            getDataSubAspek(aspeks.map(aspek => aspek.value));
        } else {
            setBobotAspek([]);
        }
    }, [aspeks.length]);

    const getDataAspek = async () => {
        const params = {is_custom:0};
        const response = await doGet("pa/aspek", params);
        if (response.data.length > 0) {
            const dataForSelect = response.data.map(aspek => ({
                ...aspek,
                value: aspek.id,
                label: `${aspek.code} - ${aspek.name} (${aspek.note})`
            }));
            setDataAspek(dataForSelect);
        }
    };

    const getDataSubAspek = async aspek_ids => {
        const params = { aspek_ids: aspek_ids };
        const response = await doGet("pa/subaspek", params);
        if (response.data.length > 0) {
            const dataSubAspek = response.data.map(row => ({
                aspek_id: row.aspek_id,
                id: row.id,
                name: row.name,
                code: row.code
            }));
            const bobotSubAspeks = dataSubAspek.map(subAspek => ({
                aspek_id: subAspek.aspek_id,
                sub_aspek_id: subAspek.id,
                bobot: 0
            }));
            setDataSubAspek(dataSubAspek);
            setBobotSubAspek(bobotSubAspeks);
            getDataUnsur(dataSubAspek.map(subaspek => subaspek.id));
        }
    };

    const getDataUnsur = async sub_aspek_ids => {
        const params = { sub_aspek_ids: sub_aspek_ids };
        const response = await doGet("pa/unsur", params);
        if (response.data.length > 0) {
            const dataUnsur = response.data.map(row => ({
                sub_aspek_id: row.sub_aspek_id,
                id: row.id,
                name: row.name,
                code: row.code
            }));
            setDataUnsur(dataUnsur);

            const bobotUnsurs = dataUnsur.map(unsur => ({
                sub_aspek_id: unsur.sub_aspek_id,
                unsur_id: unsur.id,
                bobot: 0
            }));
            setBobotUnsur(bobotUnsurs);
        }
    };

    const clear = () => {
        setStatus(true);
    };



    const cancel = () => {
        history.back();
    };



    const bobotAtasanChange = e => {
        setBobotAtasan(e.target.value);
        setBobotBawahan(100 - e.target.value);
    };

    const bobotBawahanChange = e => {
        setBobotBawahan(e.target.value);
        setBobotAtasan(100 - e.target.value);
    };

    const statusChange = e => {
        setStatus(!status);
    };

    const withCustomAspekChange = e => {
        setWithCustomAspek(!withCustomAspek);
    };

    const nameChange = e => {
        setName(e.target.value);
    };

    const aspeksChange = e => {
        setAspeks(e);
    };



    const bobotUnsurChange = (unsur_id, e) => {
        const newValue = parseInt(e.target.value);
        let currentOldBobot = bobotUnsur.filter(
            bobot => bobot.unsur_id === unsur_id
        )[0];
        const newBobot = { ...currentOldBobot, bobot: newValue };
        let otherOldBobots = bobotUnsur.filter(
            bobot => bobot.unsur_id !== unsur_id
        );
        const newBobotUnsurs = [...otherOldBobots, newBobot];
        setBobotUnsur(newBobotUnsurs);

        const allBobotUnsurInSubAspek = newBobotUnsurs.filter(
            bobot => bobot.sub_aspek_id === currentOldBobot.sub_aspek_id
        );

        const sumAllBobotUnsurInSubAspek = allBobotUnsurInSubAspek.reduce(
            (acc, current) => acc + current.bobot,
            0
        );

        let currentOldBobotSubAspek = bobotSubAspek.filter(
            bs => bs.sub_aspek_id === currentOldBobot.sub_aspek_id
        )[0];

        const newBobotSubAspek = {
            ...currentOldBobotSubAspek,
            bobot: sumAllBobotUnsurInSubAspek
        };

        let otherOldBobotSubAspeks = bobotSubAspek.filter(
            bs => bs.sub_aspek_id !== currentOldBobot.sub_aspek_id
        );

        const newBobotSubAspeks = [...otherOldBobotSubAspeks, newBobotSubAspek];
        setBobotSubAspek(newBobotSubAspeks);

        const allBobotSubAspekInAspek = newBobotSubAspeks.filter(
            bs => bs.aspek_id === currentOldBobotSubAspek.aspek_id
        );

        const sumAllBobotSubAspekInAspek = allBobotSubAspekInAspek.reduce(
            (acc, current) => acc + current.bobot,
            0
        );

        let currentOldBobotAspek = bobotAspek.filter(
            ba => ba.aspek_id === currentOldBobotSubAspek.aspek_id
        )[0];

        const newBobotAspek = {
            ...currentOldBobotAspek,
            bobot: sumAllBobotSubAspekInAspek
        };

        let otherOldBobotAspeks = bobotAspek.filter(
            ba => ba.aspek_id !== currentOldBobotSubAspek.aspek_id
        );

        const newBobotAspeks = [...otherOldBobotAspeks, newBobotAspek];
        setBobotAspek(newBobotAspeks);
    };

    const submit = async() => {
        let inputValid = true;
        setError("");

        if(name.trim().length<1){
            setError("Please fill the name field");
            inputValid = false; return
        }



        if(bobotAtasan==0 || bobotBawahan==0){
            setError("Please specify bobot for leader or staff ");
            inputValid = false; return
        }


        const totalBobot = bobotAspek.reduce(
            (acc, current) => acc + current.bobot,
            0
        );

        if(totalBobot>100 || totalBobot == 0){
            inputValid = false;
            setError("Minimum total bobot is 1 and maximum is 100");
            return
        }else{
            if(!withCustomAspek && totalBobot!==100){
                inputValid = false;
                setError("If you only use fixed aspek, total bobot must be equal to 100");
                return
            }
            if(withCustomAspek && totalBobot===100){
                inputValid = false;
                setError("If this master need customized aspek, total bobot must be less than 100");
                return
            }
        }

        if(inputValid){
            await create();
            clear();
            if(withCustomAspek){
                props.history.push('/app/aspek/create')
            }else{
                history.back();
            }

        }

    };

    const create = async () => {
        if (aspeks.length > 0) {
            const params = {
                aspek_ids: aspeks.map(a => a.value),
                bobot_atasan: bobotAtasan,
                bobot_bawahan: bobotBawahan,
                bobot_unsurs: bobotUnsur,
                name: name,
                status: status == true ? 1 : 0,
                creator: props.user.emp_id
            };
            await doPost("pa/master", params, "save pa master");
        }
    };

    const customAspekLabel = withCustomAspek===true?'Need customized aspek from Leader of departments' : 'Fixed aspeks only'

    return (
        <Grid container direction="column">
            <Grid item xs={8} container>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        className="animated slideInLeft"
                    >
                        Create New PA Master
                    </Typography>
                </Grid>

                <Grid container>
                    <TextField
                        id="Name"
                        label="Name"
                        value={name}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={nameChange}
                    />
                </Grid>




                <Grid container justify="space-between" className={classes.marginTops}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="bobotAtasan"
                            type="number"
                            margin="dense"
                            label="Leader bobot"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: "0",
                                max: "100",
                                step: "1"
                            }}
                            onChange={bobotAtasanChange}
                            value={bobotAtasan}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="bobotBawahan"
                            type="number"
                            margin="dense"
                            label="Staff bobot"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: "0",
                                max: "100",
                                step: "1"
                            }}
                            onChange={bobotBawahanChange}
                            value={bobotBawahan}
                        />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item>
                        <FormControlLabel
                        control={
                            <Switch
                                checked={status}
                                onChange={statusChange}
                                color="primary"
                                inputProps={{
                                    "aria-label": "primary checkbox"
                                }}
                            />
                        }
                        label={status ? "active" : "inactive"}
                        />
                    </Grid>

                        <Grid item>
                            <FormControlLabel
                            control={
                            <Switch
                                    checked={withCustomAspek}
                                    onChange={withCustomAspekChange}
                                    color="primary"
                                    />
                                    }
                                    label={customAspekLabel}
                                />
                        </Grid>
                </Grid>

                <Grid item xs={12} className={classes.marginTops}>
                    <Select
                        isMulti
                        value={aspeks}
                        options={dataAspek}
                        onChange={aspeksChange}
                        placeholder="Select Aspek"
                        styles={selectCustomZindex}
                    />
                </Grid>

                <Grid container className={classes.bobotContainer}>
                    {aspeks &&
                        aspeks.map(aspek => (
                            <Grid
                                key={aspek.id}
                                container
                                className={classes.aspek_container}
                            >
                                <Grid container className={classes.aspek_row}>
                                    <Grid item xs={1}>
                                        {aspek.code}
                                    </Grid>
                                    <Grid item xs={5}>
                                        {aspek.name}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        className={classes.aspek_score}
                                    >
                                        {bobotAspek.filter(bobot => bobot.aspek_id === aspek.id)[0] &&
                                        bobotAspek.filter(bobot =>bobot.aspek_id === aspek.id)[0].bobot}
                                        %
                                    </Grid>
                                </Grid>
                                {dataSubAspek
                                    .filter(s => s.aspek_id === aspek.id)
                                    .map(sub_aspek => (
                                        <Grid
                                            key={sub_aspek.id}
                                            container
                                            className={classes.sub_aspek}
                                        >
                                            <Grid
                                                container
                                                className={
                                                    classes.sub_aspek_row
                                                }
                                            >
                                                <Grid item xs={1}>
                                                    {sub_aspek.code}
                                                </Grid>
                                                <Grid item xs={5}>
                                                    {sub_aspek.name}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={
                                                        classes.sub_aspek_score
                                                    }
                                                >
                                                    {bobotSubAspek.filter(bobot =>bobot.sub_aspek_id === sub_aspek.id)[0] &&
                                                    bobotSubAspek.filter(bobot =>bobot.sub_aspek_id ===sub_aspek.id)[0].bobot}
                                                    %
                                                </Grid>
                                            </Grid>
                                            {dataUnsur
                                                .filter(u =>u.sub_aspek_id ===sub_aspek.id)
                                                .map(unsur => (
                                                    <Grid
                                                        key={unsur.id}
                                                        container
                                                        className={
                                                            classes.unsur
                                                        }
                                                    >
                                                        <Grid
                                                            container
                                                            className={
                                                                classes.unsur_row
                                                            }
                                                            alignItems="center"
                                                        >
                                                            <Grid item xs={1}>
                                                                {unsur.code}
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                {unsur.name}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                container
                                                                xs={4}
                                                                justify="flex-end"
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={5}
                                                                >
                                                                    <TextField
                                                                        id="outlined-number"
                                                                        type="number"
                                                                        margin="dense"
                                                                        InputLabelProps={{
                                                                            shrink: true
                                                                        }}
                                                                        inputProps={{
                                                                            min:
                                                                                "0",
                                                                            max:
                                                                                "100",
                                                                            step:
                                                                                "1"
                                                                        }}
                                                                        onChange={() =>bobotUnsurChange(unsur.id,event)}
                                                                        value={
                                                                            bobotUnsur.filter(bu =>bu.unsur_id ===unsur.id)[0] &&
                                                                            bobotUnsur.filter(bu =>bu.unsur_id ===unsur.id)[0].bobot
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                        </Grid>
                                    ))}
                            </Grid>
                        ))}
                </Grid>
                <Grid container justify="space-between">
                    <Grid item className={classes.error}>
                    {error}
                    </Grid>
                    <Grid item className={classes.totalBobot}>
                        Total bobot{" "}
                        {bobotAspek.reduce(
                            (acc, current) => acc + current.bobot,
                            0
                        )}{" "}
                        %
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                justify="flex-end"
                container
                className={classes.addAction}
                spacing={8}
            >
                <Grid item>
                    <Button variant="outlined" onClick={cancel}>
                        cancel
                    </Button>
                </Grid>

                <Grid item>
                    <Button
                        onClick={submit}
                        color="primary"
                        variant="contained"
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const PaMasterCreate = connect(mapStateToProps)(PaMasterCreateComponent);

const styles = theme => ({
    marginTops: {
        marginTop: 10
    },
    container: {
        marginTop: -16,
        marginLeft: 5
    },
    marginOver: {
        marginTop: -25
    },
    score: {
        maxWidth: 50
    },
    sub_aspek: {
        paddingLeft: 10
    },
    unsur: {
        paddingLeft: 10
    },
    aspek_container: {
        border: "1px solid #c4c4c4",
        borderRadius:4,
        margin:'5px 0 5px 0'
    },
    aspek_row: {
        padding: 5,
        backgroundColor: "#d2fce4",
        borderBottom: "1px solid #c4c4c4"

    },
    aspek_score: {
        display: "flex",
        justifyContent: "flex-end",
        fontWeight: "bold",
        fontSize: 17,
        color: "red"
    },
    sub_aspek_row: {
        padding: 5,
        backgroundColor: "#7fcbfb",
        borderLeft: "1px solid #c4c4c4",
        borderBottom: "1px solid #c4c4c4"

    },
    sub_aspek_score: {
        display: "flex",
        justifyContent: "flex-end",
        fontWeight: "bold",
        fontSize: 13,
        color: "#000000"
    },
    unsur_row: {
        padding: 5,
        borderLeft: "1px solid #c4c4c4",
        borderBottom: "1px solid #c4c4c4"
    },
    unsur_score: {
        color: "white",
        display: "flex",
        justifyContent: "center"
    },
    unsur_score_value: {
        backgroundColor: "#b207e6",
        color: "white",
        display: "flex",
        justifyContent: "center",
        padding: 5
    },
    unsur_select: {
        backgroundColor: "#b207e6",
        color: "white",
        width: "100%",
        height: "100%",
        fontWeight: "bold"
    },
    bobotContainer: {
        marginTop: 20
    },
    totalBobot: {
        fontWeight: "bold",
        color: "red"
    },
    error:{
        color: "red"
    }
});

export const selectCustomZindex = {
    control: (base, state) => ({
        ...base,
        minWidth: "150px",
        margin: "0 4px"
    }),
    container: (base, state) => {
        return {
            ...base,
            flex: 1,
            zIndex: state.isFocused ? "1100" : "1" //Only when current state focused
        };
    }
};

export default withStyles(styles)(PaMasterCreate);
