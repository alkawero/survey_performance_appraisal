import React, {useState,useEffect} from 'react'
import { doGet,doPatch } from "../services/api-service";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from 'react-select';

import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Switch  from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import TextField from "@material-ui/core/TextField";
import format from 'date-fns/format'




const styles = theme =>({
    container: {
        marginTop: -16,
        marginLeft: 5
    },
    marginTops:{
        marginTop:10
    },
    selectDept:{
        paddingTop:25
    }
})

const SystemSettingComponent = (props) =>{

    const [processing, setProcessing] = useState(false)
    const [isSystemMaintenance, setIsSystemMaintenance] = useState(false)
    const [periode, setPeriode] = useState("");
    const [semester, setSemester] = useState("");
    const [appraisalStartDate, setAppraisalStartDate] = useState(new Date())
    const [appraisalEndDate, setAppraisalEndDate] = useState(new Date())
    const [appraisalAbsenStartDate, setAppraisalAbsenStartDate] = useState(new Date())
    const [appraisalAbsenEndDate, setAppraisalAbsenEndDate] = useState(new Date())
    const semesterOptions = [
        { value: 1, label: "Semester 1" },
        { value: 2, label: "Semester 2" }
    ];

    useEffect(() => {
        getDataSetting()
    }, [])



    const getDataSetting = async () =>{
        const params={}
        const response = await doGet('pa/setting',params)
        if(response.data.length>0){
            response.data.forEach(element => {
                switch (element.indicator) {
                    case "periode_active":
                        setPeriode(element.value)
                        break;
                    case "semester_active":
                        setSemester({value:parseInt(element.value), label : "semester "+element.value})
                        break;
                    case "system_maintenance":
                        setIsSystemMaintenance(element.value==="1")
                        break;
                    case "appraisal_start_date":
                        setAppraisalStartDate(new Date(element.value))
                        break;
                    case "appraisal_end_date":
                        setAppraisalEndDate(new Date(element.value))
                        break;
                    case "appraisal_absen_start_date":
                        setAppraisalAbsenStartDate(new Date(element.value))
                        break;
                    case "appraisal_absen_end_date":
                        setAppraisalAbsenEndDate(new Date(element.value))
                        break;


                    default:
                        break;
                }
            });
        }
    }

    const periodeChange = e => {
        setPeriode(e.target.value);
    };

    const semesterChange = e => {
        setSemester(e);
    };

    const handleAppraisalStartDateChange = date => {
        setAppraisalStartDate(date)
    }

    const handleAppraisalEndDateChange = date => {
        setAppraisalEndDate(date)
    }

    const handleAppraisalAbsenStartChange = date => {
        setAppraisalAbsenStartDate(date)
    }

    const handleAppraisalAbsenEndChange = date => {
        setAppraisalAbsenEndDate(date)
    }

    const isSystemMaintenanceChange = e => {
        setIsSystemMaintenance(!isSystemMaintenance);
    };

    const apply = async() => {
        setProcessing(true)
        const params = {
            settings :    [
                {indicator:'system_maintenance', value : isSystemMaintenance},
                {indicator:'periode_active', value : periode},
                {indicator:'semester_active', value :  semester.value},
                {indicator:'appraisal_end_date', value : format(appraisalEndDate, "yyyy-MM-dd")},
                {indicator:'appraisal_start_date', value  : format(appraisalStartDate, "yyyy-MM-dd")},
                {indicator:'appraisal_absen_end_date', value : format(appraisalAbsenEndDate, "yyyy-MM-dd")},
                {indicator:'appraisal_absen_start_date', value  : format(appraisalAbsenStartDate, "yyyy-MM-dd")}
            ],
            updated_by: props.user.emp_id
        }
        await doPatch('pa/setting',params,'update setting data')
        setProcessing(false)
    };


      const {classes} = props;
      const isSystemMaintenanceLabel = 'system maintenance'

    return (
        <React.Fragment>
            <Grid container className={classes.container} >
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom
                    className='animated slideInLeft'>
                        New Assessment
                    </Typography>
                </Grid>

                <Grid container>
                    <TextField
                        id="Periode"
                        label="Periode"
                        value={periode}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={periodeChange}
                    />
                </Grid>
                <Grid item xs={12} className={classes.marginTops}>
                    <Select
                        value={semester}
                        options={semesterOptions}
                        onChange={semesterChange}
                        placeholder="Select Semester"
                        styles={selectCustomZindex}
                    />
                </Grid>

                <MuiPickersUtilsProvider    utils={DateFnsUtils}>
                    <Grid container spacing={16}>

                    <Grid item>
                        <DatePicker
                            format="dd MMMM yyyy"
                            margin="normal"
                            label="Appraisal Start"
                            value={appraisalStartDate}
                            onChange={handleAppraisalStartDateChange}
                        />
                    </Grid>

                    <Grid item>
                        <DatePicker
                            format="dd MMMM yyyy"
                            margin="normal"
                            label="Appraisal End"
                            value={appraisalEndDate}
                            onChange={handleAppraisalEndDateChange}
                        />
                    </Grid>


                    </Grid>
                </MuiPickersUtilsProvider>

                <MuiPickersUtilsProvider    utils={DateFnsUtils}>
                    <Grid container spacing={16}>

                    <Grid item>
                        <DatePicker
                            format="dd MMMM yyyy"
                            margin="normal"
                            label="Get Appraisal Absen From"
                            value={appraisalAbsenStartDate}
                            onChange={handleAppraisalAbsenStartChange}
                        />
                    </Grid>

                    <Grid item>
                        <DatePicker
                            format="dd MMMM yyyy"
                            margin="normal"
                            label="Get Appraisal Absen Until"
                            value={appraisalAbsenEndDate}
                            onChange={handleAppraisalAbsenEndChange}
                        />
                    </Grid>


                    </Grid>
                </MuiPickersUtilsProvider>

                <Grid item>
                    <FormControlLabel
                    control={
                    <Switch
                            checked={isSystemMaintenance}
                            onChange={isSystemMaintenanceChange}
                            color="primary"
                            />
                            }
                            label={isSystemMaintenanceLabel}
                        />
                </Grid>

                <Grid spacing={8} container justify='flex-end' className={classes.marginTops}>
                        <Grid item>
                            <Button disabled={processing} onClick={apply} variant="contained" size="small" color="primary" >
                                Apply
                            </Button>
                        </Grid>
                </Grid>

            </Grid>
        </React.Fragment>
    )

}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};



const SystemSetting = connect(mapStateToProps)(SystemSettingComponent);

export default withStyles(styles)(SystemSetting);

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
