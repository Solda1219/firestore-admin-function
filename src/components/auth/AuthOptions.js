import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import TotalContext from "../../context/TotalContext";
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import {PathToFunction} from "../route.js";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(TotalContext);

  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData(()=>'');
    localStorage.setItem("logedinAdmin", "");
    history.push("/");
  };

  return (
    <>
      {userData!= '' ? (
        <Typography style={{marginRight: 50, marginTop: 15, cursor: 'pointer'}} onClick={logout} variant="h6" noWrap>
          Log out
        </Typography>
        
      ) : 
        (<>
          {/* <button onClick={register}>Register</button> */}
          <Typography style={{marginRight: 50, marginTop: 15}} variant="h6" noWrap>
            <Link to="/login">Log in</Link>
          </Typography>
          
        </>
      )}
    </>
  );
}
