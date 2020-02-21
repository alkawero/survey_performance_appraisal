import React,{Component} from 'react';
import { connect } from "react-redux";
import {getUserNotAnswering,toggleSnackBar,getUnits}  from '../actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import {XYPlot,XAxis,ChartLabel, YAxis,VerticalGridLines,HorizontalGridLines,VerticalBarSeries,LineSeries  } from 'react-vis';
import Paper from '@material-ui/core/Paper';
import List  from '@material-ui/core/List';
import ListItem  from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = theme =>({

    button_mini:{
        width: 30,
        height: 30,
        padding:0,

    },
    selectFilter:{
        marginTop:5
    },
    container:{
        margin: -16
    },
    widthAction:{
        minWidth:150
    },
    widthDate:{
        minWidth:150
    },

    paper4:{
        display:'flex',
        alignItems:'flex-start',
        paddingLeft:10,
        height:50,
        background:'linear-gradient(90deg, #ff758c 0%,#ff7eb3 100% )',
        color:'#FFFFFF'
    },
    paper3:{
        display:'flex',
        alignItems:'flex-start',
        paddingLeft:10,
        height:50,
        background:'linear-gradient(90deg, #f7971e 0%,#ffd200 100% )',
        color:'#FFFFFF'
    },
    paper2:{
        display:'flex',
        alignItems:'flex-start',
        paddingLeft:10,
        height:50,
        background:'linear-gradient(90deg, #18aa8a 0%,#38ef7d 100% )',
        color:'#FFFFFF'
    },
    paper1:{
        display:'flex',
        alignItems:'flex-start',
        paddingLeft:10,
        height:50,
        background:'linear-gradient(90deg, #4e54c8 0%,#8f94fb 100% )',
        color:'#FFFFFF'
    },
    counterNum:{
        fontSize:32,
        marginRight:50,
        marginLeft:'auto',
    },
    marginTop:{
        marginTop:25
    },
    deptList:{
        overflow: 'auto',
        maxHeight: 400,
    },
    cardHeader:{
        display:'flex',
        justifyContent:'center',
        background:'linear-gradient(90deg, #cb356b 0%,#bd3f32 100% );',
        color:'white'
    },
    dashboardCard:{
        border:'solid 1px RGB(204, 204, 204)',
        borderRadius : 5,   
        display:'inline-block',
         
    },
    list:{
        overflow: 'auto',
        maxHeight: 400,
    }


  })

class DashboardComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalDelete:false,
            filterOpen:false,
        }

    }

    componentDidMount(){
        this.props.getUnits()
        this.props.getUserNotAnswering()
    }

    toggleFIlter = ()=> {
        this.setState({filterOpen:!this.state.filterOpen})
    }

    handleClose(){
        this.setState({modalDelete:false})
    }

    handleDelete(){
        this.setState({modalDelete:false})
        this.props.toggleSnackBar(true)
    }

    handleFIlterGroup(){
    }

    render(){

        const {classes} = this.props;
        let units = []
        let incompleteUsers = []
        if(this.props.incompleteUsers){
            incompleteUsers = this.props.incompleteUsers
        }
        if(this.props.allUnits){
            units = this.props.allUnits
        }
        return (
        <React.Fragment>
        <Grid container spacing={24} direction='column' className={classes.container}>
            <Grid container direction='row' alignContent="flex-start">
                <Grid item  xs={10}>
                    <Typography variant="h6" gutterBottom>
                        Dashboard
                    </Typography>
                </Grid>

                <Grid item  xs={2} align="right">
                    <IconButton onClick={() => this.toggleFIlter()} size="small" color="primary" aria-label="Filter" className={classes.fab}>
                            <FilterIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Grid spacing={16} justify='space-around' container direction='row'>
                <Grid item xs={3}>
                <Paper className={classes.paper1}>
                    <span className={classes.counterName}>User</span>
                    <span className={classes.counterNum}>123</span>
                </Paper>
                </Grid>
                <Grid item xs={3}>
                <Paper className={classes.paper2}>
                <span className={classes.counterName}>Department</span>
                    <span className={classes.counterNum}>123</span>
                </Paper>
                </Grid>
                <Grid item xs={3}>
                <Paper className={classes.paper3}>
                    <span className={classes.counterName}>Survey</span>
                    <span className={classes.counterNum}>123</span>
                </Paper>
                </Grid>
                <Grid item xs={3}>
                <Paper className={classes.paper4}>
                    <span className={classes.counterName}>Question</span>
                    <span className={classes.counterNum}>123</span>
                </Paper>
                </Grid>
            </Grid>

            <Grid container direction='row' className={classes.marginTop} alignItems='flex-start'>
            
            <Grid item xs={6} className={classes.dashboardCard}>                
                <div className={classes.cardHeader}> 
                <Typography variant='h5'><span style={{color:'white'}}>{incompleteUsers.length} users not completing the surveys</span></Typography>
                </div>
                <List className={classes.list} component="nav" dense={true}>
                {incompleteUsers.map(user=>(
                    <ListItem key={user.emp_id} alignItems="flex-start" button onClick={()=>{}}>
                        <ListItemText
                        primary={user.emp_name}
                        />
                    </ListItem>
                ))
                }
                </List>
            </Grid>

            <Grid item container direction='column' xs={4} alignContent='center'>
                <Grid item>
                    <Typography variant="h6">Department Performance</Typography>
                </Grid>
                <Grid item>
                    <XYPlot width={300} height={300}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <XAxis />
                    <YAxis />
                    <ChartLabel
                        text="X Axis"
                        className="alt-x-label"
                        includeMargin={false}
                        xPercent={0.025}
                        yPercent={1.01}
                        />

                    <ChartLabel
                        text="Y Axis"
                        className="alt-y-label"
                        includeMargin={false}
                        xPercent={0.06}
                        yPercent={0.06}
                        style={{
                        transform: 'rotate(-90)',
                        textAnchor: 'end'
                        }}
                        />
                    <LineSeries
                        className="first-series"
                        data={[{x: 1, y: 3}, {x: 2, y: 5}, {x: 3, y: 15}, {x: 4, y: 12}]}
                    />
                    </XYPlot>
                </Grid>
            </Grid>

            <Grid item xs={2} className={classes.deptList}>
                <List className={classes.root} component="nav" dense={true}>
                {units.map(unit=>(
                    <ListItem key={unit.unit_id} alignItems="flex-start" button onClick={()=>{}}>
                        <ListItemText
                        primary={unit.unit_name}
                        />
                    </ListItem>
                ))
                }
                </List>
            </Grid>

            </Grid>
            

        </Grid>
</React.Fragment>
          );
    }

}

const mapStateToProps = state => {
    return {
        questionPaginate : state.question.questionPaginate,
        allUnits : state.user.allUnits,        
        loggedUser : state.user.user,
        incompleteUsers:state.survey.incompleteUsers
     };
  };

  const mapDispatchToProps = dispatch => {
    return {
        toggleSnackBar: bool => dispatch(toggleSnackBar(bool)),
        getQuestions: () => dispatch(getQuestions()),
        getUnits : () => dispatch(getUnits()),
        getUserNotAnswering : () => dispatch(getUserNotAnswering()),
        
    };
  }



const Dashboard = connect(mapStateToProps,mapDispatchToProps)(DashboardComponent);

export default withStyles(styles)(Dashboard);



