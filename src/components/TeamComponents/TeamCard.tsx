import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useAuth } from "stores";
import { Avatar, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import { DownloadApp, LoginDialog } from "components/Util";
import recruiterCover from "assets/recruiterCover.jpeg";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  loginAvatar: {
    width: 80,
    height: 80,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 16,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 16,
  },
  introduction: {
    maxWidth: 200,
    textAlign: "left",
    marginTop: 12,
    color: theme.palette.text.primary,
  },
  title: {
    marginTop: 12,
    color: theme.palette.text.hint,
  },
  text: {
    color: theme.palette.text.primary,
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    marginLeft: "auto",
  },
  blockPeriod: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: theme.palette.text.primary,
  },
  blockIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  blockDivider: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginRight: 8,
    marginLeft: 8,
  },
  applicantCover: {
    cursor: "pointer",
    width: 250,
    borderRadius: 8,
  },
}));

const TeamCard: React.FC = ({}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const history = useHistory();
  const [downloadAppOpen, setDownloadAppOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  if (!user) return <div />;

  return (
    <>
      {!user?.recruiterInfo?.team?.introduction && (
        <Alert
          severity="info"
          style={{ marginBottom: 8, maxWidth: 250, cursor: "pointer" }}
          onClick={() => history.push("/recruiter/team")}
        >
          {`完善公司的資訊，讓求職者更容易看到你！`}
        </Alert>
      )}
      <div className={classes.container}>
        <div className={classes.row}>
          <Avatar
            variant="square"
            src={user.recruiterInfo?.team?.logoUrl}
            className={classes.avatar}
          />
          <div className={classes.name}>
            {user.recruiterInfo?.team?.nickname}
          </div>
          <Link to={"/recruiter/team"} className={classes.link}>
            {"編輯"}
          </Link>
        </div>
        <div className={classes.row}>
          <LinesEllipsis
            className={classes.introduction}
            text={user.recruiterInfo?.team?.introduction || "尚無介紹"}
            maxLine="5"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
      </div>
      <img
        alt="logo"
        className={classes.applicantCover}
        src={recruiterCover}
        onClick={() => setDownloadAppOpen(true)}
      />
      <DownloadApp
        recruiterMode
        isOpen={downloadAppOpen}
        close={() => setDownloadAppOpen(false)}
      />
    </>
  );
};

export { TeamCard };
