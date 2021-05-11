import React, { useContext} from "react";
import { useHistory } from "react-router-dom";
import PosContext from "../../context/PosContext";
import TotalContext from "../../context/TotalContext";
import ScoreContext from "../../context/ScoreContext";
import SearchBar from "material-ui-search-bar";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {PathToFunction} from "../route.js";


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'Image', numeric: false, disablePadding: false, label: 'Picture' },
  { id: 'ModifiedDate', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'Name', numeric: true, disablePadding: false, label: 'User' },
  { id: 'Rlly', numeric: true, disablePadding: false, label: 'RLLY' },
  { id: 'Score', numeric: true, disablePadding: false, label: 'Score' },
  { id: 'edit' },
  { id: 'delete' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const [searchWord, setSearchWord]= React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const { setScores, scores, setfilteredScores, filteredScores, rllys, setRllys, selectedRlly, setSelectedRlly}= useContext(ScoreContext);
  

  const changeRlly = (event) => {
    setSelectedRlly(event.target.value);
    if(event.target.value== "All"){
      Axios.get(PathToFunction+'/scores/getAll').then((response) => {
          console.log(response.data.data);
          setScores(response.data.data);
      }, (error) => {
        console.log(error);
      });
    }
    else{
      Axios.post(PathToFunction+'/scores/getWithRlly', {rlly: event.target.value}).then((response)=>{
        setScores(response.data.data);
        setfilteredScores(response.data.data);
      }, (error)=>{
        console.log(error);
      });
    }
  };
  
  if(searchWord=== ''){
  	setfilteredScores(scores);
  }
  const doFilterWith = (newValue)=> {
    setSearchWord(newValue);
  	setfilteredScores(scores.filter(score => String(score.ModifiedDate+score.Name+score.Rlly+score.Score).indexOf(String(searchWord))!==-1 ));
  }

  return (
    <Grid
    direction= "column"
    justify= "space-between"
    >
        <Toolbar
        className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
        })}
        >
        <Grid item xs={2}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Scores
            </Typography>
        </Grid>
        <Grid item xs= {2}>
          <FormControl >
            <InputLabel id="roleSlectLb">RLLY</InputLabel>
            <Select
                labelId="rlly"
                id="demo-simple-select"
                value={selectedRlly}
                onChange={changeRlly}
                >
                <MenuItem value= 'All'>All</MenuItem>
                  {rllys.map((rllyone)=>(
                    <MenuItem key= {rllyone} value={rllyone}>{rllyone}</MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        
        
        <Grid item xs= {6}>
        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <Grid item xs= {6}>
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Start date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                />
                </Grid>
                <Grid item xs= {6}>
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline2"
                label="End date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                />
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider> */}
        </Grid>
        <Grid item xs={2}>
        <SearchBar
            value= {searchWord}
            onChange={(newValue) => doFilterWith(newValue)}
        />
        
        </Grid>
        </Toolbar>
    </Grid>
  );
};



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
  const history = useHistory();

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  // const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const {setScores, scores, setfilteredScores, filteredScores}= useContext(PosContext);
  const {editedScore, setEditedScore} = useContext(TotalContext);
  const { setScores, scores, setfilteredScores, filteredScores}= useContext(ScoreContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleEdit = (event, filteredScore) => {
    console.log(filteredScore);
    setEditedScore(filteredScore);
    history.push("/score/edit");
  }

  const deleteScore= (userId, rlly, date)=>{
    Axios.post(PathToFunction+'/score/delete', {userId: userId, rlly: rlly, date: date}).then((response)=>{
      setScores(response.data.data);
      setfilteredScores(response.data.data);
    }, (error)=>{
      console.log(error);
    });
  }
  const handleDelete = (event, filteredScore) => {
    console.log(filteredScore);
    deleteScore(filteredScore.Uid, filteredScore.Rlly, filteredScore.ScoreDate);
  }

  const handleCreate= ()=>{
    history.push("/score/create");
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredScores.length - page * rowsPerPage);
  

  return (
    <div className={classes.root}>
      <Button onClick={() => handleCreate()} variant="contained" color="primary" style= {{marginBottom: 10}}>
          +Create
      </Button>
      <Paper className={classes.paper}>
        
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredScores.length}
            />
            <TableBody>
              {stableSort(filteredScores, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((filteredScore, index) => {

                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      // onClick={(event) => handleEdit(event, filteredScore)}
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell p={1}>
                        {filteredScore.Image!= null?'Yes':'No'}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="filteredScore" padding="none">
                        {filteredScore.ModifiedDate}
                      </TableCell>
                      <TableCell align="right">{filteredScore.Name}</TableCell>
                      <TableCell align="right">{filteredScore.Rlly}</TableCell>
                      <TableCell align="right">{filteredScore.Score}</TableCell>
                      <TableCell
                        onClick={(event) => handleEdit(event, filteredScore)
                        } align= "right"><BorderColorIcon/></TableCell>
                      <TableCell
                        onClick= {(event) => handleDelete(event, filteredScore)}
                        align= "right"><DeleteIcon/></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredScores.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
