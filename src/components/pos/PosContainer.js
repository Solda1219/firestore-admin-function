import React, { useState, useEffect } from "react";
import PosProduct from "./PosProduct";
import PosPrice from "./PosPrice";
import PosContext from "../../context/PosContext";
import Axios from "axios";
import Firebase from 'firebase';
import "firebase/database";

import {
  Grid
} from '@material-ui/core'

export default function PosContainer() {
	const [users, setUsers] = useState(
		[]
	);

	const [filteredUsers, setfilteredUsers] = useState([]);
	
	// function writeUserData(userId, firstname, lastname, email) {
	// 	Firebase.database().ref('/users/'+userId).set({
	// 	  id: userId,
	// 	  firstname: firstname,
	// 	  lastname: lastname,
	// 	  email: email
	// 	});
	// }
	// const getUserData = () => {
	// 	let ref = Firebase.database().ref('/users');
	// 	ref.on('value', snapshot => {
	// 		console.log(snapshot.val());
	// 		if(snapshot.val()!= null){
	// 			console.log("really??");
	// 			setUsers(snapshot.val());
	// 		}
			
	// 	});
	// 	console.log('DATA RETRIEVED');
	// }
	useEffect(() => {
		console.log("here is effect");
		// writeUserData(1, "john", "Doe", "john@c.com");
		// writeUserData(2, "john2", "Doe2", "john2@c.com");
	    // getUserData();
  	}, []);
	return (
		<PosContext.Provider value= {{users, setUsers, filteredUsers, setfilteredUsers}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={12} sm={12}>
	      			<PosProduct/>
	      		</Grid>
	      		{/* <Grid item xs={4} sm= {4}>
	      			<PosPrice/>
	      		</Grid> */}
	      	</Grid>
		</PosContext.Provider>
	);
}