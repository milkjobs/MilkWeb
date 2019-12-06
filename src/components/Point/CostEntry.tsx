import { MembershipUsageEntry } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { mdiEyeCheckOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

const useStyles = makeStyles(theme => ({
  costCard: {
    display: "flex",
    flexDirection: "row",
    padding: 24,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: "solid"
  },
  costNameContainer: {
    flex: 2,
    display: "flex",
    flexDirection: "column"
  },
  costName: {
    fontSize: 18,
    color: theme.palette.text.primary,
    textAlign: "left"
  },
  recruiterName: {
    fontSize: 16,
    color: theme.palette.text.hint,
    marginTop: 4,
    textAlign: "left"
  },
  costNumberContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: "auto",
    alignItems: "flex-end"
  },
  viewNumber: {
    fontSize: 18,
    color: theme.palette.text.primary
  },
  costNumber: {
    fontSize: 16,
    marginTop: 4,
    color: theme.palette.text.hint
  },
  eyeCheckIcon: {
    marginLeft: 4,
    marginRight: 4,
    color: theme.palette.text.primary
  }
}));

interface CostEntryProps {
  entry: MembershipUsageEntry;
}

const CostEntry: React.FC<CostEntryProps> = props => {
  const { entry } = props;
  const classes = useStyles();

  return (
    <div className={classes.costCard}>
      <div className={classes.costNameContainer}>
        <div className={classes.costName}>{entry.name}</div>
        {entry.recruiterName && (
          <div className={classes.recruiterName}>{entry.recruiterName}</div>
        )}
      </div>
      <div className={classes.costNumberContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Icon
            className={classes.eyeCheckIcon}
            path={mdiEyeCheckOutline}
            size={0.7}
          />
          <div className={classes.viewNumber}>
            {entry.visitors ? entry.visitors.toLocaleString() : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export { CostEntry };
