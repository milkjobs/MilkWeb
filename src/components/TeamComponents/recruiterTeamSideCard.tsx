import { Team } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import Sticky from "react-stickynode";
import { TeamOfficialInfo, TeamWebsite } from "./";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      flexDirection: "column",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
      color: theme.palette.text.primary,
      paddingTop: 16,
      paddingBottom: 16,
      borderRadius: 4
    },
    removeButton: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 16,
      color: "white",
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 4,
      boxShadow: "none"
    }
  });
interface Props extends WithStyles<typeof styles>, Team {}

const RecruiterTeamSideCard: React.FC<Props> = props => {
  const { classes, website, name, unifiedNumber } = props;
  return (
    <div>
      <div style={{ height: "32px" }} />
      <Sticky top={32}>
        <div className={classes.card}>
          {website && <TeamWebsite website={website} />}
          {(name || unifiedNumber) && (
            <TeamOfficialInfo name={name} unifiedNumber={unifiedNumber} />
          )}
          <Button
            className={classes.removeButton}
            variant="contained"
            color="secondary"
          >
            刪除
          </Button>
        </div>
      </Sticky>
    </div>
  );
};

export default withStyles(styles)(RecruiterTeamSideCard);
