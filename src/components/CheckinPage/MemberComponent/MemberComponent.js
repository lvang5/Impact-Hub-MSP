import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from 'react-select';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ArrowBack, Check } from '@material-ui/icons';
import Swal from 'sweetalert2';
const styles = theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        justify: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    container: {
        position: 'absolute',
        top: '40%',
        width: '500px',
    },
    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: `${theme.spacing.unit}px 0`,
        background: theme.palette.background.default,
        size: 'large'
    },
    button: {
        background: 'white',
        borderRadius: 3,
        color: 'black',
        fontSize: 40,
        height: '80px',
        width: '250px',
        webkitBoxShadow: '0px 6px 5px 1px rgba(0,0,0,0.75)',
        mozBoxShadow: '0px 6px 5px 1px rgba(0,0,0,0.75)',
        boxShadow: '0px 6px 5px 1px rgba(0,0,0,0.75)',
        border: '1px solid darkgrey',
    },
    rooot: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    listItemText: {
        fontSize: '2em',
    },
    secondaryItemText: {
        fontSize: '1.5em',
        display: 'inline',
    },
    font: {
        fontSize: '2em',
        height: '100px',
        width: '500px',
        margin: 'auto'
    },
    checkoutContainer: {
        height: '150px'
    }
});

const toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000
});

//Global array of all the members
const members = [];

//Gets member and pushes to array m
function getMembers() {
    axios.get('/api/memb/list')
        .then((response) => {
            let member = response.data;
            member.map((member) => {
                members.push({
                    label: <ListItem><Avatar style={{ width: '60px', height: '60px' }}><img className="avatar" src={member.img_url} /></Avatar> <ListItemText primary={member.name} secondary={member.company} /></ListItem>,
                    value: member.cobot_id + member.name,
                    img_url: member.img_url,
                    company: member.company,
                    name: member.name,
                    id: member.cobot_id
                })
                return members;
            })
        })
}

// get list of member array and their checked-in status

members.map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label,
}));



const mapStateToProps = state => ({
    user: state.user,
    checkedMembers: state.members,
});

class MemberComponent extends Component {

    constructor() {
        super();

        // This will store the user that is selected from the drop-down menu.
        //Whis will be used for axios request.
        this.state = {
            single: '',
            purpose: 'Work',
            day: null,
            time: null,
            checked_in: true,
            open: false,
        }
        this.baseState = this.state
    }


    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_MEMBERS' })
        getMembers()
        this.getCheckedIn()


