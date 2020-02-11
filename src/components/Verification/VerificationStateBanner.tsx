import { VerificationState } from "@frankyjuang/milkapi-client";
import { Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "stores";

interface Props {
  showAction?: boolean;
}

const VerificationStateBanner: React.FC<Props> = ({ showAction }) => {
  const { user } = useAuth();
  const history = useHistory();
  const verificationState = user?.recruiterInfo?.team?.certificateVerified;

  if (verificationState === VerificationState.None) {
    return (
      <Alert
        severity="warning"
        action={
          showAction && (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                history.push("/recruiter/verification");
              }}
            >
              前往驗證
            </Button>
          )
        }
      >
        公司尚未驗證
      </Alert>
    );
  }

  if (verificationState === VerificationState.Processing) {
    return <Alert severity="info">公司驗證中</Alert>;
  }

  if (verificationState === VerificationState.Failed) {
    return (
      <Alert
        severity="error"
        action={
          showAction && (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                history.push("/recruiter/verification");
              }}
            >
              前往驗證
            </Button>
          )
        }
      >
        <AlertTitle>公司驗證失敗</AlertTitle>
        {user?.recruiterInfo?.team?.certificateVerificationReason || ""}
      </Alert>
    );
  }

  return null;
};

export { VerificationStateBanner };
