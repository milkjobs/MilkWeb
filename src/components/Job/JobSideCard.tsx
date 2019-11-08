import { PublicUser } from "@frankyjuang/milkapi-client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Message from "@material-ui/icons/Message";
import Visibility from "@material-ui/icons/Visibility";
import { DownloadAppDialog } from "components/Util";
import React, { useState } from "react";
import Sticky from "react-stickynode";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #C8C8C8",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
    borderRadius: 4
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    width: "100%",
    marginTop: 8,
    color: theme.palette.common.white,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4,
    boxShadow: "none"
  },
  review: {
    marginTop: 4,
    display: "flex",
    fontSize: 14,
    fontWeight: 400,
    color: "#484848"
  },
  recruiterContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 12
  },
  recruiterName: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    color: theme.palette.text.primary
  },
  recruiterTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  jobInfoContainer: {
    display: "flex",
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: "solid"
  },
  jobInfoContent: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  jobInfoIcon: {
    width: 14,
    height: 14,
    color: theme.palette.text.secondary
  }
}));

interface Props {
  jobId: string;
  recruiter: PublicUser;
}

const JobSideCard: React.FC<Props> = props => {
  const { recruiter } = props;
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showDownloadAppDialog = () => {
    setIsDialogOpen(true);
  };

  const hideDownloadAppDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div style={{ height: "32px" }}></div>
      <Sticky top={32}>
        <div className={classes.card}>
          <div className={classes.jobInfoContainer}>
            <Visibility className={classes.jobInfoIcon} />
            <div className={classes.jobInfoContent}>{"1000"}</div>
            <Message className={classes.jobInfoIcon} />
            <div className={classes.jobInfoContent}>{"200"}</div>
          </div>
          <div className={classes.recruiterContainer}>
            <Avatar
              src={recruiter.profileImageUrl}
              style={{ width: 30, height: 30, marginRight: 16 }}
            />
            <div>
              <div className={classes.recruiterName}>{recruiter.name}</div>
              <div className={classes.recruiterTitle}>{recruiter.title}</div>
            </div>
          </div>
          <Button className={classes.button} onClick={showDownloadAppDialog}>
            立即詢問
          </Button>
        </div>
      </Sticky>
      <DownloadAppDialog isOpen={isDialogOpen} close={hideDownloadAppDialog} />
    </div>
  );
};

export { JobSideCard };
