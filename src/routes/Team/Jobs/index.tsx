import { Team as TeamType, UserApi } from "@frankyjuang/milkapi-client";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { JobList } from "components/JobSearch";
import { algoliaConfig, webConfig } from "config";
import { AlgoliaService, BreadcrumbListStructuredData } from "helpers";
import React, { useEffect, useState } from "react";
import { connectRefinementList, InstantSearch } from "react-instantsearch-dom";
import { useAuth } from "stores";
import urljoin from "url-join";

interface Props {
  team: TeamType;
}

const Jobs: React.FC<Props> = ({ team }) => {
  const { user, getApi } = useAuth();
  const [algoliaClient, setAlgoliaClient] = useState<SearchClient>();

  useEffect(() => {
    const getApiKey = async () => {
      if (user) {
        const userApi = (await getApi("User")) as UserApi;
        const algoliaService = new AlgoliaService(user.uuid, userApi);
        return await algoliaService.getApiKey();
      }
      const miscApi = await getApi("Misc");
      const algoliaCredential = await miscApi.getAnonymousAlgoliaCredential();
      return algoliaCredential.apiKey;
    };

    const setClient = async () => {
      const apiKey = await getApiKey();
      const algoliaClient = algoliasearch(algoliaConfig.appId, apiKey);
      setAlgoliaClient(algoliaClient);
    };
    setClient();
  }, [user, getApi]);

  const RefinementList = connectRefinementList(() => <div />);
  return (
    <>
      <BreadcrumbListStructuredData
        breadcrumbs={[
          {
            name: team.name,
            url: urljoin(webConfig.basePath, "team", team.uuid),
          },
          {
            name: "工作機會",
            url: urljoin(webConfig.basePath, "team", team.uuid, "jobs"),
          },
        ]}
      />
      <div style={{ flex: 1 }}>
        {algoliaClient && (
          <InstantSearch
            indexName={algoliaConfig.index}
            searchClient={algoliaClient}
          >
            <RefinementList
              attribute="team.uuid"
              defaultRefinement={[team.uuid]}
            />
            <JobList />
          </InstantSearch>
        )}
      </div>
    </>
  );
};

export default Jobs;
