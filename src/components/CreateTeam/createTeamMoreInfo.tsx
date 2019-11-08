import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import AutoSuggestion from "components/Util/AutoSuggestion";
import CreateTeamFooter from "./createTeamFooter";
import { Team } from "@frankyjuang/milkapi-client";

const CreateTeamMoreInfo: React.FC<Props> = props => {
  const { team } = props;
  const [website, setWebsite] = useState(team.website);
  const onDrop = files => {};
  const { classes, history } = props;
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>讓求職者更了解你的公司</span>
          </div>

          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司網頁(選填)</div>
            <AutoSuggestion
              value={website}
              onChange={(event, { newValue }) => setWebsite(newValue)}
              placeholder={"請輸入公司網頁"}
            />
          </div>
          <div className={classes.selectTitle}>上傳公司照片(選填)</div>
          <div
            style={{
              flex: 1,
              color: "#888888",
              border: "1px solid hsl(0,0%,80%)",
              borderRadius: 4,
              marginTop: 4
            }}
          >
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    style={{ outline: 0 }}
                    {...getRootProps({ className: "dropzone" })}
                  >
                    <input {...getInputProps()} />
                    <p>點擊上傳照片</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
      <div className={classes.footer}>
        <div className={classes.layoutBiasLeft} />
        <div
          className={classes.layoutContent}
          style={{
            borderTop: "1px solid #EBEBEB",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <CreateTeamFooter
            nextText={"下一步"}
            nextClick={() => {
              history.push("/create-team/introduction");
              props.nextClick({
                website
              });
            }}
          />
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 24,
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: 150,
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.up("md")]: {
        marginTop: 60
      }
    },
    title: {
      display: "flex",
      alignItems: "center",
      fontSize: 16,
      fontWeight: 400,
      [theme.breakpoints.up("md")]: {
        fontSize: 24
      }
    },
    titleContainer: {
      display: "flex",
      marginBottom: 12,
      width: "auto"
    },
    selectContainer: {
      flex: 1
    },
    selectTitle: {
      display: "flex",
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8
    },
    textField: {
      [theme.breakpoints.up("md")]: {
        maxWidth: 600
      }
    },
    layoutBiasLeft: {
      [theme.breakpoints.up("md")]: {
        flex: 1
      }
    },
    layoutContent: {
      [theme.breakpoints.up("md")]: {
        minWidth: 500
      },
      flex: 3,
      flexDirection: "column",
      display: "flex"
    },
    layoutBiasRight: {
      [theme.breakpoints.up("md")]: {
        flex: 4
      }
    },
    footer: {
      position: "fixed",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "white",
      bottom: 0,
      minHeight: 100,
      marginTop: "auto"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextClick: (team: any) => void;
  team: Team;
}

export default withStyles(styles)(withRouter(CreateTeamMoreInfo));
