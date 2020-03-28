import { Job } from "@frankyjuang/milkapi-client";
import { makeStyles, Button } from "@material-ui/core";
import { Header } from "components/Header";
import { JobCreateForm, PositionCard } from "components/Job";
import { Title } from "components/Util";
import { VerificationStateBanner } from "components/Verification";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  },
  emailContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 60,
    [theme.breakpoints.up("md")]: {
      width: "600px"
    },
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.palette.action.hover
  },
  emailHint: {
    fontSize: 16
  },
  emailForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
}));

const Positions: React.FC = () => {
  const classes = useStyles();
  const { user, getApi, reloadUser } = useAuth();
  const [positions, setPositions] = useState<Job[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState<string>();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();

  const saveEmail = async () => {
    if (emailErrorMessage) {
      return;
    }

    if (user?.recruiterInfo?.uuid && email) {
      const recruiterInfoApi = await getApi("RecruiterInfo");
      await recruiterInfoApi.updateRecruiterInfo({
        recruiterInfoId: user.recruiterInfo.uuid,
        recruiterInfo: {
          ...user.recruiterInfo,
          email
        }
      });
    }
    await reloadUser();
  };

  useEffect(() => {
    if (user?.recruiterInfo?.jobs) {
      setPositions(user.recruiterInfo.jobs);
    }
  }, [user]);

  return (
    <div className={classes.root}>
      <Header />
      <JobCreateForm open={formOpen} handleClose={() => setFormOpen(false)} />
      <div className={classes.container}>
        <VerificationStateBanner
          containerStyle={{
            marginBottom: 24,
            textAlign: "left"
          }}
          showAction
        />
        <Title
          text="職缺"
          buttonText="刊登職缺"
          buttonOnClick={() => setFormOpen(true)}
        />
        <div>
          {positions.length !== 0 ? (
            positions.map((value, index) => {
              if (user && user.recruiterInfo && user.recruiterInfo.team)
                value.team = user.recruiterInfo.team;
              return (
                <PositionCard
                  {...value}
                  key={index}
                  targetPath={`/recruiter/job/${value.uuid}`}
                />
              );
            })
          ) : (
            <div>目前沒有職缺</div>
          )}
        </div>
      </div>
      {!user?.recruiterInfo?.email && (
        <div className={classes.emailContainer}>
          <div className={classes.emailHint}>
            {"告訴我們你的 email 或下載我們的 App"}
          </div>
          <div className={classes.emailHint}>
            {"有求職者應徵或其他問題時，讓我們可以第一時間通知你"}
          </div>
          <div className={classes.emailForm}>
            <TextField
              id="standard-basic"
              label="Email"
              onBlur={() => {
                function validateEmail(email) {
                  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                  return re.test(String(email).toLowerCase());
                }
                !validateEmail(email) &&
                  setEmailErrorMessage("請輸入正確的email");
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
                setEmailErrorMessage(undefined);
              }}
              error={Boolean(emailErrorMessage)}
              helperText={emailErrorMessage}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 16, marginLeft: 16 }}
              onClick={saveEmail}
            >
              {"送出"}
            </Button>
            <Link to="/about" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                {"下載 App"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
