import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import Sticky from "react-stickynode";
import { useAuth } from "stores";

const useStyles = makeStyles(() => ({
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
    width: "100%",
    color: "white",
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4
  },
  removeButton: {
    width: "100%",
    marginTop: 16,
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

const RecruiterJobSideCard: React.FC = () => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);

  const removeJob = async () => {
    const jobApi = await getApi("Job");
    await jobApi.removeJob({ jobId: params.id });
    history.push("/recruiter");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div style={{ height: "32px" }} />
      <Sticky top={32}>
        <div className={classes.card}>
          {/* <div className={classes.analysisContainer}>
                <div style={{ flex: 1 }}>100人查看過</div>
                <div style={{ flex: 1 }}>20人詢問過</div>
                <div style={{ flex: 1 }}>5人投履歷</div>
              </div> */}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
          >
            暫時下線
          </Button>
          <Button
            className={classes.removeButton}
            onClick={handleOpen}
            variant="contained"
            color="secondary"
          >
            刪除
          </Button>
        </div>
      </Sticky>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ marginTop: 16, marginBottom: 16 }}>
          你確定要刪除這個職缺嗎？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            style={{
              boxShadow: "none"
            }}
            onClick={() => {
              handleClose();
              removeJob();
            }}
            variant="contained"
            color="secondary"
            autoFocus
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { RecruiterJobSideCard };
