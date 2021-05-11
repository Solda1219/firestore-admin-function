import React, { useState, useEffect } from "react";
import Admins from "./Admins";
import Create from "./Create";
import Edit from "./Edit";
import ScoresTable from "./ScoresTable"
import AdminContext from "../../context/AdminContext";
import Axios from "axios";
import {PathToFunction} from "../route.js";

import {
  Grid
} from '@material-ui/core'

export default function AdminContainer() {
	const [admins, setAdmins] = useState(()=>[]);
  	const [filteredAdmins, setfilteredAdmins] = useState(()=> []);
	  const getAdminData = () => {
		Axios.get(PathToFunction+'/admins/getAll').then((response) => {
		  console.log(response.data.data);
		  setAdmins(response.data.data);
		}, (error) => {
		  console.log(error);
		});
	  }
	
	useEffect(() => {
		console.log("here is effect");
		getAdminData();
	},[]);
	return (
		<AdminContext.Provider value= {{admins, setAdmins, filteredAdmins, setfilteredAdmins}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={12} sm={12}>
	      			<Admins/>
	      		</Grid>
	      	</Grid>
		</AdminContext.Provider>
	);
}