import React, { useState } from "react";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";

const suggestions: any[] = [];

const CssTextField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& label.Mui-focused": {
        color: theme.palette.primary.main
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: theme.palette.primary.main
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "hsl(0,0%,80%)"
        },
        "&:hover fieldset": {
          borderColor: theme.palette.primary.main
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.primary.main
        }
      }
    }
  })
)(TextField);

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <CssTextField
      fullWidth
      id="outlined-bare"
      variant="outlined"
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    paddingBottom: 8
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestionTitle: {
    display: "flex",
    marginBottom: 12,
    marginRight: "auto"
  },
  input: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    paddingRight: 12
  },
  errorMessage: {
    fontSize: "12px",
    color: "rgb(244, 67, 54)",
    marginRight: "auto",
    display: "flex"
  }
}));

function AutoSuggestion(props) {
  const { placeholder, errorMessage, inputDisabled = false } = props;
  const [value, setValue] = useState(props.value);
  const classes = useStyles();

  const handleChange = (event, { newValue }) => {
    props.onChange(event, { newValue });
    setValue(newValue);
  };

  const [stateSuggestions, setSuggestions] = useState<any>([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          placeholder: placeholder,
          value: value,
          onChange: handleChange,
          disabled: inputDisabled
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      {!!errorMessage && (
        <div className={classes.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}

export default AutoSuggestion;
