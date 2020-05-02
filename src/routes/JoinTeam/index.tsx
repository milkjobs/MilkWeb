import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import qs from "qs";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "stores";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

interface InvitationData {
  teamId: string;
  code: string;
  expiresTime: number;
}

const JoinTeam: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { user, getApi, reloadUser } = useAuth();

  useEffect(() => {
    const join = async () => {
      if (!user) {
        return;
      }

      const data: Partial<InvitationData> = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      if (!data.expiresTime || !data.code || !data.teamId) {
        toast.error("錯誤的邀請");
        history.push("/");
        return;
      }

      if (user.recruiterInfo) {
        if (user.recruiterInfo.team) {
          if (user.recruiterInfo.team.uuid === data.teamId) {
            toast.success(`成功加入${user.recruiterInfo.team.nickname}`);
          } else {
            toast.error(
              `加入失敗，已經是${user.recruiterInfo.team.nickname}的成員。\n可以退出或刪除原本的公司，再重新點此連結。\n若有任何問題，可以在訊息私訊牛奶找工作官方帳號。`
            );
          }
        }
        history.push("/recruiter");
        return;
      }

      if (data.expiresTime < new Date().getTime()) {
        toast.error("邀請已過期");
        history.push("/");
        return;
      }

      const teamApi = await getApi("Team");
      const [err] = await to(
        teamApi.joinTeam({
          teamId: data.teamId,
          userId: user.uuid,
          inviteCode: data.code,
        })
      );
      if (err) {
        toast.error("錯誤的邀請");
        history.push("/");
      } else {
        await reloadUser();
      }
    };

    join();
  }, [getApi, history, location.search, reloadUser, user]);

  return (
    <div className={classes.root}>
      <Header />
    </div>
  );
};

export default JoinTeam;
