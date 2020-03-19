import { Job } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import Sticky from "react-stickynode";
import { useAuth } from "stores";
import { JobEditForm } from ".";

const useStyles = makeStyles((theme: Theme) => ({
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
    boxShadow: "none",
    marginTop: 8,
    marginBottom: 8,
    width: "100%",
    color: "white",
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4
  },
  publishButton: {
    backgroundColor: theme.palette.secondary.main
  },
  loadingButton: {
    backgroundColor: theme.palette.text.hint
  },
  removeButton: {
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
    color: "white",
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4,
    boxShadow: "none"
  },
  analysisContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8
  }
}));

interface Props {
  job: Job;
}

const PositionSideCard: React.FC<Props> = props => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [job, setJob] = useState(props.job);
  const [publishLoading, setPublishLoading] = useState(false);

  const publishToggle = async () => {
    setPublishLoading(true);
    const jobApi = await getApi("Job");
    const updatedJob = await jobApi.updateJob({
      jobId: job.uuid,
      job: { ...job, published: !job.published }
    });
    setJob(updatedJob);
    setPublishLoading(false);
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  return (
    <div>
      <div style={{ height: "32px" }} />
      <Sticky top={32}>
        <div className={classes.card}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleEditDialogOpen}
          >
            編輯職缺
          </Button>
          {publishLoading ? (
            <Button
              className={`${classes.button} ${classes.loadingButton}`}
              variant="contained"
              color="primary"
            >
              處理中
            </Button>
          ) : job.published ? (
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={publishToggle}
            >
              關閉職缺
            </Button>
          ) : (
            <Button
              className={`${classes.button} ${classes.publishButton}`}
              variant="contained"
              color="primary"
              onClick={publishToggle}
            >
              開放職缺
            </Button>
          )}
        </div>
      </Sticky>
      <JobEditForm
        open={editDialogOpen}
        handleClose={handleEditDialogClose}
        job={props.job}
      />
    </div>
  );
};

export { PositionSideCard };
