import { Team } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React, { useState } from "react";
import Sticky from "react-stickynode";
import { TeamOfficialInfo, TeamWebsite, TeamEditForm } from "./";
import { useAuth } from "stores";

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
interface Props extends WithStyles<typeof styles> {
  team: Team;
}

const RecruiterTeamSideCard: React.FC<Props> = props => {
  const { user } = useAuth();
  const { classes, team } = props;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  return (
    <div>
      <div style={{ height: "32px" }} />
      <Sticky top={32}>
        <div className={classes.card}>
          {team.website && <TeamWebsite website={team.website} />}
          {(team.name || team.unifiedNumber) && (
            <TeamOfficialInfo
              name={team.name}
              unifiedNumber={team.unifiedNumber}
            />
          )}
          {user && user.recruiterInfo && user.recruiterInfo.isAdmin && (
            <Button
              className={classes.removeButton}
              variant="contained"
              color="secondary"
              onClick={handleEditDialogOpen}
            >
              編輯
            </Button>
          )}
        </div>
      </Sticky>
      <TeamEditForm
        open={editDialogOpen}
        handleClose={handleEditDialogClose}
        team={team}
      />
    </div>
  );
};

export default withStyles(styles)(RecruiterTeamSideCard);
