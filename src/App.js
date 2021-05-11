import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PosContainer from "./components/pos/PosContainer";
import Administrators from "./components/admins";
import AdminCreate from "./components/admins/Create"
import AdminEdit from "./components/admins/Edit"
import Users from "./components/users";
import UserCreate from "./components/users/Create";
import UserEdit from "./components/users/Edit";
import Scores from "./components/scores";
import ScoreCreate from "./components/scores/Create";
import ScoreEdit from "./components/scores/Edit";
import Rllys from "./components/rllys";
import RllyCreate from "./components/rllys/Create";
import RllyEdit from "./components/rllys/Edit";
import TotalContext from "./context/TotalContext";
import { ToastProvider } from 'react-toast-notifications';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import GuaredAdmin from './GuaredAdmin';
import Firebase from 'firebase';
import firebaseConfig from './config';
import "./style.css";

// const MyCustomToast = ({ appearance, children }) => (
//   <div style={{ marginTop: '50px' }}>
//     {children}
//   </div>
// );
const requireLogin = (to, from, next) => {
  if (to.meta.auth) {
    if (localStorage.getItem('logedinAdmin')!== '') {
      next();
    }
    next.redirect('/login');
  } else {
    next();
  }
};

const requireRootAdmin = (to, from, next) => {
  if (to.meta.auth) {
    if (localStorage.getItem('logedinAdmin')== 'All') {
      next();
    }
    next.redirect('/login');
  } else {
    next();
  }
};



export default function App() {
  const [userData, setUserData] = useState(()=>localStorage.getItem('logedinAdmin'));

  
	const [editedUser, setEditedUser] = useState(()=>'');
  const [editedAdmin, setEditedAdmin] = useState(()=>'');
  const [editedScore, setEditedScore] = useState(()=>'');
  const [editedRlly, setEditedRlly] = useState(()=>'');
  
  const isRootAdmin= ()=>{
    if (localStorage.getItem('logedinAdmin')== 'All'){
      console.log("sdfasdf/, true");
      return true;
    }
    else{
      console.log("ll.false");
      return false;
    }
  }
  const isAdmin= ()=>{
    if (localStorage.getItem('logedinAdmin')!= ''){
      return true;
    }
    else{
      return false;
    }
  }
  return (
    <>
      <BrowserRouter>
        
        <TotalContext.Provider value={{ userData, setUserData, editedUser, setEditedUser, editedAdmin, setEditedAdmin, editedScore, setEditedScore, editedRlly, setEditedRlly }}>
          <Header />
          <ToastProvider placement= "bottom-right" >
          <div className="container">
            {/* <GuardProvider guards={[requireLogin, requireRootAdmin]}> */}
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                {/* <GuaredAdmin path="/register" component={Register} /> */}
                {/* <GuaredAdmin path= "/pos" component= {PosContainer} meta={{ auth: true }}/> */}
                <GuaredAdmin path= "/admins" component= {Administrators} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/admin/create" component= {AdminCreate} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/admin/edit" component= {AdminEdit} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/users" component= {Users} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/user/create" component= {UserCreate} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/user/edit" component= {UserEdit} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/scores" component= {Scores} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/score/create" component= {ScoreCreate} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/score/edit" component= {ScoreEdit} auth= {isRootAdmin()}/>
                <GuaredAdmin path= "/rllys" component= {Rllys} auth= {isAdmin()}/>
                <GuaredAdmin path= "/rlly/create" component= {RllyCreate} auth= {isAdmin()}/>
                <GuaredAdmin path= "/rlly/edit" component= {RllyEdit} auth= {isAdmin()}/>
                {/* <GuaredAdmin path= "/userEdit" component= {UserEdit} auth= {isAdmin}/>
                <GuaredAdmin path= "/userCreate" component= {UserCreate} auth= {isAdmin}/> */}
                
               
                
              </Switch>
            {/* </GuardProvider> */}
          </div>
          </ToastProvider>
        </TotalContext.Provider>
        
      </BrowserRouter>
    </>
  );
}
