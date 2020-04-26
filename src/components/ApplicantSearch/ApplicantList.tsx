import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { InfiniteHitsProvided } from "react-instantsearch-core";
import { connectInfiniteHits } from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { ApplicantCard } from "./ApplicantCard";

const useStyles = makeStyles({
  jobsContainer: {
    display: "flex",
    flex: 4,
    flexDirection: "column",
    boxSizing: "border-box",
  },
});

const ApplicantList: React.FC<InfiniteHitsProvided> = (props) => {
  const classes = useStyles();
  const { hits, hasMore, refineNext } = props;
  const [ref, inView] = useInView();

  useEffect(() => {
    inView && hasMore && refineNext();
  }, [inView]);

  return (
    <div className={classes.jobsContainer}>
      {hits.map((value, index) => (
        <ApplicantCard
          {...value}
          key={index}
          targetPath={`/recruiter/public-profile/${value.objectID}`}
        />
      ))}
      <div ref={ref}></div>
    </div>
  );
};

const ConnectedJobList = connectInfiniteHits(ApplicantList);

export { ConnectedJobList as ApplicantList };
