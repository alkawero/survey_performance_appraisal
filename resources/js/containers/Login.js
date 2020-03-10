import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from 'yup';


import {login,toggleSnackBar} from '../actions'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button  from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import  Typography  from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackBarContent from '../components/MySnackBarContent';


const loginSchema = Yup.object().shape({
    username: Yup.string()
     .required( 'Please enter your username' ),
    password: Yup.string()
     .required('Please enter your password'),
   });

class LoginComponent extends Component{

    state = {
        userName:'',
        password:''
    }

    handleChange = name => event => {

        this.setState({ ...this.state, [name]: event.target.value });
      };

    login  = (data) => {
        this.props.login(data)
    }

    render(){
        const notProd = process.env.MIX_APP_ENV !=='PROD'
        const {classes} = this.props
        const error = this.props.error_login ? this.props.error_login:''

        const imageSrc = process.env.MIX_APP_ENV=='DEV' || process.env.MIX_APP_ENV=='PROD' ? process.env.MIX_APP_URL_DEV+'/images/logo.png':process.env.MIX_APP_URL_LOCAL+'/images/logo.png'


        if( ['adm'].includes(this.props.loggedUser.role))
        return <Redirect to="/app/dashboard" />
        else if(['usr','ldr'].includes(this.props.loggedUser.role))
        return <Redirect to="/app/survey/implementation" />
        else
        return(
                <React.Fragment>
                <Grid container direction='column'justify='center' alignItems ='center' className={classes.container}>

                <img src={imageSrc} />
                <Typography variant="h2" gutterBottom className={classes.tittle}>
                    pahoa survey system
                </Typography>
                {notProd && process.env.MIX_APP_ENV+' ENVIRONMENT'}

                <Formik
                initialValues={{ username: '', password:''}}
                onSubmit={(values)=>this.login(values)}
                validationSchema={loginSchema}
                render={ props =>
                    {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            handleSubmit
                        } = props;
                    return(
                    <Paper className={classes.paper} elevation={24}>
                    <Grid  container direction='column'>

                        <TextField
                            id="username"
                            label="Username"
                            className={classes.textField}
                            value={values.username}
                            onChange={handleChange}
                            margin="normal"
                            error={errors.username && touched.username}
                            helperText={(errors.username && touched.username) && errors.username}

                        />

                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            className={classes.textField}
                            value={values.password}
                            onChange={handleChange}
                            margin="normal"
                            error={errors.password && touched.password}
                            helperText={(errors.password && touched.password) && errors.password}

                        />


                        <Button onClick = {handleSubmit} variant="contained" color="primary" className={classes.button}>
                            Login
                        </Button>
                        <Grid container justify='center' style={{marginTop:10}}>
                            <span style={{color:'red'}}>{error}</span>
                        </Grid>
                        </Grid>
                    </Paper>
                    )}
                }
                />
                </Grid>

            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
                }}
                open={this.props.show_snack}
                autoHideDuration={6000}
                onClose={()=>this.props.toggleSnackBar({show:false,variant:this.props.snack_variant, message:this.props.snack_message})}
            >
                <MySnackBarContent
                    onClose={()=>this.props.toggleSnackBar({show:false,variant:this.props.snack_variant, message:this.props.snack_message})}
                    variant={this.props.snack_variant}
                    message={this.props.snack_message}/>
            </Snackbar>
        </React.Fragment>





        )
        }



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

const mapStateToProps = state => {
    return {
        loggedUser : state.user.user,
        error_login: state.ui.error_login,
        show_snack : state.ui.show_snack,
        snack_message : state.ui.snack_message,
        snack_variant : state.ui.snack_variant,

     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        login : loginData => dispatch(login(loginData)),
        toggleSnackBar: data =>dispatch(toggleSnackBar(data)),
            };
  }

const Login = connect(mapStateToProps,mapDispatchToProps)(LoginComponent);

export default withStyles(styles)(Login);
