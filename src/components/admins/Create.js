import React, { useState, useContext, useEffect} from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import "firebase/database";
// import ErrorNotice from "../misc/ErrorNotice";
import {
  Avatar,
  Button,
  CssBaseline,
  // TextField,
  Link,
  Grid,
  Typography,
  Container
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { ToastConsumer, ToastProvider, useToasts } from 'react-toast-notifications';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {PathToFunction} from "../route.js";
import { toast } from 'react-toastify'



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Create() {
  const classes = useStyles();
  const { addToast } = useToasts()
  const [email, setEmail] = useState(() => '');
  const [firstName, setFirstName] = useState(() => '');
  const [lastName, setLastName] = useState(() => '');
  const [password, setPassword] = useState(()=> '');
  const [rllys, setRllys] = useState(()=>[]);
  const [role, setRole] = useState(()=> 'All');
  
  const history = useHistory();
  const submit = async (e) => {
    console.log('submit');
    
    e.preventDefault();
    if(password.length<5){
      addToast("You must provide 6+ password!", {appearance: 'error'});
    }else{
      Axios.post(PathToFunction+'/admin/create', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role
      }).then((response) => {
        if(response.data.data= "success"){
          history.push("/admins");
        }
      }, (error) => {
        console.log(error);
      });
    }
    
    
  };

  const getRllytypes= ()=>{
    Axios.get(PathToFunction+'/getRllytypes').then((response)=>{
      setRllys(response.data.data);
    }, (error)=>{
      console.log(error);
    });
  }
  useEffect(()=>{
    getRllytypes();
  },[]);
  const changeRole = (event) => {
    setRole(event.target.value);
  };
  return (
    <ToastProvider>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Administrator Create
        </Typography>
        <ValidatorForm className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextValidator
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
                value={firstName}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="lname"
                value={lastName}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                value = {email}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
                value = {password}
                validators={['required']}
                errorMessages={['this field is required', 'password is not valid']}
              />
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="roleSlectLb">Role</InputLabel>
              <Select
                labelId="role-select"
                id="role-select"
                
                value={role}
                onChange={changeRole}
                >
                  <MenuItem value= 'All'>All</MenuItem>
                  {rllys.map((rllyone)=>(
                    <MenuItem key= {rllyone} value={rllyone}>{rllyone}</MenuItem>
                  ))}
                  
              </Select>
            </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create
          </Button>
        </ValidatorForm>
      </div>
    </Container>
    </ToastProvider>
  );
}
