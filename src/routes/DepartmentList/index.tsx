import { Department } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SearchIcon from "@material-ui/icons/Search";
import { Header } from "components/Header";
import { Title } from "components/Util";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
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
      width: "960px"
    }
  },
  listContainer: {
    display: "flex",
    flexDirection: "row"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  schoolContainer: {
    flex: 1
  },
  departmentContainer: {
    flex: 2
  },
  item: {
    fontSize: 18,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText
    }
  },
  Link: {
    "&:hover": {
      color: theme.palette.secondary.contrastText
    },
    textDecoration: "none",
    color: theme.palette.text.primary
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  searchRoot: {
    padding: "2px 4px",
    width: 900,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
      width: "90%"
    }
  }
}));

const DepartmentList: React.FC = () => {
  const { getApi } = useAuth();
  const classes = useStyles();
  const [schools, setSchools] = useState<string[]>([]);
  const [hoverSchool, setHoverSchool] = useState<string>();
  const [departments, setDepartments] = useState<{
    [school: string]: Department[];
  }>({});
  const [query, setQuery] = useState<string>("");

  const getSchools = async () => {
    const awesomeApi = await getApi("Awesome");
    setSchools(await awesomeApi.getSchools());
  };

  const fuzzyMatch = (s: string, q: string) => {
    const matchChar = q.split("").reduce((count, char) => {
      if (s.includes(char)) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    return matchChar >= q.length - 1;
  };

  useEffect(() => {
    getSchools();
  }, []);

  useEffect(() => {
    const getDepartments = async (schoolName: string) => {
      const awesomeApi = await getApi("Awesome");
      const fetchedDepartments = await awesomeApi.getDepartmentsBySchoolName({
        schoolName
      });
      setDepartments(prev => ({ ...prev, [schoolName]: fetchedDepartments }));
    };

    if (
      hoverSchool &&
      !Object.prototype.hasOwnProperty.call(departments, hoverSchool)
    ) {
      getDepartments(hoverSchool);
    }
  }, [hoverSchool, getApi, departments]);

  useEffect(() => {
    setHoverSchool(undefined);
  }, [query]);

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Title text="就業精選" />
        <div className={classes.searchRoot}>
          <InputBase
            value={query}
            onChange={e => {
              setQuery(e.target.value);
            }}
            className={classes.input}
            placeholder="搜尋學校"
          />
          <IconButton className={classes.iconButton} aria-label="Search">
            <SearchIcon />
          </IconButton>
        </div>
        <div className={classes.listContainer}>
          <List
            className={classes.schoolContainer}
            component="nav"
            aria-label="main mailbox folders"
          >
            {schools
              .filter(s => fuzzyMatch(s, query))
              .map(s => (
                <ListItem
                  className={classes.item}
                  key={s}
                  button
                  onMouseOver={() => setHoverSchool(s)}
                >
                  {s}
                </ListItem>
              ))}
          </List>
          <List
            style={{
              marginTop: hoverSchool
                ? 41 *
                  schools
                    .filter(s => fuzzyMatch(s, query))
                    .findIndex(s => s === hoverSchool)
                : 0
            }}
            className={classes.departmentContainer}
            component="nav"
            aria-label="main mailbox folders"
          >
            {hoverSchool &&
              departments[hoverSchool] &&
              departments[hoverSchool].map(d => (
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
