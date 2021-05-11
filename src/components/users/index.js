import React, { useState, useEffect } from "react";
import Users from "./Users";
import Create from "./Create";
import Edit from "./Edit";
import ScoresTable from "./ScoresTable"
import UserContext from "../../context/UserContext";
import Axios from "axios";
import {PathToFunction} from "../route.js";

import {
  Grid
} from '@material-ui/core'

export default function UserContainer() {
	const [users, setUsers] = useState(()=>[]);
  	const [filteredUsers, setfilteredUsers] = useState(()=> []);
	  const getUserData = () => {
		Axios.get(PathToFunction+'/users/getAll').then((response) => {
		  console.log(response.data.data);
		  setUsers(response.data.data);
		}, (error) => {
		  console.log(error);
		});
	  }
	
	useEffect(() => {
		console.log("here is effect");
		getUserData();
	},[]);
	return (
		<UserContext.Provider value= {{users, setUsers, filteredUsers, setfilteredUsers}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={12} sm={12}>
	      			<Users/>
	      		</Grid>
	      	</Grid>
		</UserContext.Provider>
	);
}