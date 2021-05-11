import React, { useState, useEffect } from "react";
import Scores from "./Scores";
import Create from "./Create";
import Edit from "./Edit";
// import ScoresTable from "./ScoresTable"
import ScoreContext from "../../context/ScoreContext";
import Axios from "axios";
import {PathToFunction} from "../route.js";

import {
  Grid
} from '@material-ui/core'

export default function ScoreContainer() {
	const [scores, setScores] = useState(()=>[]);
  	const [filteredScores, setfilteredScores] = useState(()=> []);
    const [rllys, setRllys] = useState(()=>[]);
    const [selectedRlly, setSelectedRlly] = useState(()=> 'All');

    const getScoreData = () => {
        Axios.get(PathToFunction+'/scores/getAll').then((response) => {
            console.log(response.data.data);
            setScores(response.data.data);
        }, (error) => {
            console.log(error);
        });
    }
	const getRllytypes= ()=>{
        Axios.get(PathToFunction+'/getRllytypes').then((response)=>{
            setRllys(response.data.data);
        }, (error)=>{
            console.log(error);
        });
    }
	useEffect(() => {
		console.log("here is effect");
		getScoreData();
        getRllytypes();
	},[]);
	return (
		<ScoreContext.Provider value= {{scores, setScores, filteredScores, setfilteredScores, rllys, setRllys, selectedRlly, setSelectedRlly}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={12} sm={12}>
	      			<Scores/>
	      		</Grid>
	      	</Grid>
		</ScoreContext.Provider>
	);
}