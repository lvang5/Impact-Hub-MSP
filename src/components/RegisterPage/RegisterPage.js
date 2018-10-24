import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }

  registerUser = (event) => {

    if (this.state.username === '' || this.state.password === '') {
      this.setState({
        message: 'Choose a username and password!',
      });
    } else {
      const body = {
        username: this.state.username,
        password: this.state.password,
      };

      // making the request to the server to post the new user's registration
      axios.post('/api/user/register/', body)
        .then((response) => {
          if (response.status === 201) {
            this.props.history.push('/home');
          } else {
            this.setState({
              message: 'Ooops! That didn\'t work. The username might already be taken. Try again!',
            });
          }
        })
        .catch(() => {
          this.setState({
            message: 'Ooops! Something went wrong! Is the server running?',
          });
        });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.state.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.state.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <div>
        {this.renderAlert()}
        <Paper style={{
          width: '30%',
          height: '250px',
          margin: '20px auto',
          marginTop: '10%',
          padding: '25px',
          borderRadius: '2px',
          alignContent: 'right'

        }}>
          <Typography variant="h3">Register User</Typography>
          <div style={{ margin: '10px' }}>
            <TextField
              type="text"
              name="username"
              value={this.state.username}
              label="Username"
              fullWidth
              onChange={this.handleInputChangeFor('username')}
            />
          </div>
          <div style={{ margin: '10px' }}>
            <TextField
              type="password"
              name="password"
              label="Password"
              fullWidth
              value={this.state.password}
              onChange={this.handleInputChangeFor('password')}
            />
          </div>
          <div style={{ margin: '10px' }}>
            <Button
              onClick={this.registerUser}
              value="Register"
            >
              Register
            </Button>
            <Button>
              <Link to="/home">Cancel</Link>
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

export default RegisterPage;

