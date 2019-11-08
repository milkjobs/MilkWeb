import { Team } from "@frankyjuang/milkapi-client";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import { TeamOfficialInfo, TeamWebsite } from "components/TeamComponents";
import React from "react";
import Sticky from "react-stickynode";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
      color: theme.palette.text.primary,
      paddingTop: 16,
      paddingBottom: 16,
      borderRadius: 4
    }
  });
interface Props extends WithStyles<typeof styles>, Team {}

const TeamSideCard: React.FC<Props> = props => {
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
        </div>
      </Sticky>
    </div>
  );
};

export default withStyles(styles)(TeamSideCard);
