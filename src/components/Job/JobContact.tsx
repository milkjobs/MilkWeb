import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  title: {
    flex: 1,
    marginRight: "auto",
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.text.primary,
    marginBottom: 8,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginBottom: 4,
    },
  },
  description: {
    alignItems: "center",
    color: theme.palette.text.primary,
    display: "flex",
    flex: 1,
    fontSize: 16,
    justifyContent: "center",
    marginBottom: 16,
    marginRight: "auto",
    wordBreak: "break-all",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
}));

interface Props {
  contact: string;
}

const JobContact: React.FC<Props> = ({ contact }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>聯絡方式</div>
      <div className={classes.description}>{contact}</div>
    </div>
  );
};

export { JobContact };
