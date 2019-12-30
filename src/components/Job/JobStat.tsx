import { JobStatistics } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from '@material-ui/icons/Visibility';
import CommentIcon from '@material-ui/icons/Comment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "stores";
import { JobApi } from "@frankyjuang/milkapi-client";
import { async } from "q";
import { Link } from "react-router-dom";


const useStyles = makeStyles( theme => ({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 32,
        paddingLeft: 24,
        paddingRight: 24,
        [theme.breakpoints.down("xs")]: {
            marginTop: 8,
            paddingLeft: 0,
            paddingRight: 0
          }
      },
      item: {
        display: "flex",
        flex: 1,
        fontWeight: 600,
        paddingLeft: 10,
      }
}));

interface Props {
    jobId: string;
  }
  
  const JobStat: React.FC<Props> = props => {
    const classes = useStyles();
    const { getApi, isAuthenticated } = useAuth();
    const { jobId } = props;
    const [jobStatistics, setJobStatistics] = useState<JobStatistics>();
  
    useEffect(() => {
        const getJobStatistic = async () => {
            const jobApi = await getApi("Job");
            const statistics = await jobApi.getJobStatistics({
                jobId,
                binCount: 1,
                binSizeDays: 14
            });
            setJobStatistics(statistics);
        };
        getJobStatistic();
      }, [getApi, jobId]);
    return (  
        <div>
            {jobStatistics && (
                <Link 
                to={"/team/" + jobId}
                style={{ textDecoration: "none", cursor: "pointer" }}
                >
                    <div className={classes.container}>
                        <VisibilityIcon style={{ marginRight: 1 }} />  
                        <div className={classes.item}>
                            {jobStatistics.views.reduce((result, query) => result + (query.count || 0),0)}
                        </div>
                        <EmojiPeopleIcon />
                        <div className={classes.item}>
                            {jobStatistics.visitors.reduce((result, query) => result + (query.count || 0),0)} 
                        </div>
                        <CommentIcon />
                        <div className={classes.item}>
                            {jobStatistics.queries.reduce((result, query) => result + (query.count || 0),0)}
                        </div>
                    </div>                   
                </Link>

            )}
        </div>
    );
  };
  
  export { JobStat };
  