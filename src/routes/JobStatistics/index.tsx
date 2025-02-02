import {
  DateBin,
  JobStatistics as JobStatisticsType,
} from "@frankyjuang/milkapi-client";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { Title } from "components/Util";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth, useTheme } from "stores";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: "1.2rem",
    textAlign: "left",
    margin: 12,
    marginTop: 32,
    marginBottom: 18,
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
      width: "960px",
    },
  },
}));

const JobStatistics: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const classes = useStyles();
  const { getApi } = useAuth();
  const { theme } = useTheme();
  const matched = useMediaQuery(theme.breakpoints.down("xs"));
  const [jobStatistics, setJobStatistics] = useState<JobStatisticsType>();

  useEffect(() => {
    const getJobStatistic = async () => {
      const jobApi = await getApi("Job");
      const statistics = await jobApi.getJobStatistics({
        jobId,
        binCount: 14,
        binSizeDays: 1,
      });
      setJobStatistics(statistics);
    };

    getJobStatistic();
  }, [getApi, jobId]);

  const renderChart = (name: string, data: DateBin[]) => {
    return (
      <>
        <div className={classes.header}>
          {name +
            " " +
            data.reduce((result, bin) => result + (bin.count || 0), 0)}
        </div>
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={data}>
            <CartesianGrid />
            <XAxis
              dataKey={(bin: DateBin) => bin.startTime.toLocaleDateString()}
            />
            <YAxis
              width={matched ? 24 : undefined}
              label={
                matched
                  ? undefined
                  : { value: name, angle: -90, position: "insideLeft" }
              }
            />
            <Line
              dataKey={(bin: DateBin) => bin.count || 0}
              stroke={theme.palette.text.primary}
              dot={{
                stroke: theme.palette.text.primary,
                strokeWidth: 4,
                fill: theme.palette.text.primary,
              }}
              activeDot={{
                stroke: theme.palette.secondary.main,
                strokeWidth: 4,
                fill: theme.palette.secondary.main,
              }}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  };

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Title text="統計" />
        {jobStatistics && (
          <>
            {renderChart("點閱次數", jobStatistics.views)}
            {renderChart("點閱人數", jobStatistics.visitors)}
            {renderChart("詢問人數", jobStatistics.queries)}
          </>
        )}
      </div>
    </div>
  );
};

export default JobStatistics;
