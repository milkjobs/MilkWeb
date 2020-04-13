import { makeStyles } from "@material-ui/core/styles";
import { JobRecordCard } from "components/Job";
import React, { useEffect } from "react";
import { InfiniteHitsProvided } from "react-instantsearch-core";
import { connectInfiniteHits } from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";

const useStyles = makeStyles({
  jobsContainer: {
    display: "flex",
    flex: 4,
    flexDirection: "column",
    boxSizing: "border-box",
  },
});

const JobList: React.FC<InfiniteHitsProvided> = (props) => {
  const classes = useStyles();
  const { hits, hasMore, refineNext } = props;
  const [ref, inView] = useInView();

  useEffect(() => {
    inView && hasMore && refineNext();
  }, [inView, hasMore, refineNext]);

  return (
    <div className={classes.jobsContainer}>
      {hits.map((value, index) => (
        <JobRecordCard
          {...value}
          key={index}
          targetPath={`/job/${value.objectID}`}
        />
      ))}
      <div ref={ref}></div>
    </div>
  );
};

const ConnectedJobList = connectInfiniteHits(JobList);

export { ConnectedJobList as JobList };
