import { JobStatistics } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from '@material-ui/icons/Visibility';
import CommentIcon from '@material-ui/icons/Comment';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import { JobApi } from "@frankyjuang/milkapi-client";
import { async } from "q";
import { Link } from "react-router-dom";


const useStyles = makeStyles( theme => ({
    container: {
        paddingLeft: 16,
        paddingRight: 24,
        display: "flex",
        flexDirection: "column",
    },
    link: {
        textDecoration: "none", 
        cursor: "pointer", 
        color: theme.palette.text.primary,
      },
    linkContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 32,
        marginLeft: 2,
        [theme.breakpoints.down("xs")]: {
            marginTop: 8,
            paddingLeft: 0,
            paddingRight: 0
          }
      },
      item: {
        fontWeight: 600,
        marginRight: 2,
        margin: 5,
      },
      icon: {
        fontSize: 20,
        margin: 7,
      },
      text: {
          textAlign: "left",
          margin: 7,
      }
}));

interface Props {
    jobId: string;
    createdAt: Date;
  }
  
  const JobStat: React.FC<Props> = props => {
    const classes = useStyles();
    const { getApi, isAuthenticated } = useAuth();
    const { jobId, createdAt } = props;
    const [jobStatistics, setJobStatistics] = useState<JobStatistics>();
    console.log(createdAt)
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

    return (  
        <div>
            {jobStatistics && (
                <div className={classes.container}>
                    <Link 
                    to={"/jobstat/" + jobId}
                    className= {classes.link}
                    >
                        <div className={classes.linkContainer}>
                            <VisibilityIcon className={classes.icon} />  
                            <div className={classes.item}>
                                {jobStatistics.views.reduce((result, query) => result + (query.count || 0),0)}
                            </div>
                            <EmojiPeopleIcon className={classes.icon} />
                            <div className={classes.item}>
                                {jobStatistics.visitors.reduce((result, query) => result + (query.count || 0),0)} 
                            </div>
                            <CommentIcon className={classes.icon}/>
                            <div className={classes.item}>
                                {jobStatistics.queries.reduce((result, query) => result + (query.count || 0),0)}
                            </div>
                        </div>                   
                    </Link>
                    <div className={classes.text}>{`刊登時間 ${createdAt.toLocaleDateString('zh-Hans-CN')}`}</div>
                </div>
            )}
        </div>
    );
  };
  
  export { JobStat };
  