import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import RllyTab from './RllyTab';
import WaypointsTab from './WaypointsTab';
import ScoresTable from './ScoresTable';
import {PathToFunction} from "../route.js";
import TotalContext from "../../context/TotalContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`} 
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,

  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { editedRlly, setEditedRlly} = useContext(TotalContext);
  return (
    <Container component="main" maxWidth="sm" className={classes.root}>
      {/* <AppBar position="static"> */}
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="RLLY" {...a11yProps(0)} />
          <Tab label="Waypoints" {...a11yProps(1)} />
          {/* <Tab label="Scores" {...a11yProps(2)} /> */}
        </Tabs>
      {/* </AppBar> */}
      <TabPanel value={value} index={0}>
        <RllyTab type= "create"/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <WaypointsTab type= "create"/>
      </TabPanel>
      {/* <TabPanel value={value} index={2} maxWidth="md">
        <ScoresTable editedRlly= {editedRlly} />
      </TabPanel> */}
    </Container>
  );
}