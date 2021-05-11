import React, { useState, useContext, useEffect} from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
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
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Checkbox from '@material-ui/core/Checkbox';
import RemoveIcon from '@material-ui/icons/Remove';
import FormControl from '@material-ui/core/FormControl';

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

export default function WaypointsTab(props) {
  const classes = useStyles();
  const { addToast } = useToasts()
  const [email, setEmail] = useState(() => '');
  const [name, setName] = useState(() => '');
  const [longLat, setLongLat] = useState(() => '');
  const [lastUserId, setLastUserId] = useState(()=> 1);
  const [longDesc, setLongDesc] = useState(() => '');
  const [correctPt, setCorrectPt] = useState(() => '');
  const [incorrectPt, setIncorrectPt] = useState(() => '');
  const [question, setQuestion] = useState(() => '');
  const [textCorrectAns, setTextCorrectAns] = useState(() => '');
  const [textIncorrectAns, setTextIncorrectAns] = useState(() => '');
  const [image, setImage] = useState(()=>'');
  const [imageName, setImageName] = useState();
  const [isImagePicked, setIsImagePicked] = useState(false);
  const [themes, setThemes] = useState(()=>[]);
  const [selectedTheme, setSelectedTheme] = useState(()=> '');

  const initialValue= [{id: 1, answer: '', isCorrect: false}];

  const [answers, setAnswers]= useState(initialValue);
  const [rllys, setRllys] = useState(()=>[]);
  const [selectedRlly, setSelectedRlly] = useState(()=> "");
  const [wayPoints, setWayPoints] = useState(()=>[]);
  const [selectedWayPoint, setSelectedWayPoint]= useState(()=>'');
  
  const getRllytypes= ()=>{
    Axios.get(PathToFunction+'/getRllytypes').then((response)=>{
      setRllys(response.data.data);
      if(props.type== "create"){
        setSelectedRlly(response.data.data[0]);
      }
      
    }, (error)=>{
      console.log(error);
    });
  }
  
  useEffect(()=>{
    getRllytypes();
    if(props.type== "edit"){
      Axios.post(PathToFunction+ '/wayPoint/getWithRlly', {
        rlly:props.editedRlly.Name
      })
        .then((response)=>{
          console.log(response.data.data);
          setWayPoints(response.data.data);
          if(response.data.data.length>0){
            setSelectedWayPoint(response.data.data[0]);
            setName(response.data.data[0].Title);
            setLongLat(response.data.data[0].Location);
            setLongDesc(response.data.data[0].Description);
            setCorrectPt(response.data.data[0].CorrectPoint);
            setIncorrectPt(response.data.data[0].IncorrectPoint);
            setQuestion(response.data.data[0].Question);
            setTextCorrectAns(response.data.data[0].CorrectText);
            setTextIncorrectAns(response.data.data[0].WrongText);
            setAnswers([...response.data.data[0].Answers]);
          }
          
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

  const changeselectedRlly = (event) => {
    setSelectedRlly(event.target.value);
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
  
  const changeselectedWayPoint = (event) => {
    console.log("come here", event.target.value);
    var newWayPt= wayPoints.filter((wayone)=>{
      return wayone.Title== event.target.value;
    });
    console.log("herw ch", newWayPt);
    setSelectedWayPoint({...newWayPt[0]});
    setName(newWayPt[0].Title);
    setLongLat(newWayPt[0].Location);
    setLongDesc(newWayPt[0].Description);
    setCorrectPt(newWayPt[0].CorrectPoint);
    setIncorrectPt(newWayPt[0].IncorrectPoint);
    setQuestion(newWayPt[0].Question);
    setTextCorrectAns(newWayPt[0].CorrectText);
    setTextIncorrectAns(newWayPt[0].WrongText);
    setAnswers([...newWayPt[0].Answers]);
  };

  const addAnswer = ()=>{
    var id= 1;
    if(answers.length!= 0){
      id= answers[answers.length-1].id+1;
    }
    var newAnswers= [...answers, {id:id, answer: '', isCorrect: false}];
    setAnswers([...newAnswers]);
  };
  const removeAnswer= (id)=>{
    var newAnswers= answers.filter((answerone)=>{
      return answerone.id!= id;
    });
    setAnswers([...newAnswers]);
  };

  const answerChangeHandle = (text, id)=>{
    var newAnswers= answers.map((answerone)=>{
      if(answerone.id== id){
        answerone.answer= text;
      }
      return answerone;
    });
    setAnswers([...newAnswers]);
  };

  const answerCheckedHandle= (id)=>{
    var newAnswers= answers.map((answerone)=>{
      if(answerone.id== id){
        if(answerone.isCorrect== false){
          answerone.isCorrect= true;
        }
        else{
          answerone.isCorrect= false;
        }
      }
      return answerone;
    });
    setAnswers([...newAnswers]);
  }
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    console.log({
      selectedRlly, name, longLat, longDesc, correctPt, incorrectPt, image, imageName, question,answers, textCorrectAns, textIncorrectAns
    })
    if(props.type== "create"){
      Axios.post(PathToFunction+ '/wayPoint/create', {
        selectedRlly, name, longLat, longDesc, correctPt, incorrectPt, image, imageName, question,answers, textCorrectAns, textIncorrectAns
      })
        .then((response)=>{
          history.push("/rllys");
        });
    }else{
      Axios.post(PathToFunction+'/wayPoint/edit', {
        selectedRlly:selectedWayPoint.Title , name, longLat, longDesc, correctPt, incorrectPt, image, imageName, question, answers, textCorrectAns, textIncorrectAns, Id:selectedWayPoint.Id
      })
        .then((response)=>{
          history.push("/rllys");
        });
    }
    
    // writeUserData(lastUserId, firstName, longLat, email);
    
  };

  const onDragStart = (ev, id) => {
    console.log('dragstart:',id);
    ev.dataTransfer.setData("id", id);
  }

  const onDragOver = (ev) => {
    ev.preventDefault();
    console.log(ev.target.value);
  }
  const onDrop = (ev) => {
    let id = ev.dataTransfer.getData("id");
    console.log(ev.target.value);
    // let tasks = this.state.tasks.filter((task) => {
    //     if (task.name == id) {
    //         task.category = cat;
    //     }
    //     return task;
    // });

    // this.setState({
    //     ...this.state,
    //     tasks
    // });
  }
  return (
      <div className={classes.paper}>
        <ValidatorForm className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            {props.type=="edit"?(
              <Grid item xs= {6}>
              <InputLabel id="selectedwayPoints">WayPoints</InputLabel>
              <Select
                labelId="selectedWayPoint-select"
                id="selectedWayPoint-select"
                onDragOver={(e)=>onDragOver(e)}
                onDrop={(e)=>onDrop(e)}
                value={selectedWayPoint.Title? selectedWayPoint.Title: ''}
                onChange={changeselectedWayPoint}
                >
                  {
                  wayPoints.map((wayPointone)=>(
                    <MenuItem onDragOver={(e)=>onDragOver(e)} onDrop={(e)=>onDrop(e)} key= {wayPointone.Id} value={wayPointone.Title} draggable onDragStart = {(e) => onDragStart(e, wayPointone.Id)}>{wayPointone.Title}</MenuItem>
                  ))}
                  
              </Select>
            </Grid>
            ):(<Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="selectedRllySlectLb">Rlly</InputLabel>
                <Select
                  labelId="selectedRlly-select"
                  id="selectedRlly-select"
                  
                  value={selectedRlly}
                  onChange={changeselectedRlly}
                  >
                    {rllys.map((rllyone)=>(
                      <MenuItem key= {rllyone} value={rllyone}>{rllyone}</MenuItem>
                    ))}
                    
                </Select>
              </FormControl>
            </Grid>)}
            
            
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
                errorMessages={['this field is required']}
              />
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
            <Grid item xs={12} sm={3}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="correctPt"
                label="Correct Point"
                name="correctPt"
                onChange={(e) => setCorrectPt(e.target.value)}
                autoComplete="llat"
                value={correctPt}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="incorrectPt"
                label="Incorrect Point"
                name="incorrectPt"
                onChange={(e) => setIncorrectPt(e.target.value)}
                autoComplete="llat"
                value={incorrectPt}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextValidator
                autoComplete="question"
                name="question"
                variant="outlined"
                required
                fullWidth
                id="question"
                label="question"
                onChange={(e) => setQuestion(e.target.value)}
                autoFocus
                value={question}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12} sm={12} container>
              <Grid item xs= {2} sm= {2}>
                Answers
              </Grid>
              <Grid item xs= {1} sm= {1}>
                <AddIcon onClick= {addAnswer}/> 
              </Grid>
              <Grid item xs= {5} sm= {5}></Grid>
              <Grid item xs= {2} sm= {2}>Is correct</Grid>
              <Grid item xs= {1} sm= {1}><ArrowDownwardIcon/></Grid>
              <Grid item xs= {1} sm= {1}></Grid>
            </Grid>
            {answers.map((answerone)=>(
              <Grid item xs={12} sm={12} container key= {answerone.id}>
                <Grid item xs= {10} sm= {10} >
                  <TextValidator
                    
                    label={"Answer"+answerone.id}
                    autoComplete="answer1"
                    name="answer1"
                    variant="outlined"
                    required
                    fullWidth
                    id={"answer"+answerone.id}
                    onChange={(e) => answerChangeHandle(e.target.value, answerone.id)}
                    autoFocus
                    value={answerone.answer}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                </Grid>
                <Grid item xs= {1} sm= {1}>
                  <Checkbox
                    
                    checked={answerone.isCorrect}
                    onChange={()=> answerCheckedHandle(answerone.id)}
                    value={"checked"+answerone.id}
                  />
                </Grid>
                <Grid item xs= {1} sm= {1}>
                  <RemoveIcon  onClick= {()=>removeAnswer(answerone.id)}/>
                </Grid>
              </Grid>))}
            
            
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="textCorrectAns"
                label="Text correct Answer"
                name="textCorrectAns"
                type="text"
                multiline
                rows= {2}
                autoComplete="textCorrectAns"
                onChange={(e) => setTextCorrectAns(e.target.value)}
                value = {textCorrectAns}
                validators={['required']}
                errorMessages={['this field is required']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="outlined"
                required
                fullWidth
                id="textIncorrectAns"
                label="Text incorrect Answer"
                name="textIncorrectAns"
                type="text"
                multiline
                rows= {2}
                autoComplete="textIncorrectAns"
                onChange={(e) => setTextIncorrectAns(e.target.value)}
                value = {textIncorrectAns}
                validators={['required']}
                errorMessages={['this field is required']}
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
