import { Job as JobType } from "@frankyjuang/milkapi-client";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import {
  JobContact,
  JobDescription,
  JobFooter,
  JobLocation,
  JobSideCard,
  JobStatistics,
  JobTitle,
} from "components/Job";
import { ErrorStatus } from "components/Util";
import { webConfig } from "config";
import "firebase/analytics";
import firebase from "firebase/app";
import {
  BreadcrumbListStructuredData,
  getPostCode,
  JobPostingStructuredData,
  PageMetadata,
} from "helpers";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "stores";
import urljoin from "url-join";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingBottom: 100,
    paddingTop: 40,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  imgContainer: {
    width: "100%",
    height: "450px",
    background: "#EBEBEB",
    position: "relative",
    marginBottom: 8,
    overflow: "hidden",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.up("lg")]: {
      width: "1120px",
    },
  },
  titleContainer: {
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
  },
  descriptionContainer: {
    display: "flex",
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  descriptionContent: {
    flex: 2,
  },
  descriptionSide: {
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  loading: {
    flex: 1,
    marginTop: 200,
  },
}));

const Job: React.FC = () => {
  const { getApi, user } = useAuth();
  const params = useParams<{ id: string }>();
  const classes = useStyles();
  const [job, setJob] = useState<JobType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      !job && setLoading(true);
      const jobApi = await getApi("Job");
      let fetchedJob: JobType | undefined;
      if (user) {
        [, fetchedJob] = await to(jobApi.getJob({ jobId: params.id }));
      } else {
        [, fetchedJob] = await to(
          jobApi.getJobAnonymously({ jobId: params.id })
        );
      }
      if (fetchedJob) {
        setJob(fetchedJob);
        firebase
          .analytics()
          .logEvent("view_item", { items: [{ id: fetchedJob.uuid }] });
      }
      setLoading(false);
    };
    fetchJob();
  }, [getApi, user, params.id]);

  return (
    <div className={classes.root}>
      {job && job.team && (
        <>
          <PageMetadata
            title={`${job.name}・${job.team.nickname}－牛奶找工作`}
            description={job.description}
            image={job.team.logoUrl}
          />
          <JobPostingStructuredData
            uuid={job.uuid}
            name={job.name}
            description={job.description || "尚無詳情"}
            createdAt={job.createdAt}
            teamName={job.team.name}
            teamWebsite={job.team.website}
            teamLogoUrl={job.team.logoUrl}
            area={job.address.area}
            subArea={job.address.subArea}
            street={job.address.street}
            postCode={getPostCode(job.address)}
            salaryType={job.salaryType}
            minSalary={job.minSalary}
            maxSalary={job.maxSalary}
            type={job.type}
          />
          <BreadcrumbListStructuredData
            breadcrumbs={[
              {
                name: job.team.name,
                url: urljoin(webConfig.basePath, "team", job.team.uuid),
              },
              {
                name: "工作機會",
                url: urljoin(webConfig.basePath, "team", job.team.uuid, "jobs"),
              },
              {
                name: job.name,
                url: urljoin(webConfig.basePath, "job", job.uuid),
              },
            ]}
          />
        </>
      )}
      <Header />
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : !job ? (
        <ErrorStatus
          subheader="我們找不到這份工作。"
          description="錯誤代碼：404"
        />
      ) : (
        <div className={classes.container}>
          <div className={classes.infoContainer}>
            <div className={classes.titleContainer}>
              <JobTitle {...job} />
            </div>
            <div className={classes.descriptionContainer}>
              <div className={classes.descriptionContent}>
                {job.description && (
                  <JobDescription description={job.description} tags={[]} />
                )}
                <JobLocation address={job.address} />
                {job.contact && <JobContact contact={job.contact} />}
                <JobStatistics jobId={params.id} createdAt={job.createdAt} />
              </div>
              <div className={classes.descriptionSide}>
                <JobSideCard job={job} />
              </div>
            </div>
            {job.recruiter && <JobFooter recruiter={job.recruiter} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
