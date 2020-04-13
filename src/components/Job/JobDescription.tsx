import { Tag } from "@frankyjuang/milkapi-client";
import { Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
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
  content: {
    display: "flex",
    flexDirection: "column",
    fontSize: 16,
    fontWeight: 400,
    color: theme.palette.text.primary,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  line: {
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down("xs")]: {
      marginTop: 2,
      marginBottom: 2,
    },
  },
  tags: {
    display: "flex",
    marginTop: 16,
    flexWrap: "wrap",
  },
}));

interface Props {
  description: string;
  tags?: Tag[];
}

const JobDescription: React.FC<Props> = ({ description, tags }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>介紹</div>
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
      {tags && (
        <div className={classes.tags}>
          {tags.map((tag) => (
            <Chip
              key={tag.uuid}
              variant="outlined"
              label={tag.label}
              style={{ margin: 4 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { JobDescription };
