import React, { useState, useContext, useEffect} from "react";
import { useHistory } from "react-router-dom";

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
  Container
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { useToasts } from 'react-toast-notifications';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {PathToFunction} from "../route.js";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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
  button: {
      height: '100%'
  }
}));

export default function RllyTab(props) {
  const classes = useStyles();
  const { addToast } = useToasts()
  
  const [name, setName] = useState(() => '');
  const [longLat, setLongLat] = useState(() => '');
  const [fromHour, setFromHour] = useState(() => '');
  const [toHour, setToHour] = useState(() => '');
  const [fromKm, setFromKm] = useState(() => '');
  const [toKm, setToKm] = useState(() => '');
  const [lastUserId, setLastUserId] = useState(()=> 1);
  const [startAdd, setStartAdd] = useState(() => '');
  const [startPloats, setStartPloats] = useState(() => '');
  const [shortDesc, setShortDesc] = useState(() => '');
  const [longDesc, setLongDesc] = useState(() => '');
  const [image, setImage] = useState(()=>'');
  const [imageName, setImageName] = useState();
  const [isImagePicked, setIsImagePicked] = useState(false);
  const [themes, setThemes] = useState(()=>[]);
  const [selectedTheme, setSelectedTheme] = useState(()=> '');
  

  useEffect(()=>{
    Axios.get(PathToFunction+ '/getThemes')
      .then((response)=>{
        setThemes(response.data.data);
        if(response.data.data.length> 0){
          setSelectedTheme(response.data.data[0]);
        }
        
      });

    if(props.type== "edit"){
      Axios.post(PathToFunction+ '/rlly/getWithName', {
        rlly:props.editedRlly.Name
      })
        .then((response)=>{
          setName(response.data.data.Id);
          setLongLat(response.data.data.Location);
          var duration= response.data.data.Duration;
          var fromHr= duration.split("-")[0];
          var toHr= '';
          if(duration.split("-").length>1){
            toHr= duration.split("-")[1];
          }
          setFromHour(fromHr);
          setToHour(toHr);
          var totaldistance= response.data.data.TotalDistance;
          var frKm= totaldistance.split("-")[0];
          var toK= '';
          if(totaldistance.split("-").length>1){
            toK= totaldistance.split("-")[1];
          }
          setFromKm(frKm);
          setToKm(toK);
          setStartAdd(response.data.data.StartCity);
          setStartPloats(response.data.data.StartLocation);
          setSelectedTheme(response.data.data.Theme);
          setShortDesc(response.data.data.ShortDescription);
          setLongDesc(response.data.data.LongDescription);
        });
    }
  },[]);
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

  const getLongLatHandle = ()=>{
    navigator.geolocation.getCurrentPosition(function(position) {
      setLongLat(position.coords.latitude+ ", " + position.coords.longitude);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      console.log(longLat);
    });
  }
  
  const changeselectedTheme = (event) => {
    setSelectedTheme(event.target.value);
  };
  
  // const [error, setError] = useState();
  // const form = useRef();
  
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    if(props.type== "create"){
      Axios.post(PathToFunction+ '/rlly/create', {
        name, longLat, fromHour, toHour, fromKm, toKm, selectedTheme, image, imageName, startAdd, startPloats, shortDesc, longDesc
      })
        .then((response)=>{
          history.push("/rllys");
        });
    }else{
      Axios.post(PathToFunction+'/rlly/edit', {
        name, longLat, fromHour, toHour, fromKm, toKm, selectedTheme, image, imageName, startAdd, startPloats, shortDesc, longDesc
      })
        .then((response)=>{
          history.push("/rllys");
        });
    }
    
    // writeUserData(lastUserId, firstName, longLat, email);
    
  };

  return (
      <div className={classes.paper}>
        <ValidatorForm className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextValidator
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                onChange={(e) => setName(e.target.value)}
                autoFocus
                value={name}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="longLat"
                label="Long Lat"
                name="longLat"
                onChange={(e) => setLongLat(e.target.value)}
                autoComplete="llat"
                value={longLat}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick= {getLongLatHandle}
                className={classes.button}
            >
                Get Long lat
            </Button>
            </Grid>
            <Grid item xs={6} container spacing= {2} direction= "row">
                <Grid item xs= {12}>
                    Duaration in hours
                </Grid>

                <Grid item xs= {4}>
                <TextValidator
                    variant="outlined"
                    required
                    id="fromHour"
                    label="From"
                    name="fromHour"
                    onChange={(e) => setFromHour(e.target.value)}
                    autoComplete="llat"
                    value={fromHour}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
                </Grid>
                <Grid item xs= {4}>
                <TextValidator
                    variant="outlined"
                    required
                    id="toHour"
                    label="To"
                    name="toHour"
                    onChange={(e) => setToHour(e.target.value)}
                    autoComplete="llat"
                    value={toHour}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
                </Grid>
            </Grid>
            <Grid item xs={6} container spacing= {2} direction= "row">
                <Grid item xs= {12}>
                    Total distance in Km
                </Grid>

                <Grid item xs= {4}>
                <TextValidator
                    variant="outlined"
                    required
                    id="fromKm"
                    label="From"
                    name="fromKm"
                    onChange={(e) => setFromKm(e.target.value)}
                    autoComplete="llat"
                    value={fromKm}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
                </Grid>
                <Grid item xs= {4}>
                <TextValidator
                    variant="outlined"
                    required
                    id="toKm"
                    label="To"
                    name="toKm"
                    onChange={(e) => setToKm(e.target.value)}
                    autoComplete="llat"
                    value={toKm}
                    validators={['required']}
                    errorMessages={['this field is required']}
                />
                </Grid>
            </Grid>
            <Grid item xs= {6}>
              <InputLabel id="selectedThemes">Theme</InputLabel>
              <Select
                labelId="selectedTheme-select"
                id="selectedTheme-select"
                
                value={selectedTheme}
                onChange={changeselectedTheme}
                >
                  {themes.map((themeone)=>(
                    <MenuItem key= {themeone} value={themeone}>{themeone}</MenuItem>
                  ))}
                  
              </Select>
            </Grid>
            <Grid item xs= {6}>
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
            <Grid item xs= {6}>
            <TextValidator
                variant="outlined"
                required
                id="startAdd"
                label="Start Address"
                name="startAdd"
                onChange={(e) => setStartAdd(e.target.value)}
                autoComplete="llat"
                value={startAdd}
                validators={['required']}
                errorMessages={['this field is required']}
            />
            </Grid>
            <Grid item xs= {6}>
            <TextValidator
                variant="outlined"
                required
                id="startPloats"
                label="Start Ploats"
                name="startPloats"
                onChange={(e) => setStartPloats(e.target.value)}
                autoComplete="llat"
                value={startPloats}
                validators={['required']}
                errorMessages={['this field is required']}
            />
            </Grid>
            
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="shortDesc"
                label="Short descripton"
                name="shortDesc"
                type="text"
                multiline
                rows= {2}
                autoComplete="shortDesc"
                onChange={(e) => setShortDesc(e.target.value)}
                value = {shortDesc}
                validators={['required']}
                errorMessages={['this field is required', 'shortDesc is not valid']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="longDesc"
                label="Long descripton"
                name="longDesc"
                type="text"
                multiline
                rows= {3}
                autoComplete="longDesc"
                onChange={(e) => setLongDesc(e.target.value)}
                value = {longDesc}
                validators={['required']}
                errorMessages={['this field is required', 'longDesc is not valid']}
              />
            </Grid>
          
          </Grid>
          {props.type== "create"?(
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
          ):(<Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Update
            </Button>)}
          
        </ValidatorForm>
      </div>
  );
}
