import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import Icon from './Icon'
import {GoogleLogin} from 'react-google-login'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import { useNavigate } from 'react-router-dom';
import {signin, signup} from '../../actions/auth'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignUp] = useState(false)
    const [form, setForm] = useState(initialState);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const handleSubmit = (e) => {
      e.preventDefault()
      if(isSignup){
        dispatch(signup(form, navigate))
      }
      else{
        dispatch(signin(form, navigate))
      }

    }

    const handleChange = (e) => {
      setForm({...form, [e.target.name] : e.target.value})
    }

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp)
        setShowPassword(false)
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
    
        try {
          dispatch({ type: 'AUTH', data: { result, token } });
          navigate('/');
        } catch (error) {
          console.log(error);
        }
      };

    const googleError = (error) =>{
      console.log(error)
      console.log('Google Sign In was unsuccessful. Try again later');
    } 
    
//https://console.cloud.google.com/apis/credentials?project=memoriesapp-316812

    return (
    <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              { isSignup && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
              </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
            </Button>
            <GoogleLogin
                clientId="259393207049-dkc5jm1e83qjcrgdlq4isv5uro5ho3cj.apps.googleusercontent.com"
                render={(renderProps) => (
                <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                    Google Sign In
                </Button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleError}
                cookiePolicy="single_host_origin"
            />

            <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
          </form>
        </Paper>
      </Container>
    )
}

export default Auth
