import {
  CreateJobDescription,
  CreateJobInfo,
  CreateJobTitle
} from "components/CreatJob";
import { Header } from "components/Header";
import { InitialJob } from "helpers";
import React, { useState } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useAuth } from "stores";

type Props = RouteComponentProps;

const CreateJob: React.FC<Props> = props => {
  const { getApi, user } = useAuth();
  const { history } = props;
  const [job, setJob] = useState(InitialJob);

  const handleChange = newJob => setJob({ ...job, ...newJob });
  const submit = async job => {
    const jobApi = await getApi("Job");
    user &&
      user.recruiterInfo &&
      (await jobApi.addJob({
        newJob: job,
        recruiterInfoId: user.recruiterInfo.uuid!
      }));
    history.push("/recruiter");
  };

  const Content = (props: RouteComponentProps<{ id: string }>) => {
    if (props.match.params.id === "title") {
      return (
        <>
          <Header title={"從職缺的基本資料開始"} progressValue={33} />
          <CreateJobTitle job={job} nextClick={handleChange} />
        </>
      );
    } else if (props.match.params.id === "info") {
      return (
        <>
          <Header title={"完善職缺資料"} progressValue={66} />
          <CreateJobInfo job={job} nextClick={handleChange} />
        </>
      );
    } else if (props.match.params.id === "description") {
      return (
        <>
          <Header title={"填寫職缺介紹"} progressValue={100} />
          <CreateJobDescription job={job} nextClick={submit} />
        </>
      );
    } else {
      return <div />;
    }
  };
  return (
    <div>
      <Route path={"/recruiter/create-a-job/:id"} component={Content} />
    </div>
  );
};

export default withRouter(CreateJob);
