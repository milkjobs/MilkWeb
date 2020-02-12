import { JobStatistics as JobStatisticsType } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  mdiCommentProcessingOutline,
  mdiEyeCheckOutline,
  mdiEyeOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import moment from "moment";
import "moment/locale/zh-tw";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useTheme } from "stores";
moment.locale("zh-tw");

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    fontWeight: 600,
    marginLeft: 8,
    marginRight: 8
  },
  icon: {
    marginBottom: 4
  },
  footer: {
    textAlign: "left",
    marginTop: 8
  }
}));

interface Props {
  jobId: string;
  createdAt: Date;
}

const JobStatistics: React.FC<Props> = props => {
  const { jobId, createdAt } = props;
  const classes = useStyles();
  const { theme } = useTheme();
  const { getApi } = useAuth();
  const [jobStatistics, setJobStatistics] = useState<JobStatisticsType>();

  const isSameYear = (createdAt: Date) =>
    new Date().getFullYear() === createdAt.getFullYear();

  useEffect(() => {
    const getJobStatistic = async () => {
      const jobApi = await getApi("Job");
      const statistics = await jobApi.getJobStatistics({
        jobId,
        binCount: 14,
        binSizeDays: 1
      });
      setJobStatistics(statistics);
    };

    getJobStatistic();
  }, [getApi, jobId]);

  if (!jobStatistics) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Link to={`/job/${jobId}/stat`} className={classes.link}>
        <div className={classes.statisticsContainer}>
          <Icon
            className={classes.icon}
            path={mdiEyeOutline}
            size={1}
            color={theme.palette.text.primary}
          />
          <div className={classes.item}>
            {jobStatistics.views.reduce(
              (result, query) => result + (query.count || 0),
              0
            )}
          </div>
          <Icon
            className={classes.icon}
            path={mdiEyeCheckOutline}
            size={1}
            color={theme.palette.text.primary}
          />
          <div className={classes.item}>
            {jobStatistics.visitors.reduce(
              (result, query) => result + (query.count || 0),
              0
            )}
          </div>
          <Icon
            className={classes.icon}
            style={{ marginBottom: 2 }}
            path={mdiCommentProcessingOutline}
            size={0.9}
            color={theme.palette.text.primary}
          />
          <div className={classes.item}>
            {jobStatistics.queries.reduce(
              (result, query) => result + (query.count || 0),
              0
            )}
          </div>
        </div>
      </Link>
      <div className={classes.footer}>
        {"刊登時間" +
          " " +
          moment(createdAt).calendar(undefined, {
            sameDay: "[今天]",
            lastDay: "[昨天]",
            lastWeek: isSameYear(createdAt) ? "MM/DD" : "YYYY/MM/DD",
            sameElse: isSameYear(createdAt) ? "MM/DD" : "YYYY/MM/DD"
          })}
      </div>
    </div>
  );
};

export { JobStatistics };
