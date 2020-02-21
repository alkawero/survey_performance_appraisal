import React, { useState, useEffect } from "react";
import { doDownloadPdf, doPut } from "../services/api-service";

import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import IconButton from '@material-ui/core/IconButton';
import Print from "@material-ui/icons/Print";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
import TextField from "@material-ui/core/TextField";

const PaDetailAssessmentComponent = props => {
    const [unsurScores, setUnsurScores] = useState([]);
    const [aspekScores, setAspekScores] = useState([]);
    const [subAspekScores, setSubAspekScores] = useState([]);
    const [grandTotal, setgrandTotal] = useState(0);
    const [category, setCategory] = useState("A");
    const [approvalDone, setApprovalDone] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        if(props.assessment){
            const unsurScoreTemp = props.assessment.unsurs.map(unsur=>({...unsur, unsur_id:unsur.id,sub_aspek_id:unsur.sub_aspek_id}))
            const aspekScoreTemp = props.assessment.aspeks.map(aspek=>({...aspek, aspek_id:aspek.id}))
            const subAspekScoreTemp = props.assessment.sub_aspeks.map(subAspek=>({...subAspek, sub_aspek_id:subAspek.id, aspek_id:subAspek.aspek_id}))
            setUnsurScores(unsurScoreTemp)
            setAspekScores(aspekScoreTemp)
            setSubAspekScores(subAspekScoreTemp)
            setgrandTotal(props.assessment.total_score)
            setOpenEdit(!props.assessment.fill_by_staff)

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


    const openingEdit = async () => {
        setOpenEdit(!openEdit)
        const params={
            assessment_user_id:props.assessment.id,
            fill_by_staff : (!openEdit === true) ? 0:1
        }
        await doPut('pa/assessment/edit/staff',params);

    };

    const exportPdf = async () => {
        const params={assessment_user_id:props.assessment.id}
        doDownloadPdf('pa/assessment/export/pdf',params);
    };


    const approval = async (number) => {
        setApprovalDone(true)
        const params={
            assessment_user_id:props.assessment.id,
            approval:number,

        }
        await doPut('pa/assessment/approval/staff',params);
        history.back();
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

    const ApprovalButton = ({user, owner, status, action, disabled}) =>{


        if(status === 1){
            return (
                <h2 >approved by staff</h2>
            )
        }

        if(status === 2){
            return (
                <h2 >rejected by staff</h2>
            )
        }

        if(user !== owner){
            return null
        }


        return (
            <Grid spacing={8} container justify="flex-end" className={classes.marginTops}>
                <Grid item xs={1} container justify="flex-end">
                    <Button disabled={disabled} variant="contained" color="secondary" onClick={()=>action(2)}>
                        disagree
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button disabled={disabled} variant="contained" color="primary" onClick={()=>action(1)}>
                        Agree
                    </Button>
                </Grid>

            </Grid>
        )
    }

    if(props.assessment){
        return (
            <React.Fragment>
                <Grid container className={classes.container}>
                    <Grid item xs={12} spacing={8} container>
                        <Grid item xs={1} container alignContent="center">
                            <IconButton color="primary" aria-label="back" component="span" onClick={() => history.back()}>
                                <KeyboardBackspace />
                            </IconButton>
                        </Grid>
                        <Grid item xs={7} container alignContent="center">
                            <Typography
                                variant="h6"
                                gutterBottom
                                className="animated slideInLeft"
                            >
                                {`Assessment Detail for ${props.assessment.participant_name}` }
                            </Typography>
                        </Grid>
                        <Grid item xs={3} container>
                            {props.assessment.atasan_id === props.user.emp_id &&
                                <Button size="small" color="primary" onClick={openingEdit}>
                                    {
                                    openEdit &&   "close editing access for staff" || "open editing access for staff"
                                    }
                                </Button>
                            }
                        </Grid>
                        <Grid item xs={1} container justify="flex-end" alignContent="center">
                                <IconButton onClick={exportPdf} color="primary" aria-label="search">
                                    <Print />
                                </IconButton>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} container direction="column">
                        <Grid container className={classes.table_header}>
                            <Grid item xs={5} container justify="center">Indicator</Grid>
                            <Grid item xs={2}>weight</Grid>
                            <Grid item xs={2} container justify="center">Leader Score {props.assessment.bobot_atasan} %</Grid>
                            <Grid item xs={2} container justify="flex-end">Staff Score {props.assessment.bobot_bawahan} %</Grid>
                            <Grid item xs={1} container justify="flex-end">Total Score</Grid>
                        </Grid>
                        <Grid container >
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
                                                                    <Grid item xs={4}>{unsur.name}</Grid>
                                                                    <Grid item xs={1}>{unsur.bobot}%</Grid>
                                                                    <Grid item container xs={6} justify="space-evenly">

                                                                        <Grid item xs={3} container spacing={8} justify="flex-end" alignItems="center" className={classes.unsur_score} >

                                                                            <Grid item>
                                                                                {
                                                                                    unsur.atasan_score
                                                                                }
                                                                            </Grid>

                                                                            <Grid item>
                                                                                <CategoryLabel role="atasan" unsur={unsur}/>
                                                                            </Grid>
                                                                            </Grid>


                                                                        <Grid item xs={3} container spacing={8} justify="flex-end" alignItems="center" className={classes.unsur_score} >

                                                                            <Grid item>
                                                                            {
                                                                                unsur.staff_score
                                                                            }
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <CategoryLabel role="staff" unsur={unsur}/>
                                                                            </Grid>



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

                        <Grid container justify="space-between" className={classes.grand_total}>
                            <Grid item xs={2}> Grand Total</Grid>
                            <Grid item xs={1} container justify="flex-end"> {grandTotal.toFixed(2)}</Grid>
                        </Grid>
                        <Grid container justify="space-between" className={classes.grand_total}>
                            <Grid item xs={2}> Kategori</Grid>
                            <Grid item xs={1} container justify="flex-end"> {category}</Grid>
                        </Grid>

                        <Grid container className={classes.note_container}>
                            <TextField
                            id="outlined-multiline-static"
                            label="Notes from leader"
                            multiline
                            rows="2"
                            defaultValue="Notes from leader"
                            variant="outlined"
                            fullWidth
                            value={props.assessment.note_atasan}
                            />
                        </Grid>

                        {props.assessment.fill_by_atasan===1 &&
                            <ApprovalButton
                            user={props.user.emp_id}
                            owner={props.assessment.participant_id}
                            status={props.assessment.approval_staff}
                            disabled={approvalDone}
                            action={approval}/>
                        }


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
    table_header:{
        backgroundColor:'#ffdb76',
        padding :10,

    },
    centeredCell:{
        display:'flex',
        alignContent:'center'
    },
    note_container:{
        marginTop:20
    }



});

const mapStateToProps = state => {
    return {
        user: state.user.user,
        assessment: state.assessment.assessment_detail
    };
};

const PaDetailAssessment = connect(mapStateToProps)(PaDetailAssessmentComponent);

export default withStyles(styles)(PaDetailAssessment);
