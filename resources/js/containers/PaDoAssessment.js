import React, { useState, useEffect } from "react";
import { doGet, doPost } from "../services/api-service";

import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Tooltip from "@material-ui/core/Tooltip";
import DebouncedTextField from "../components/DebouncedTextField"



const PaDoAssessmentComponent = props => {
    const arrayScore = [0,1,2,3,4];
    const maxScore = 4;
    const [unsurScores, setUnsurScores] = useState([]);
    const [aspekScores, setAspekScores] = useState([]);
    const [subAspekScores, setSubAspekScores] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [category, setCategory] = useState("A");
    const [noteAtasan, setNoteAtasan] = useState("");

    useEffect(() => {
        if(props.assessment){
            const unsurScoreTemp = props.assessment.unsurs.map(unsur=>({...unsur, unsur_id:unsur.id,sub_aspek_id:unsur.sub_aspek_id}))
            const aspekScoreTemp = props.assessment.aspeks.map(aspek=>({...aspek, aspek_id:aspek.id}))
            const subAspekScoreTemp = props.assessment.sub_aspeks.map(subAspek=>({...subAspek, sub_aspek_id:subAspek.id, aspek_id:subAspek.aspek_id}))
            setUnsurScores(unsurScoreTemp)
            setAspekScores(aspekScoreTemp)
            setSubAspekScores(subAspekScoreTemp)
            setGrandTotal(props.assessment.total_score)

            if(props.assessment.total_score > 3.5){
                setCategory("A")
            }else if(props.assessment.total_score > 3){
                setCategory("B")
            }else if(props.assessment.total_score > 2.5){
                setCategory("C")
            }else{
                setCategory("D")
            }
        }
    }, [props.assessment])


    const atasanUnsurChange = (unsur_id,e) => {
        let scoreValue = parseInt(e.target.value);
        if(scoreValue>maxScore){
            scoreValue = maxScore
        }

        const oldUnsurScore = unsurScores.filter(u=>u.unsur_id === unsur_id)[0]
        const otherOldUnsurScore = unsurScores.filter(u=>u.unsur_id !== unsur_id)

        const newScore = {...oldUnsurScore, atasan_score:scoreValue, atasanPercentScore:(scoreValue*oldUnsurScore.bobot/100)}
        const newUnsurScores = [...otherOldUnsurScore, newScore]
        const sorted = newUnsurScores.sort((a, b) => (a.id> b.id ) ? 1 : -1)
        setUnsurScores(sorted)

    };

    const staffUnsurChange = (unsur_id,e) => {
        let scoreValue = parseInt(e.target.value);
        if(scoreValue>maxScore){
            scoreValue = maxScore
        }
        const oldUnsurScore = unsurScores.filter(u=>u.unsur_id === unsur_id)[0]
        const otherOldUnsurScore = unsurScores.filter(u=>u.unsur_id !== unsur_id)

        const newScore = {...oldUnsurScore, staff_score:scoreValue, staffPercentScore:(scoreValue*oldUnsurScore.bobot/100)}
        const newUnsurScores = [...otherOldUnsurScore, newScore]
        const sorted = newUnsurScores.sort((a, b) => (a.id > b.id) ? 1 : -1)
        setUnsurScores(sorted)

    };


    useEffect(() => {

        const newSubAspekScores = subAspekScores.map(sub=>{
            let newScoreFromAtasan, newScoreFromStaff;

            const filteredUnsurScores = unsurScores.filter(staff=>(staff.sub_aspek_id===sub.sub_aspek_id))
            let optionalZero = null
            if(props.assessment.atasan_id==props.user.emp_id){//atasan
                optionalZero = filteredUnsurScores.find(unsur=>(unsur.is_optional===true && unsur.staff_score===0))
            }else{//staff
                optionalZero = filteredUnsurScores.find(unsur=>(unsur.is_optional===true && unsur.atasan_score===0))
            }

            if(optionalZero){
                newScoreFromAtasan = unsurScores.filter(atasan=>atasan.sub_aspek_id===sub.sub_aspek_id)
                .reduce((acc,current)=>acc+current.atasanPercentScore,0)

                newScoreFromStaff = unsurScores.filter(staff=>(staff.sub_aspek_id===sub.sub_aspek_id))
                .reduce((acc,current)=>acc+current.staffPercentScore,0)

            }else{
                newScoreFromAtasan = unsurScores.filter(atasan=>atasan.sub_aspek_id===sub.sub_aspek_id)
                .reduce((acc,current)=>acc+current.atasanPercentScore,0)

                newScoreFromStaff = unsurScores.filter(staff=>(staff.sub_aspek_id===sub.sub_aspek_id))
                .reduce((acc,current)=>acc+current.staffPercentScore,0)
            }

            return {...sub, score:(newScoreFromAtasan * props.assessment.bobot_atasan / 100)+(newScoreFromStaff * props.assessment.bobot_bawahan / 100)}
        })

        setSubAspekScores(newSubAspekScores)
    }, [unsurScores])


    useEffect(() => {
        const newAspekScores = aspekScores.map(aspek=>{
            const newScore = subAspekScores.filter(sub=>sub.aspek_id===aspek.aspek_id)
            .reduce((acc,current)=>acc+current.score,0)
            return {...aspek, score:newScore}
        })
        setAspekScores(newAspekScores)

    }, [subAspekScores])

    useEffect(() => {
        const sumAspekScore = aspekScores.reduce((acc,current)=>acc+current.score,0)
        setGrandTotal(sumAspekScore)
        if(sumAspekScore > 3.5){
            setCategory("A")
        }else if(sumAspekScore > 3){
            setCategory("B")
        }else if(sumAspekScore > 2.5){
            setCategory("C")
        }else{
            setCategory("D")
        }

    }, [aspekScores])


    const handleSubmit = async () => {
            create();
            history.back();
    };

    const noteChange = (value,optional) => {
        setNoteAtasan(value)
    };



    const create = async () => {
        const role = props.user.emp_id == props.assessment.atasan_id ? "atasan":"staff"


        const params = {
            assessment_users_id: props.assessment.id,
            score_by: role,
            aspekScores:aspekScores,
            subAspekScores:subAspekScores,
            unsurScores:unsurScores,
            total_score : grandTotal,
            note_atasan : noteAtasan

        };

        await doPost("pa/assessment/do", params, "save submit assessment score");
    };

    const { classes } = props;

    const CategoryLabel = ({role,unsur}) => {
        let label = ""
        let score = role==="atasan" ? unsur.atasan_score : unsur.staff_score
        switch (score){
            case 1 :
                label =  unsur.category_1_label
            break
            case 2 :
                label = unsur.category_2_label
            break
            case 3 :
                label = unsur.category_3_label
            break
            case 4 :
                label = unsur.category_4_label
            break
        }
        return <span>{label}</span>
    }


    if(props.assessment && props.user){

        return (

            <React.Fragment>
                <Grid container className={classes.container}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            className="animated slideInLeft"
                        >
                            {props.assessment.atasan_id==props.user.emp_id && `Assessment As Leader for ${props.assessment.participant_name}` || "Assessment sheet"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} container direction="column">
                        <Grid container>
                                {aspekScores.map(aspek => (
                                    <Grid container className={classes.aspek_container}>
                                        <Grid container className={classes.aspek_row}>
                                            <Grid item xs={1}>{aspek.code}</Grid>
                                            <Grid item xs={5}>{aspek.name}</Grid>
                                            <Grid item xs={6} className={classes.aspek_score}>
                                                {
                                                    aspek.score.toFixed(2)
                                                }
                                            </Grid>
                                        </Grid>
                                        {subAspekScores
                                            .filter(a => a.aspek_id === aspek.id)
                                            .map(sub_aspek => (
                                                <Grid container className={classes.sub_aspek}>
                                                    <Grid container className={classes.sub_aspek_row}>
                                                        <Grid item xs={1}>{sub_aspek.code}</Grid>
                                                        <Grid item xs={5}>{sub_aspek.name}</Grid>
                                                        <Grid item xs={6} className={classes.sub_aspek_score}>
                                                        {
                                                            sub_aspek.score.toFixed(2)
                                                        }
                                                        </Grid>
                                                    </Grid>
                                                    {unsurScores
                                                        .filter(u =>u.sub_aspek_id === sub_aspek.id)
                                                        .map(unsur => (
                                                            <Grid container className={classes.unsur}>
                                                                <Grid container className={classes.unsur_row}>
                                                                    <Grid item xs={1}>{unsur.code}</Grid>
                                                                    <Grid item xs={7}>
                                                                        {unsur.name}
                                                                        {unsur.is_optional &&
                                                                         <span className={classes.optional}>[optional]</span>
                                                                        }
                                                                        </Grid>
                                                                    <Grid item container xs={4} justify="space-evenly">
                                                                    {
                                                                    props.assessment.atasan_id==props.user.emp_id &&
                                                                        <Grid item container spacing={8} justify="flex-end" alignItems="center" className={classes.unsur_score} >
                                                                            <Grid item>
                                                                                <CategoryLabel role="atasan" unsur={unsur}/>
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <TextField
                                                                                type="number"
                                                                                margin="dense"
                                                                                InputLabelProps={{
                                                                                    shrink: true
                                                                                }}
                                                                                inputProps={{
                                                                                    min:
                                                                                        "0",
                                                                                    max:
                                                                                        "4",
                                                                                    step:
                                                                                        "1"
                                                                                }}
                                                                                onChange={(event)=>atasanUnsurChange(unsur.id,event)}
                                                                                value={
                                                                                    unsur.atasan_score
                                                                                }
                                                                                />
                                                                            </Grid>

                                                                            </Grid>

                                                                    }


                                                                    {
                                                                    props.assessment.participant_id==props.user.emp_id &&
                                                                        <Grid item container spacing={8} justify="flex-end" alignItems="center" className={classes.unsur_score} >

                                                                            <Grid item>
                                                                                <CategoryLabel role="staff" unsur={unsur}/>
                                                                            </Grid>

                                                                            <Grid item>
                                                                            <TextField
                                                                            type="number"
                                                                            margin="dense"
                                                                            InputLabelProps={{
                                                                                shrink: true
                                                                            }}
                                                                            inputProps={{
                                                                                min:
                                                                                    "0",
                                                                                max:
                                                                                    "4",
                                                                                step:
                                                                                    "1"
                                                                            }}
                                                                            onChange={(event)=>staffUnsurChange(unsur.id,event)}
                                                                            value={
                                                                                unsur.staff_score
                                                                            }
                                                                            />
                                                                            </Grid>

                                                                        </Grid>
                                                                    }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        ))}
                                                </Grid>
                                            ))}
                                    </Grid>
                                ))}
                        </Grid>

                        <Grid container justify="space-between" className={classes.grand_total}>
                            <Grid item xs={2}> Grand Total</Grid>
                            <Grid item xs={1} container justify="flex-end"> {grandTotal.toFixed(2)}</Grid>
                        </Grid>
                        <Grid container justify="space-between" className={classes.grand_total}>
                            <Grid item xs={2}> Kategori</Grid>
                            <Grid item xs={1} container justify="flex-end"> {category}</Grid>
                        </Grid>

                        { props.user.emp_id == props.assessment.atasan_id &&
                        <Grid container className={classes.note_container}>
                            <DebouncedTextField
                                id="note"
                                label="Note From Leader"
                                key_id_1 ="note"
                                value={noteAtasan}
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                onChange={noteChange}
                            />
                        </Grid>
                        }
                        <Grid
                            spacing={8}
                            container
                            justify="flex-end"
                            className={classes.marginTops}
                        >
                            <Grid item>
                                <Button onClick={() => history.back()} size="small">
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }else{
        return null
    }

};

const styles = theme => ({
    container: {
        marginTop: -16,
        marginLeft: 5
    },
    marginTops: {
        marginTop: 10
    },
    sub_aspek: {
        paddingLeft: 10
    },
    unsur: {
        paddingLeft: 10
    },
    aspek_container:{
        border: '1px solid #c4c4c4',
        borderRadius:4,
        margin:'5px 0 5px 0'
    },
    aspek_row:{
        padding:5,
        backgroundColor:'#d2fce4',
        borderBottom: '1px solid #c4c4c4',
        color:'red',
        fontWeight: 'bold',
    },
    aspek_score:{
        display:'flex',
        justifyContent:'flex-end',
        fontWeight: 'bold',
        fontSize:17,
        color:'red'
    },
    sub_aspek_row:{
        padding:5,
        backgroundColor:'#7fcbfb',
        borderLeft: '1px solid #c4c4c4',
        borderBottom: '1px solid #c4c4c4',

    },
    sub_aspek_score:{
        display:'flex',
        justifyContent:'flex-end',
        fontWeight: 'bold',
        fontSize:13,
        color:'#000000'
    },
    unsur_row:{
        padding:5,
        borderLeft: '1px solid #c4c4c4',
        borderBottom: '1px solid #c4c4c4',

    },
    unsur_score:{

    },

    grand_total:{
        backgroundColor:'#fdfbbd',
        color:'#be0609',
        fontWeight: 'bold',
        padding:'5px 10px 5px 10px',
        border: '1px solid #c4c4c4',
        borderRadius:4,
        margin:'5px 0 5px 0'
    },
    note_container:{
        marginTop:20
    },
    optional:{
        color: 'red',
        display:'inline-block'
    }


});

const mapStateToProps = state => {
    return {
        user: state.user.user,
        assessment: state.assessment.data_assessment
    };
};

const PaDoAssessment = connect(mapStateToProps)(PaDoAssessmentComponent);

export default withStyles(styles)(PaDoAssessment);
