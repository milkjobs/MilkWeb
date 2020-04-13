import { Department } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SearchIcon from "@material-ui/icons/Search";
import to from "await-to-js";
import { Header } from "components/Header";
import { Title } from "components/Util";
import Fuse from "fuse.js";
import { normalizeSchoolName, PageMetadata } from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles((theme) => ({
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
  listContainer: {
    display: "flex",
    flexDirection: "row",
  },
  schoolContainer: {
    flex: 1,
  },
  departmentContainer: {
    flex: 2,
  },
  item: {
    fontSize: 18,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  },
  Link: {
    "&:hover": {
      color: theme.palette.secondary.contrastText,
    },
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  searchRoot: {
    padding: "2px 4px",
    width: 900,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 16,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
      width: "90%",
    },
  },
}));

interface School {
  name: string;
  normalizedName: string;
}

const DepartmentList: React.FC = () => {
  const { getApi } = useAuth();
  const classes = useStyles();
  const [schools, setSchools] = useState<School[]>([]);
  const [fuse, setFuse] = useState<Fuse<School, Fuse.FuseOptions<School>>>();
  const [selectedSchool, setSelectedSchool] = useState<string>();
  const [selectedSchoolIndex, setSelectedSchoolIndex] = useState<number>();
  const [departments, setDepartments] = useState<{
    [school: string]: Department[];
  }>({});
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const getSchools = async () => {
      const awesomeApi = await getApi("Awesome");
      const [, fetchedSchools] = await to(awesomeApi.getSchools());
      if (fetchedSchools) {
        const schoolEntries = fetchedSchools.map<School>((s) => ({
          name: s,
          normalizedName: normalizeSchoolName(s),
        }));
        const options: Fuse.FuseOptions<School> = {
          shouldSort: true,
          tokenize: true,
          matchAllTokens: true,
          keys: ["normalizedName"],
        };
        setFuse(new Fuse(schoolEntries, options));
        setSchools(schoolEntries);
      }
    };

    getSchools();
  }, [getApi]);

  useEffect(() => {
    const getDepartments = async (schoolName: string) => {
      const awesomeApi = await getApi("Awesome");
      const fetchedDepartments = await awesomeApi.getDepartmentsBySchoolName({
        schoolName,
      });
      setDepartments((prev) => ({ ...prev, [schoolName]: fetchedDepartments }));
    };

    if (
      selectedSchool &&
      !Object.prototype.hasOwnProperty.call(departments, selectedSchool)
    ) {
      getDepartments(selectedSchool);
    }
  }, [selectedSchool, getApi, departments]);

  useEffect(() => {
    setSelectedSchool(undefined);
    setSelectedSchoolIndex(undefined);
  }, [query]);

  return (
    <div>
      <PageMetadata title="就業精選－牛奶找工作" />
      <Header />
      <div className={classes.container}>
        <Title text="就業精選" hideBottomLine />
        <div className={classes.searchRoot}>
          <InputBase
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className={classes.input}
            placeholder="搜尋學校"
          />
          <IconButton className={classes.iconButton}>
            <SearchIcon />
          </IconButton>
        </div>
        <div className={classes.listContainer}>
          <List className={classes.schoolContainer} component="nav">
            {(query && fuse
              ? fuse.search<School, false, false>(query)
              : schools
            ).map((item, index) => (
              <ListItem
                className={classes.item}
                key={item.name}
                button
                onMouseOver={() => {
                  setSelectedSchool(item.name);
                  setSelectedSchoolIndex(index);
                }}
              >
                {item.name}
              </ListItem>
            ))}
          </List>
          <List
            style={{
              marginTop: 41 * (selectedSchoolIndex || 0),
            }}
            className={classes.departmentContainer}
            component="nav"
          >
            {selectedSchool &&
              departments[selectedSchool] &&
              departments[selectedSchool].map((d) => (
                <Link
                  key={d.name + d.school}
                  className={classes.Link}
                  to={`/awesome/${d.school + d.name}`}
                >
                  <ListItem className={classes.item} button>
                    {d.name}
                  </ListItem>
                </Link>
              ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