        this.props.dispatch({ type: 'FETCH_MEMBERSLIST' })
    }


    handleChange = name => async value => {
        await this.setState({
            [name]: value,
            day: moment().format("L"),
            time: moment().format("LTS")
        });
        if (this.state.single === null || this.state.single === '') {
            this.resetForm()
        } else {
            console.log(this.state.single.id)
            this.checkStatus(this.state.single.id)
            this.setState({
                open: true
            })
        }
    };

    //change checked in to status of user if they are already checked if not then button will remain checked-in
    //based on user selected we will compare it to members that are checked in
    //if user is checked in button will changed to checkout 
    //if user is not checked in button will remain checked in

    getCheckedIn() {

        axios.get('/api/memb/checkedin')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    membersCheckedIn: response.data
                })
            }).catch((error) => {
                console.log('error', error);
            })
    }


    //check if the person selected is already check in if not then check_in will be toggled to activate checkout button
    //TODO still allows user to check in twice even though they are checked in if already checked in you can-not check in again.
    checkStatus(selectedMember) {
        console.log('in selectedMember', selectedMember);
        let membersCheckedIn = this.props.checkedMembers;
        console.log(membersCheckedIn)
        for (let user of membersCheckedIn) {
            console.log(user.cobot_id, selectedMember);
            if (user.cobot_id === selectedMember) {
                this.setState({
                    checked_in: false
                })
            }
            else {
                this.setState({
                    checked_in: true
                })
                break;
            }
        }
    }

    handleClose = () => {
        this.setState({ open: false });
        this.resetForm();
    };

    handleVisit = (event, purpose) =>
        this.setState({
            purpose
        })


    handlePut = () => {
        axios.put('/api/memb', this.state)
            .then(response => {
                console.log('Member checked-out', response);
                toast.fire({
                    text: "Checked Out successfully!",
                    type: "success",
                })
            }).catch(error => {
                console.log('You got an error');
                toast.fire({
                    type:"error",
                    text:"Checkout Failed"
                })
            })
        this.handleClose()
    }

    handlePost = () => {
        this.props.dispatch({ type: 'POST_MEMBER', payload: this.state })

        this.handleClose()
    }

    resetForm = () => {
        this.setState(this.baseState)
        this.props.dispatch({ type: 'FETCH_MEMBERSLIST' })
    }

    // This function will be carried into the UsernameComponent, and will be called to update the current user when one is selected from the dropdown.
    render() {
        console.log("this is the array of checked in members:", this.props.checkedMembers, "this is the state: ", this.state);
        const { classes, fullScreen } = this.props;
        const { purpose } = this.state;
        console.log(this.state.checked_in)
        let button;
        let visit;

        if (this.state.checked_in) {
            button = <Button
                variant="contained"
                color="primary"
                onClick={this.handlePost}
                textDense={true}
                className={classes.font}>
                <Check></Check>
                Check-In
        </Button>
            visit = <div>
                <Typography variant="h4">
                    Purpose:
                </Typography>
                <DialogActions>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup value={purpose} exclusive onChange={this.handleVisit}>
                            <ToggleButton value="Work" className={classes.button}>
                                {this.state.purpose === 'Work' ? <Check></Check> : ''}Work
                </ToggleButton>
                            <ToggleButton value="Event" className={classes.button} >
                                {this.state.purpose === 'Event' ? <Check></Check> : ''}Event
                </ToggleButton>
                        </ToggleButtonGroup>
                    </div>


                </DialogActions>
            </div>

        } else {
            visit =
                <div className={classes.checkoutContainer}>
                </div>
            button =
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handlePut}
                    textDense={true}
                    className={classes.font} >
                    <Check></Check>
                    Checkout
                </Button>

                ;
        }




        return (
            <Grid item xs={6} sm={6} md={6} lg={6} className={classes.root}>
                <Paper className={classes.container} style={{paddingTop:'10px'}}>
                    <div>
                        <div>
                            <div style={{ marginLeft: '25px', marginTop: '10px' }}>
                                <Typography variant="h3">
                                    Are you a Member?
                        </Typography>
                            </div>
                            <div>
                                <List component="nav">
                                    {/* Component for selecting name & drop-down menu */}
                                    <ListItem divider>
                                        <Select
                                            className="container"
                                            classNamePrefix="input"
                                            isClearable
                                            noOptionsMessage={() => 'Start by typing your name'}
                                            backspaceRemovesValue
                                            options={members}
                                            value={this.state.single}
                                            onChange={this.handleChange('single')}
                                            placeholder="Full Name"
                                        />
                                    </ListItem>
                                    <div >
                                        <Dialog
                                            fullScreen={fullScreen}
                                            onExit={this.resetForm}
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                            aria-labelledby="responsive-dialog-title"

                                        >
                                            <div className='dialogContainer'>
                                                {/* <Toolbar>
                                  
                                    </Toolbar> */}
                                                <DialogContent>
                                                    <IconButton color="inherit" onClick={this.handleClose} aria-label="Close" style={{
                                                        position: "absolute",
                                                        top: "0",
                                                        right: "0",
                                                        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
                                                        padding: '0',
                                                    }}>
                                                        <CloseIcon onClick={this.handleClose} />
                                                    </IconButton>
                                                    <Typography variant="h2" align="center">
                                                        Is this you?
                                                    </Typography>
                                                    <DialogContentText>
                                                        <div className={classes.rooot}>
                                                            <ListItem>
                                                                <Avatar style={{ width: '150px', height: '150px' }}><img className="modolImg" src={this.state.single.img_url} />
                                                                </Avatar>
                                                                <ListItemText
                                                                    classes={{ primary: classes.listItemText, secondary: classes.secondaryItemText }}
                                                                    inset={true} primary={this.state.single.name} secondary={this.state.single.company} />
                                                            </ListItem>
                                                        </div>
                                                    </DialogContentText>
                                                </DialogContent>
                                                {visit}
                                                <div className={classes.font}>
                                                    {button}
                                                    <Button variant="contained" color="secondary" textDense={true} fullwidth={true} onClick={this.handleClose} className={classes.font}>
                                                        <ArrowBack></ArrowBack> Back
                                                    </Button>
                                                </div>
                                            </div>

                                        </Dialog>
                                    </div>
                                </List>

                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
        );
    }
}

MemberComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired,
};
const MemberWithStyle = withStyles(styles)(MemberComponent)

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(MemberWithStyle);

