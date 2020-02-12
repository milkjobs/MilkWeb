import {
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import React from "react";
import { AlertType } from "helpers";
import { useHistory } from "react-router";

interface Props {
  isOpen: boolean;
  type: AlertType;
  close: () => void;
}

const AlertDialog: React.FC<Props> = props => {
  const history = useHistory();
  const { isOpen, close, type } = props;

  return (
    <Dialog open={isOpen} onClose={close}>
      {type === AlertType.NotVerification && (
        <>
          <DialogContent>
            {"公司尚未驗證，職缺會暫時關閉。等公司驗證成功，可以再把職缺開放。"}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => history.push("/recruiter/verification")}
              color="primary"
            >
              前往驗證
            </Button>
          </DialogActions>
        </>
      )}
      {type === AlertType.NoResume && (
        <>
          <DialogContent>{"尚未上傳履歷"}</DialogContent>
          <DialogActions>
            <Button onClick={() => history.push("/resume")} color="primary">
              前往上傳
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export { AlertDialog };
