import { PublicUser } from "@frankyjuang/milkapi-client";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { DownloadApp } from "components/Util";
import React, { useState } from "react";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    position: "fixed",
    bottom: 0,
    display: "none",
    flexDirection: "row",
    border: "1px solid #C8C8C8",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    marginLeft: "auto",
    borderRadius: 4,
    boxShadow: "none",
  },
  recruiterContainer: {
    display: "flex",
    alignItems: "center",
  },
  recruiterName: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  recruiterTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
}));

interface Props {
  recruiter: PublicUser;
}

const JobFooter: React.FC<Props> = (props) => {
  const { recruiter } = props;
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={classes.card}>
      <div className={classes.recruiterContainer}>
        <Avatar
          alt="recruiter profile image"
          src={recruiter.profileImageUrl}
          style={{ width: 30, height: 30, marginRight: 16 }}
        />
        <div>
          <div className={classes.recruiterName}>{recruiter.name}</div>
          <div className={classes.recruiterTitle}>{recruiter.title}</div>
        </div>
      </div>
      <div></div>
      <Button className={classes.button} onClick={() => setIsDialogOpen(true)}>
        下載App，立即詢問
      </Button>
      <DownloadApp isOpen={isDialogOpen} close={() => setIsDialogOpen(false)} />
    </div>
  );
};

export { JobFooter };
