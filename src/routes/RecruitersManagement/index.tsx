import { PublicRecruiter } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import moment from "moment";
import "moment/locale/zh-tw";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import { Dialog, Button, DialogContent } from "@material-ui/core";
import QRCode from "qrcode.react";
moment.locale("zh-tw");

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
    width: 960,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    marginBottom: 100
  },
  recruiterCard: {
    display: "flex",
    width: "100%",
    flexDrection: "row",
    padding: 12,
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: "solid"
  },
  recruiterName: {
    display: "flex",
    flexDirection: "column"
  },
  button: {
    marginTop: 16,
    marginRight: 16,
    maxWidth: 300
  },
  qrcode: {
    marginTop: 16,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const RecruitersManagement: React.FC = () => {
  const { getApi, user } = useAuth();
  const classes = useStyles();
  const [recruiters, setRecruiters] = useState<PublicRecruiter[]>([]);
  const [qrCodeData, setQrCodeData] = useState<string>();
  const [qrCodeShow, setQrCodeShow] = useState(false);

  const getInvitationCode = async () => {
    if (user && user.recruiterInfo && user.recruiterInfo.team) {
      const teamApi = await getApi("Team");
      const invitation = await teamApi.generateInvitation({
        teamId: user.recruiterInfo.team.uuid
      });
      const data = JSON.stringify({
        teamId: user.recruiterInfo.team.uuid,
        code: invitation.code,
        expiresTime: invitation.expiresAt.getTime()
      });
      setQrCodeData(data);
      setQrCodeShow(true);
    }
  };

  useEffect(() => {
    const getTeamRecruiters = async () => {
      if (user && user.recruiterInfo && user.recruiterInfo.team) {
        const teamApi = await getApi("Team");
        const fetchedTeamRecruiters = await teamApi.getTeamRecruiters({
          teamId: user.recruiterInfo.team.uuid
        });
        fetchedTeamRecruiters && setRecruiters(fetchedTeamRecruiters);
      }
    };

    getTeamRecruiters();
  }, [getApi, user]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {recruiters.map((r, i) => (
          <div key={i} className={classes.recruiterCard}>
            <div className={classes.recruiterName}>
              <div>{r.name}</div>
              <div>{r.title}</div>
            </div>
            <div>{r.isAdmin ? "管理員" : "人資"}</div>
          </div>
        ))}
        <Button
          className={classes.button}
          color={"primary"}
          variant={"contained"}
          onClick={getInvitationCode}
        >
          新增成員
        </Button>
        <Dialog open={qrCodeShow} onClose={() => setQrCodeShow(false)}>
          <DialogContent>
            <div>{"1. 從 App Store/Google Play 安裝【牛奶找工作】"}</div>
            <div>{"2. 點選下方 我的 》發布職缺 》掃描加入"}</div>
            <div className={classes.qrcode}>
              <QRCode size={256} level="Q" value={qrCodeData || ""} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RecruitersManagement;
