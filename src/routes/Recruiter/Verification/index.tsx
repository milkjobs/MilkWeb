import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import { DownloadAppDialog } from "components/Util";
import { ImagePdfMimeType } from "helpers";
import React, { useCallback, useState } from "react";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "stores";
import { VerificationState } from "@frankyjuang/milkapi-client";

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
    marginTop: 32
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

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div>
          {"根據就業服務法第 41 條，牛奶找工作需要保存公司的事業登記字號。"}
        </div>
        <div>{"可以上傳以下文件："}</div>
        <div>
          {"1. 營利事業登記證"}
          <br />
          {"2. 統一編號配書 "}
          <br />
          {"3. 立案證書／開業執照"}
          <br />
          {"4. 財政部／經濟部／市政府公函"}
          <br />
          {"5. 有限公司設立／變更登記本"}
          <br />
          {"6. 商業抄本"}
          <br />
          {"【統編、公司名稱、公司地址】須清楚拍攝。"}
        </div>
        <div>
          {user &&
            user.recruiterInfo &&
            user.recruiterInfo.team &&
            user.recruiterInfo.team.certificateVerified ===
              VerificationState.Processing && (
              <div className={classes.status}>{"審核中"}</div>
            )}
          {user &&
            user.recruiterInfo &&
            user.recruiterInfo.team &&
            user.recruiterInfo.team.certificateVerified ===
              VerificationState.Failed && (
              <div className={classes.status}>
                {"審核失敗：" +
                  user.recruiterInfo.team.certificateVerificationReason}
              </div>
            )}
          <input
            hidden
            accept={ImagePdfMimeType}
            id="contained-button-file"
            onChange={e => {
              e.target.files && upload(e.target.files);
            }}
            type="file"
          />
          <label htmlFor="contained-button-file">
            <Button
              className={classes.button}
              color={"primary"}
              component="span"
              variant={"contained"}
            >
              上傳
            </Button>
          </label>
          <Button
            className={classes.button}
            color={"primary"}
            variant={"contained"}
            onClick={showDownloadAppDialog}
          >
            下載App，體驗更完善功能
          </Button>
        </div>
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
