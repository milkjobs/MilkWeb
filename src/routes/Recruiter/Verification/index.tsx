import { VerificationState } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import { DownloadAppDialog } from "components/Util";
import { VerificationStateBanner } from "components/Verification";
import { ImagePdfMimeType } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    fontSize: 18,
    marginTop: 40,
    marginBottom: 100
  },
  status: {
    marginTop: 32,
    fontWeight: 600
  },
  button: {
    marginTop: 16,
    marginRight: 16,
    maxWidth: 300
  }
}));

const Verification: React.FC = () => {
  const { user, getApi, reloadUser } = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const [isDownloadAppDialogOpen, setIsDownloadAppDialogOpen] = useState(false);

  const showDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(true);
  };

  const hideDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(false);
  };

  const upload = useCallback(
    async (files: File[] | FileList) => {
      if (files.length === 0) {
        return;
      }
      if (!user || !user.recruiterInfo || !user.recruiterInfo.team) {
        return;
      }

      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 5MB");
        return;
      }

      const teamApi = await getApi("Team");
      const [err] = await to(
        teamApi.uploadTeamCertificate({
          teamId: user.recruiterInfo.team.uuid,
          file,
          filename: file.name
        })
      );
      if (err) {
        toast.error("上傳失敗，請稍後再試");
        return;
      }
      toast.success("上傳成功");
      await reloadUser();
    },
    [getApi, reloadUser, user]
  );

  const team = user?.recruiterInfo?.team;

  useEffect(() => {
    if (team?.certificateVerified === VerificationState.Passed) {
      history.replace("/recruiter");
    }
  }, [history, team]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div style={{ marginBottom: 24 }}>
          {
            "根據就業服務法第 41 條，牛奶找工作需要保存公司的事業登記字號或個人的身分證字號。"
          }
          <br />
          <br />
          {"請"}
          <b>擇一</b>
          {"上傳以下文件："}
          <br />
          <br />
          {"• 營利事業登記證"}
          <br />
          {"• 統一編號配書"}
          <br />
          {"• 立案證書／開業執照"}
          <br />
          {"• 財政部／經濟部／市政府公函"}
          <br />
          {"• 有限公司設立／變更登記本"}
          <br />
          {"• 商業抄本"}
          <br />
          <br />
          {"【統一編號、公司名稱、公司地址】須清楚拍攝。"}
          <br />
          <br />
          {"若無法提供以上文件，可以上傳身分證正面照。身分證字號須清楚拍攝。"}
        </div>
        <VerificationStateBanner />
        {team?.certificateVerified !== VerificationState.Processing && (
          <>
            <input
              hidden
              accept={ImagePdfMimeType}
              id="upload-file"
              onChange={e => {
                e.target.files && upload(e.target.files);
              }}
              type="file"
            />
            <label htmlFor="upload-file">
              <Button
                className={classes.button}
                color={"primary"}
                component="span"
                variant={"contained"}
              >
                上傳
              </Button>
            </label>
          </>
        )}
        <Button
          className={classes.button}
          color={"primary"}
          variant={"contained"}
          onClick={showDownloadAppDialog}
        >
          下載App：審核通過後，App 內直接通知
        </Button>
      </div>
      <DownloadAppDialog
        isOpen={isDownloadAppDialogOpen}
        close={hideDownloadAppDialog}
      />
      <ToastContainer
        position={ToastPosition.BOTTOM_CENTER}
        draggable={false}
        hideProgressBar
        transition={Slide}
      />
    </div>
  );
};

export default Verification;
