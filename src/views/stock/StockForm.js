import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import deburr from 'lodash/deburr';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import _ from "lodash";
import Dashboard from "../layout/Dashboard";
import {SnackbarContentWrapper} from "../../components/SnackbarContentWrapper/SnackbarContentWrapper";

import { 
    withStyles,
    Button, 
    Paper, 
    TextField, 
    MenuItem, 
    Grow, 
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    FormHelperText,
    Snackbar
} from "@material-ui/core";

import { compose, graphql } from "react-apollo";
import listStockTypes from '../../queries/listStockTypes';
import createStock from "../../mutations/createStock";

import Sidebar from "./StockSidebar";

import { isAuthenticated, isToken } from "../../Auth";
import { transform } from 'async';


function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
  
    return (
      <TextField
        fullWidth
        InputProps={{
            inputRef: node => {
                ref(node);
                inputRef(node);
                },
          classes: {
            input: classes.input,
          },
        }}
        {...other}
      />
    );
  }
  
  function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
  
    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }
  
  function getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  const styles = theme => ({
    root: {
      height: 250,
      flexGrow: 1,
    },
    container: {
      position: 'relative',
    },
    suggestionsContainerOpen: {
      position: 'absolute',
      zIndex: 1000,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    suggestion: {
      display: 'block',
      textTransform: 'capitalize'
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
      textTransform: 'capitalize'
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
    snackbar: {
        margin: theme.spacing.unit,
    },
  });


class StockForm extends Component {

    state = {
        stockID: "",
        name: "",
        quantity: "",
        unit: "",
        valueType: "",
        value: "",
        agrigaterValue: "",
        suggestions: [],
        showError: false,
        errorMessage: "",
    }
    
	componentWillMount() {
		isToken(this);
	}

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    addStock(event) {

        console.log(this.state);

        if(!this.state.name) {
            this.setState({
                errorMessage: "You must enter a stock type before you can add a new stock."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.quantity) {
            this.setState({
                errorMessage: "You must enter a quantity before you can add a new stock."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.valueType) {
            this.setState({
                errorMessage: "You must enter a select a value to use before you can add a new stock."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.valueType) {
            this.setState({
                errorMessage: "You must enter a select a value to use before you can add a new stock."
            });
            this.showErrorHandle();
            return;
        } else if((this.state.valueType === "custom") && !this.state.value) {
            this.setState({
                errorMessage: "You must enter a custom value to use before you can add a new stock."
            });
            this.showErrorHandle();
            return;
        } 

        this.props.createStock({
            typeID: this.state.stockID,
            name: this.state.name,
            quantity : parseInt(this.state.quantity),
            ...(this.state.valueType === "custom" ? {value: parseFloat(this.state.value).toFixed(2)} : {})
        }).then(response => {
            this.props.history.replace("/stock");
        }).catch(err => {
            console.error(err);
            this.setState({
                errorMessage: "An application error has occured, cannot add a new stock at this time. Should this error persist, please report it."
            });
            this.showErrorHandle();
            return;
        });



    }

    componentWillReceiveProps(newProps){
        // Set Initial Values
        if(!newProps.data.loading){
            this.setState({
                stockType: newProps.data.listStockTypes ? newProps.data.listStockTypes[0].id : undefined
            });
        }
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value),
        });
    };
    
    handleSuggestionsClearRequested = () => {
        this.setState({
          suggestions: [],
        });
    };

    applySentenceCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    
    handleChangeSuggestion = n => (event, { newValue }) => {
        console.log("handleChangeSuggestion", this.applySentenceCase(newValue))

        const listStockTypes = this.props.data.listStockTypes || [];
        let stockID = "";
        let unit = "";
        let agrigaterValue = "";
        listStockTypes.forEach(stockType => {
            if(stockType.name === newValue) {
                stockID = stockType.id;
                unit = stockType.unit ? `(${stockType.unit})` : "";
                agrigaterValue = stockType.value ? `(£${stockType.value.toFixed(2)})` : "";
                console.log("agrigaterValue", stockType)
                this.setState({
                    valueType: "agrigater",
                });
            }
        })

        this.setState({
          name: this.applySentenceCase(newValue),
          stockID,
          unit,
          agrigaterValue,
        });
    };

    getSuggestions(value, suggestions) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        const listStockTypes = this.props.data.listStockTypes || [];
      
        return inputLength === 0
          ? []
          : listStockTypes.filter(suggestion => {
              const keep = count < 10 && suggestion.name.toLowerCase().indexOf(inputValue) !== -1;
      
              if (keep) {
                count += 1;
              }
      
              return keep;
            });
    }

    showErrorHandle = () => {
        this.setState({ showError: true });
    };
    
    hideErrorHandle = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ showError: false });
    };
    

    render() {
        
		isAuthenticated(this);

        const listStockTypes = this.props.data.listStockTypes || [];
        console.log("listStockTypes");
        console.log(listStockTypes);
        const { stockID, quantity, valueType } = this.state;
        const loaded = !this.props.data.loading;
        const { classes } = this.props;

        const autosuggestProps = {
            renderInputComponent,
            suggestions: this.state.suggestions,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            getSuggestionValue,
            renderSuggestion,
        };

        return (
            <Dashboard sidebar={<Sidebar />} history={this.props.history}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}
                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Add New Stock</h3>
                            <hr />
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <Autosuggest
                                        variant="outlined"
                                        {...autosuggestProps}
                                        inputProps={{
                                            classes,
                                            placeholder: 'Search for stock by typing here',
                                            value: this.state.name,
                                            onChange: this.handleChangeSuggestion('name'),
                                            variant: "outlined"
                                        }}
                                        theme={{
                                            container: classes.container,
                                            suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                            suggestionsList: classes.suggestionsList,
                                            suggestion: classes.suggestion,
                                        }}
                                        renderSuggestionsContainer={options => (
                                            <Paper {...options.containerProps} square>
                                            {options.children}
                                            </Paper>
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        type="number"
                                        fullWidth
                                        name="quantity"
                                        label={`Quantity ${this.state.unit}`}
                                        value={quantity}
                                        onChange={this.handleChange.bind(this)}
                                        required
                                        variant="outlined"
                                    />
                                </div>
                                <div className="form-group">
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Which value should be used?</FormLabel>
                                        <RadioGroup
                                            name="valueType"
                                            value={valueType}
                                            onChange={this.handleChange.bind(this)}
                                        >
                                            <FormControlLabel
                                                value="agrigater"
                                                control={<Radio color="primary" />}
                                                label={"Use Agrigater Value " + this.state.agrigaterValue}
                                                disabled={stockID ? false:true}
                                            />
                                            <FormHelperText>This will use agrigaters built in latest value for this stock type.</FormHelperText>
                                            <FormControlLabel
                                                value="custom"
                                                control={<Radio color="default"/>}
                                                label="Use Custom Value"
                                                disabled={this.state.name === "" ? true:false}
                                            />
                                            <FormHelperText>This will allow you to enter your own custom value for this stock type.</FormHelperText>
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                {valueType === "custom" ? 
                                <div className="form-group">
                                    <TextField
                                        type="number"
                                        fullWidth
                                        name="value"
                                        label="Custom value (£)"
                                        value={this.state.value}
                                        onChange={this.handleChange.bind(this)}
                                        variant="outlined"
                                    />
                                </div>
                                : null}
                                <div className="d-inline-flex flex-row-reverse w-100">
                                    <Button type="button" variant="contained" color="primary" onClick={this.addStock.bind(this)}>Submit</Button>
                                </div>
                            </form>
                        </div>
                    </Paper>
                </Grow>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.showError}
                    autoHideDuration={5000}
                    onClose={this.hideErrorHandle}
                    >
                    <SnackbarContentWrapper
                        variant="error"
                        className={classes.snackbar}
                        message={this.state.errorMessage}
                        onClose={this.hideErrorHandle}
                    />
                </Snackbar>

            </Dashboard>
        );
    }
}


export default withStyles(styles)(compose(
    graphql(listStockTypes),
    graphql(createStock, {
        props: props => ({
            createStock: stock => props.mutate({
                variables: stock
            })
        })
    })
)(StockForm));
