import React, { useState, useContext, useEffect} from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import TotalContext from "../../context/TotalContext";
import ScoresTable from "./ScoresTable";
import Axios from "axios";
import Firebase from 'firebase';
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
  Container,
  Tabs,
  Tab,
  Paper
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { useToasts } from 'react-toast-notifications';
import {PathToFunction} from "../route.js";

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

export default function Edit() {
  const classes = useStyles();
  const { addToast } = useToasts()
  const { editedUser, setEditedUser} = useContext(TotalContext);
  console.log("editedUser,", editedUser);
  const [email, setEmail] = useState(() => editedUser.Email);
  const [firstName, setFirstName] = useState(() => editedUser.FirstName);
  const [lastName, setLastName] = useState(() => editedUser.LastName);
  // const [error, setError] = useState();
  // const form = useRef();
  
  const history = useHistory();

  const [value, setValue] = React.useState(0);

  const navigateInfo = (event, newValue) => {
    setValue(newValue);
  };

  function updateUserProfileData() {
		Axios.post(PathToFunction+'/user/updateProfile', {
      userId: editedUser.UserID,
      firstName: firstName,
      lastName: lastName,
      email: email
    }).then((response) => {
      console.log(response);
      history.push("/users");
    }, (error) => {
      console.log(error);
    });
	}
  const submit = async (e) => {
    console.log('submit');
    e.preventDefault();
    
    updateUserProfileData();
    
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper} >
        <Tabs
          maxWidth="xs"
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={navigateInfo}
          aria-label="disabled tabs example"
        >
          <Tab label="User Detail" />
          <Tab label="Scores" />
        </Tabs>
        {value!= 1 ?
        (<Container maxWidth= 'xs'>
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
          
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update
          </Button>
        </ValidatorForm></Container>):(<Container maxWidth= 'md'>
          <ScoresTable editedUser= {editedUser}/>
        </Container>
          
        )
        }
      </div>
    </Container>
  );
}
