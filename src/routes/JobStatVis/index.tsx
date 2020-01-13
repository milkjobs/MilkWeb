import { UserApi } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JobStatistics } from "@frankyjuang/milkapi-client";
import { useAuth } from "stores";
import { JobApi } from "@frankyjuang/milkapi-client";
import { async } from "q";
import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import { Header } from "components/Header";

interface Props {
    data: number[];
    date: Date[];
    title: string;
    color: string;
  }


const useStyles = makeStyles(theme => ({
  header: {
    textAlign: "left"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 40
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  }
}));

const JobStatVis: React.FC = () => {
  const params = useParams<{ id: string }>();
  const classes = useStyles();
  const { getApi, isAuthenticated } = useAuth();
  const [jobStatistics, setJobStatistics] = useState<JobStatistics>();

  useEffect(() => {
      const getJobStatistic = async () => {
          const jobApi = await getApi("Job");
          const statistics = await jobApi.getJobStatistics({
              jobId: params.id,
              binCount: 14,
              binSizeDays: 1
          });
          setJobStatistics(statistics);
      };
      getJobStatistic();
    }, [getApi, params]);

    const viewChart = {};
    const visitorChart = {};
    const queryChart = {};

    if (jobStatistics) {
      const views = jobStatistics.views;
      const visitor = jobStatistics.visitors;
      const query = jobStatistics.queries;
      for (let obj in Object.keys(views)) {
        viewChart[views[obj].startTime.toLocaleDateString()] = (views[obj].count || 0 );
        visitorChart[visitor[obj].startTime.toLocaleDateString()] = (visitor[obj].count || 0 );
        queryChart[query[obj].startTime.toLocaleDateString()] = (query[obj].count || 0 );
      }
    }

  return (
    <div>
      {
        jobStatistics && (
          <div>
            <Header />
            <div className={classes.container}>
              <div className={classes.chartContainer}>
                <h1 className={classes.header}>點閱次數</h1>
                <LineChart data={viewChart} xtitle="日期" ytitle="點閱次數" colors="#484"/>
                <h1 className={classes.header}>點閱人數</h1>
                <LineChart data={visitorChart} xtitle="日期" ytitle="點閱人數" colors="#484" />
                <h1 className={classes.header}>詢問人數</h1>
                <LineChart data={queryChart} xtitle="日期" ytitle="詢問人數" colors="#484"/>
              </div>
            </div>
          </div>
          
        )
      }
    </div>
  );
};

export default JobStatVis;
