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
import { useToasts } from 'react-toast-notifications';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {PathToFunction} from "../route.js";
import TotalContext from "../../context/TotalContext";


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
  const {editedScore, setEditedScore} = useContext(TotalContext);
  console.log("editedScore", editedScore);
  const [email, setEmail] = useState(() => '');
  const [date, setDate] = useState(() => editedScore.ScoreDate);
  const [score, setScore] = useState(() => editedScore.Score);
  const [image, setImage] = useState(()=>'');
  const [imageName, setImageName] = useState();
  const [isImagePicked, setIsImagePicked] = useState(false);

  const [rllys, setRllys] = useState(()=>[]);
  const [selectedRlly, setSelectedRlly] = useState(()=> editedScore.Rlly);
  
  useEffect(()=>{
    Axios.post(PathToFunction+'/getEmailWithUid',{Uid: editedScore.Uid})
      .then((response)=>{
        setEmail(response.data.data);
      });
  }, [email]);

  const history = useHistory();
  const imagePickHandler = async(e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      //reader.result is the result of the reading in base64 string
      setImageName(file.name);
      setImage(reader.result);
      setIsImagePicked(true);
    };
	};
  const submit = async (e) => {
    e.preventDefault();
    
    Axios.post(PathToFunction+'/score/edit', {
      date: date,
      score: score,
      email: email,
      uid: editedScore.Uid,
      name: editedScore.Name,
      rlly: selectedRlly,
      image: image,
      imageName: imageName
    }).then((response) => {
      console.log(response.data.imageUrl);
      history.push("/scores");
    }, (error) => {
      console.log(error);
    });
    
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
  }, []);
  const changeselectedRlly = (event) => {
    setSelectedRlly(event.target.value);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Score Update
        </Typography>
        <ValidatorForm className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                disabled
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
            <Grid item xs={12} sm={6}>
              <TextValidator
                autoComplete="date"
                name="date"
                variant="outlined"
                required
                disabled
                fullWidth
                id="date"
                label="Date(epoch)"
                onChange={(e) => setDate(e.target.value)}
                autoFocus
                value={date}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="score"
                label="Score"
                name="score"
                onChange={(e) => setScore(e.target.value)}
                autoComplete="score"
                value={score}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            
            <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="selectedRllySlectLb">selectedRlly</InputLabel>
              <Select
                labelId="selectedRlly-select"
                id="selectedRlly-select"
                
                value={selectedRlly}
                onChange={changeselectedRlly}
                >
                  <MenuItem value= 'All'>All</MenuItem>
                  {rllys.map((rllyone)=>(
                    <MenuItem key= {rllyone} value={rllyone}>{rllyone}</MenuItem>
                  ))}
                  
              </Select>
            </FormControl>
            </Grid>
            <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              color="default"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
              <input
                onChange= {imagePickHandler}
                accept="image/*"
                type="file"
                hidden
              />
            </Button>
            {isImagePicked?(
              <p>File Name:{imageName}</p>
            ):(
              <p>Selected File Name goes here</p>
            )}
            
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
        </ValidatorForm>
      </div>
    </Container>
  );
}
