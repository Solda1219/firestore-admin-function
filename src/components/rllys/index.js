import React, { useState, useEffect } from "react";
import Rllys from "./Rllys";
import Create from "./Create";
import Edit from "./Edit";
import ScoresTable from "./ScoresTable"
import RllyContext from "../../context/RllyContext";
import Axios from "axios";
import {PathToFunction} from "../route.js";

import {
  Grid
} from '@material-ui/core'

export default function RllyContainer() {
	const [rllys, setRllys] = useState(()=>[]);
  	const [filteredRllys, setfilteredRllys] = useState(()=> []);
	  const getRllyData = () => {
		Axios.get(PathToFunction+'/rllys/getAll').then((response) => {
		  console.log(response.data.data);
		  setRllys(response.data.data);
		}, (error) => {
		  console.log(error);
		});
	  }
	
	useEffect(() => {
		console.log("here is effect");
		getRllyData();
	},[]);
	return (
		<RllyContext.Provider value= {{rllys, setRllys, filteredRllys, setfilteredRllys}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={12} sm={12}>
	      			<Rllys/>
	      		</Grid>
	      	</Grid>
		</RllyContext.Provider>
	);
}