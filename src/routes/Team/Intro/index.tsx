import { Team as TeamType } from "@frankyjuang/milkapi-client";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  TeamDescription,
  TeamLocation,
  TeamOfficialInfo,
  TeamSideCard,
  TeamWebsite
} from "components/TeamComponents";
import { webConfig } from "config";
import { BreadcrumbListStructuredData } from "helpers";
import React from "react";
import urljoin from "url-join";

const useStyles = makeStyles(theme => ({
  sideCard: {
    flex: 1,
    marginLeft: 8,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }
}));

interface Props {
  team: TeamType;
}

const Intro: React.FC<Props> = ({ team }) => {
  const classes = useStyles();
  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <BreadcrumbListStructuredData
        breadcrumbs={[
          {
            name: team.name,
            url: urljoin(webConfig.basePath, "team", team.uuid)
          },
          {
            name: "公司介紹",
            url: urljoin(webConfig.basePath, "team", team.uuid, "intro")
          }
        ]}
      />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 2, paddingBottom: 24 }}>
          <TeamDescription introduction={team.introduction} />
          <TeamLocation address={team.address} />
          {smMatches && team.website && <TeamWebsite website={team.website} />}
          {smMatches && (
            <TeamOfficialInfo
              name={team.name}
              unifiedNumber={team.unifiedNumber}
            />
          )}
        </div>
        <div className={classes.sideCard}>
          <TeamSideCard {...team} />
        </div>
      </div>
    </>
  );
};

export default Intro;
