import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import {     withStyles,
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
import {SnackbarContentWrapper} from "../../components/SnackbarContentWrapper/SnackbarContentWrapper";
import deburr from 'lodash/deburr';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import _ from "lodash";
import Dashboard from "../layout/Dashboard";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import Sidebar from "./LivestockSidebar";
import { isAuthenticated, isToken } from "../../Auth";

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

    let searchString = _.capitalize(suggestion.breed) + " - " + _.capitalize(suggestion.gender);

    const matches = match(searchString, query);
    const parts = parse(searchString, matches);

    return (
        <MenuItem selected={isHighlighted} component="div">
        <div>
            {parts.map((part, index) =>
            part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
                </span>
            ) : (
                <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
                </strong>
            ),
            )}
        </div>
        </MenuItem>
    );
};

function getSuggestionValue(suggestion) {
    return suggestion;
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
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});


class LivestockForm extends Component {

    state = {
        animalID: "",
        animal: "",
        quantity: "",
        unit: "",
        valueType: "",
        value: "",
        agrigaterValue: "",
        single: '',
        popper: '',
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

    showErrorHandle = () => {
        this.setState({ showError: true });
    };

    addAnimal(event) {

        if(!this.state.animal) {
            this.setState({
                errorMessage: "You must enter an animal type before you can add a new animal."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.quantity) {
            this.setState({
                errorMessage: "You must enter a quantity before you can add a new animal."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.valueType) {
            this.setState({
                errorMessage: "You must enter a select a value to use before you can add a new animal."
            });
            this.showErrorHandle();
            return;
        } else if(!this.state.valueType) {
            this.setState({
                errorMessage: "You must enter a select a value to use before you can add a new animal."
            });
            this.showErrorHandle();
            return;
        } else if((this.state.valueType === "custom") && (!this.state.value || isNaN(this.state.value))) {
            this.setState({
                errorMessage: "You must enter a custom value to use before you can add a new animal."
            });
            this.showErrorHandle();
            return;
        } 

        this.props.createAnimal({
            typeID: this.state.animalID,
            name: this.state.animal,
            quantity: Number(this.state.quantity),
            value: parseFloat(this.state.value).toFixed(2)
        }).then(response => {
            this.props.history.replace("/livestock");
        }).catch(err => {
            this.setState({
                errorMessage: "An application error has occured, cannot add a new animal at this time. Should this error persist, please report it."
            });
            this.showErrorHandle();
            return;
        });

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

      handleChangeSuggestion = n => (event, { newValue }) => {

        const listAnimalTypes = this.props.data.listAnimalTypes || [];
        let animalID = "";
        let animal = newValue;
        let agrigaterValue = "";
        let value = "";

        if(typeof animal === "object") {
            listAnimalTypes.forEach(animalType => {
                if(animalType.id === newValue.id) {
                    animalID = animalType.id;
                    animal = _.capitalize(animalType.breed) + " - " + _.capitalize(animal.gender);
                    agrigaterValue = animalType.value ? `(£${animalType.value.toFixed(2)})` : "";
                    value = animalType.value.toFixed(2);
                    this.setState({
                        valueType: "agrigater",
                    });
                }
            });
        }

        this.setState({
            agrigaterValue,
            animalID,
            animal,
            value
        });
    };
    
      getSuggestions(value, suggestions) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        const listAnimalTypes = this.props.data.listAnimalTypes || [];
    
        return inputLength === 0 ? [] : listAnimalTypes.filter(suggestion => {

            let searchString = suggestion.breed + " - " + suggestion.gender;

            const keep = count < 10 && searchString.toLowerCase().indexOf(inputValue) !== -1;

            if (keep) {
                count += 1;
            }
    
            return keep;
        });
    }

    hideErrorHandle = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ showError: false });
    };

    render() {
        
        isAuthenticated(this);

        const { quantity, valueType, animalID } = this.state;
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
            <Dashboard sidebar={<Sidebar />}  history={this.props.history}>

                {!loaded ? <CircularProgress style={{marginLeft: "calc(50% - 50px)", marginTop: "200px"}} size={50} /> : null}

                <Grow in={loaded}>
                    <Paper className="offset-md-2 col-md-8 offset-lg-4 col-lg-4">
                        <div className="card-body">
                            <h3 className="card-title">Add New Animal</h3>
                            <hr />
                            <form>
                                <div className="form-group">
                                    <Autosuggest
                                        variant="outlined"
                                        {...autosuggestProps}
                                        inputProps={{
                                            classes,
                                            placeholder: 'Search for the animal you want to add by typing here',
                                            value: this.state.animal,
                                            onChange: this.handleChangeSuggestion('animal'),
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
                                        label="Animal Quantity"
                                        value={quantity}
                                        onChange={this.handleChange.bind(this)}
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
                                                disabled={animalID ? false:true}
                                            />
                                            <FormHelperText>This will use agrigaters built in latest value for this stock type.</FormHelperText>
                                            <FormControlLabel
                                                value="custom"
                                                control={<Radio color="default"/>}
                                                label="Use Custom Value"
                                                disabled={this.state.animal === "" ? true:false}
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
                                <Button variant="contained" color="primary" onClick={this.addAnimal.bind(this)}>Submit</Button>
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
    graphql(gql`
        query {
            listAnimalTypes {
                id
                type
                breed
                gender
                value
            }
        }
    `),
    graphql(gql`
        mutation createAnimal($typeID: ID, $quantity: Int!, $name: String, $value: Float){
            createAnimal(input: {typeID: $typeID, quantity: $quantity, name: $name, value: $value}) {
                id
            }
        }
    `, {
        props: props => ({
            createAnimal: animal => props.mutate({
                variables: animal
            })
        })
    })
)(LivestockForm));
