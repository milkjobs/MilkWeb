import {
  CreateTeamInfo,
  CreateTeamIntroduction,
  CreateTeamMoreInfo,
  CreateTeamName
} from "components/CreateTeam";
import { Header } from "components/Header";
import { InitialTeam } from "helpers";
import React, { useState } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useAuth } from "stores";

type Props = RouteComponentProps;

const CreateTeam: React.FC<Props> = props => {
  const [team, setTeam] = useState(InitialTeam);
  const { reloadUser, getApi, userId } = useAuth();
  const { history } = props;

  const handleChange = newTeam => setTeam({ ...team, ...newTeam });
  const submit = async team => {
    const teamApi = await getApi("Team");
    userId && (await teamApi.addTeam({ newTeam: team, userId }));
    await reloadUser();
    history.push("/recruiter");
  };

  const Content = (props: RouteComponentProps<{ id: string }>) => {
    if (props.match.params.id === "name") {
      return (
        <>
          <Header title={"完善個人與公司資料"} progressValue={25} />
          <CreateTeamName team={team} nextClick={handleChange} />
        </>
      );
    } else if (props.match.params.id === "info") {
      return (
        <>
          <Header title={"公司基本資料"} progressValue={50} />
          <CreateTeamInfo team={team} nextClick={handleChange} />
        </>
      );
    } else if (props.match.params.id === "more-info") {
      return (
        <>
          <Header title={"完善公司資料"} progressValue={75} />
          <CreateTeamMoreInfo team={team} nextClick={handleChange} />
        </>
      );
    } else if (props.match.params.id === "introduction") {
      return (
        <>
          <Header title={"填寫公司介紹"} progressValue={100} />
          <CreateTeamIntroduction team={team} nextClick={submit} />
        </>
      );
    } else {
      return <div />;
    }
  };
  const { match } = props;
  return (
    <div>
      <Route path={`${match.path}/:id`} component={Content} />
    </div>
  );
};

export default withRouter(CreateTeam);
