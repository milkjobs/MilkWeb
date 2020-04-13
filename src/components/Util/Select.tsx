import MenuItem from "@material-ui/core/MenuItem";
import NoSsr from "@material-ui/core/NoSsr";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    paddingBottom: 8,
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto",
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: "absolute",
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
  errorMessage: {
    fontSize: "12px",
    color: "rgb(244, 67, 54)",
    marginRight: "auto",
    display: "flex",
  },
}));

const NoOptionsMessage: React.FC<any> = (props) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const Option: React.FC<any> = (props) => {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
};

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
};

const Placeholder: React.FC<any> = (props) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

const ValueContainer: React.FC<any> = (props) => {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
};

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

const Menu: React.FC<any> = (props) => {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
};

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object,
};

const components = {
  Menu,
  NoOptionsMessage,
  Option,
};

function FieldSelect(props) {
  const { errorMessage } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [single, setSingle] = useState(props.value);

  function handleChangeSingle(value) {
    setSingle(value);
    props.handleChange(value);
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
    control: (base) => ({
      ...base,
      paddingTop: 7,
      paddingBottom: 7,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      margin: 2,
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(162, 162,162)",
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{
            label: "Country",
            InputLabelProps: {
              htmlFor: "react-select-single",
              shrink: true,
            },
            placeholder: props.placeholder,
          }}
          placeholder={props.placeholder}
          options={props.options}
          components={components}
          value={single}
          isSearchable={false}
          onChange={handleChangeSingle}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "#69C0FF",
            },
          })}
        />
      </NoSsr>
      {!!errorMessage && (
        <div className={classes.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}

export default FieldSelect;
