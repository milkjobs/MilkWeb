import { MembershipUsage } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { CostEntry } from "components/Point";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

const Usage: React.FC = () => {
  const { getApi, user } = useAuth();
  const classes = useStyles();
  const [membershipUsage, setMembershipUsage] = useState<MembershipUsage>();

  useEffect(() => {
    const getTeamMemberShip = async () => {
      if (user && user.recruiterInfo && user.recruiterInfo.team) {
        const membershipApi = await getApi("Membership");
        const now = new Date();
        const startTime = new Date();
        startTime.setDate(now.getDate() - 30);
        const membershipUsage = await membershipApi.getTeamMembershipUsage({
          teamId: user.recruiterInfo.team.uuid,
          startTime,
        });
        setMembershipUsage(membershipUsage);
      }
    };

    getTeamMemberShip();
  }, [getApi, user]);

  return (
    <div className={classes.root}>
      {membershipUsage && (
        <CostEntry
          entry={{
            name: "全部職缺",
            visitors: membershipUsage.totalVisitors,
          }}
        />
      )}
      {membershipUsage &&
        membershipUsage.entries.map((e) => (
          <CostEntry key={`${e.name}${e.recruiterName}`} entry={e} />
        ))}
    </div>
  );
};

export default Usage;
