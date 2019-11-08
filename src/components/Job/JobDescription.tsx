import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      marginTop: 16,
      paddingLeft: 0,
      paddingRight: 0
    }
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
      marginBottom: 4
    }
  },
  content: {
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    fontWeight: 400,
    color: theme.palette.text.primary,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  line: {
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("xs")]: {
      marginTop: 2,
      marginBottom: 2
    }
  },
  tags: {
    display: "flex",
    marginTop: 16
  },
  tag: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
    padding: 2,
    fontSize: 14,
    margin: 4,
    borderRadius: 4
  }
}));

interface Props {
  description: string;
  skillTags: Array<string>;
}

const JobDescription: React.FC<Props> = props => {
  const classes = useStyles();
  const { description, skillTags } = props;

  return (
    <div className={classes.container}>
      <div className={classes.title}>職位詳情</div>
      <div className={classes.content}>
        {description && description.trim().length > 0
          ? description.split("\n").map((item, i) => {
              return (
                <p className={classes.line} key={i}>
                  {item}
                </p>
              );
            })
          : "尚無詳情"}
      </div>
      <div className={classes.tags}>
        {skillTags.map((skill, index) => (
          <div className={classes.tag} key={index}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export { JobDescription };
