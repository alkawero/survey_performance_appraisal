import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import  Typography  from '@material-ui/core/Typography';



const Maintenance = (props) => {

    const {classes} = props
    const imageSrc = process.env.MIX_APP_ENV=='DEV' || process.env.MIX_APP_ENV=='PROD' ? process.env.MIX_APP_URL_DEV+'/images/logo.png':process.env.MIX_APP_URL_LOCAL+'/images/logo.png'
    return (
        <Grid container direction='column'justify='center' alignItems ='center' className={classes.container}>

        <img src={imageSrc} />
        <Typography variant="h2" gutterBottom className={classes.tittle}>
            pahoa survey system is under maintenance
        </Typography>

        </Grid>
    )

}

const styles = theme =>({
    container: {
        minHeight: '100vh',
        background:'linear-gradient(180deg, #005aa7 10%,#fffde4 100% );',

    },
    paper:{
        padding:20,
        width:400,
        background:'linear-gradient(180deg, #005aa7 0%,#fffde4 10% );',
    },
    tittle:{
        color:'#ffffff',
        fontSize:48,
        marginTop:20
    },

})

export default withStyles(styles)(Maintenance);
