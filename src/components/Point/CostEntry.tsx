import { MembershipUsageEntry } from "@frankyjuang/milkapi-client";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@mdi/react";
import { mdiAlphaPCircleOutline } from "@mdi/js";
import { useTheme } from "stores";

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
  pointIcon: {
    marginTop: 6,
    marginLeft: 4,
    marginRight: 2,
    marginBottom: "auto",
    color: theme.palette.text.primary
  }
}));

interface CostEntryProps {
  entry: MembershipUsageEntry;
}

const CostEntry: React.FC<CostEntryProps> = props => {
  const { entry } = props;
  const classes = useStyles();
  const { theme } = useTheme();
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
            alignItems: "center"
          }}
        >
          <div className={classes.viewNumber}>
            {entry.visitors ? entry.visitors.toLocaleString() : 0}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div className={classes.costNumber}>{"-"}</div>
          <Icon
            className={classes.pointIcon}
            path={mdiAlphaPCircleOutline}
            size={0.7}
            color={theme.palette.text.hint}
          />
          <div className={classes.costNumber}>
            {entry.visitors ? entry.visitors.toLocaleString() : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export { CostEntry };
