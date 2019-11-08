import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import AutoSuggestion from "components/Util/AutoSuggestion";
import MilkSelect from "components/Util/Select";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CreateJobFooter from "./createJobFooter";

const typeOptions = [
  { value: "fullTime", label: "正職" },
  { value: "intern", label: "實習" }
];

const getTypeOption = type => {
  for (let i = 0; i < typeOptions.length; i++) {
    if (typeOptions[i].value === type) return typeOptions[i];
  }
};

const salaryTypeOptions = [
  { value: "月薪", label: "月薪" },
  { value: "日薪", label: "日薪" },
  { value: "時薪", label: "時薪" }
];

const getSalaryTypeOption = salaryType => {
  for (let i = 0; i < salaryTypeOptions.length; i++) {
    if (salaryTypeOptions[i].value === salaryType) return salaryTypeOptions[i];
  }
};

const salaryOptions = [
  { value: "discuss", label: "面議" },
  { value: "22k~40k", label: "22k~40k" },
  { value: "40k~60k", label: "40k~60k" },
  { value: "60k~80k", label: "60k~80k" },
  { value: "80k~100k", label: "80k~100k" },
  { value: "100k以上", label: "100k以上" }
];

const getSalaryOption = salary => {
  for (let i = 0; i < salaryOptions.length; i++) {
    if (salaryOptions[i].value === salary) return salaryOptions[i];
  }
};

const CreateJobTitle: React.FC<Props> = props => {
  const { classes, job, history } = props;
  const [type, setType] = useState(job.type);
  const [typeErrorMessage, setTypeErrorMessage] = useState("");
  const [name, setName] = useState(job.name);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [salaryType, setSalaryType] = useState(job.salaryType);
  const [salaryTypeErrorMessage, setSalaryTypeErrorMessage] = useState("");
  const [salary, setSalary] = useState(job.minSalary);
  const [salaryErrorMessage, setSalaryErrorMessage] = useState("");
  const [location, setLocation] = useState(job.address.street);
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>你打算發佈什麼樣的職缺呢？</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>職缺類型</div>
            <div style={{ maxWidth: 250 }}>
              <MilkSelect
                value={getTypeOption(type)}
                handleChange={type => {
                  setType(type.value);
                  setTypeErrorMessage("");
                }}
                placeholder={"職缺類型"}
                options={typeOptions}
                errorMessage={typeErrorMessage}
              />
            </div>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>職缺名稱</div>
            <AutoSuggestion
              value={name}
              onChange={(event, { newValue }) => {
                setName(newValue);
                setNameErrorMessage("");
              }}
              placeholder={"請選擇/輸入職業名稱"}
              errorMessage={nameErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>薪水</div>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <MilkSelect
                  value={getSalaryTypeOption(salaryType)}
                  handleChange={type => {
                    setSalaryType(type.value);
                    setSalaryTypeErrorMessage("");
                  }}
                  placeholder={"薪水類型"}
                  options={salaryTypeOptions}
                  errorMessage={salaryTypeErrorMessage}
                />
              </div>
              <div style={{ flex: 2, paddingLeft: 16 }}>
                <MilkSelect
                  value={getSalaryOption(salary)}
                  handleChange={salary => {
                    setSalary(salary.value);
                    setSalaryErrorMessage("");
                  }}
                  placeholder={"請選擇薪水"}
                  options={salaryOptions}
                  errorMessage={salaryErrorMessage}
                />
              </div>
            </div>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>工作地點</div>
            <AutoSuggestion
              value={location}
              onChange={(event, { newValue }) => {
                setLocation(newValue);
                setLocationErrorMessage("");
              }}
              placeholder={"請輸入工作地點"}
              errorMessage={locationErrorMessage}
            />
          </div>
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
      <div className={classes.footer}>
        <div className={classes.layoutBiasLeft} />
        <div
          className={classes.layoutContent}
          style={{
            borderTop: "1px solid #EBEBEB",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <CreateJobFooter
            nextText={"下一步"}
            nextClick={() => {
              if (!type) {
                setTypeErrorMessage("請選擇職缺類型");
              }
              if (name === "") {
                setNameErrorMessage("請輸入職缺名稱");
              }
              if (!salaryType) {
                setSalaryTypeErrorMessage("請選擇心水類型");
              }
              if (!salary) {
                setSalaryErrorMessage("請選擇薪水範圍");
              }
              if (location === "") {
                setLocationErrorMessage("請輸入工作地點");
              }
              if (
                type &&
                name !== "" &&
                location !== "" &&
                salaryType &&
                salary
              ) {
                props.nextClick({
                  type: type,
                  name: name,
                  salaryType: salaryType,
                  salary: salary,
                  address: { area: "1", subArea: "1", street: location }
                });
                history.push("/recruiter/create-a-job/info");
              }
            }}
          />
        </div>
        <div className={classes.layoutBiasRight} />
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: 24,
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: 150,
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.up("md")]: {
        marginTop: 40
      }
    },
    title: {
      display: "flex",
      alignItems: "center",
      fontSize: 16,
      fontWeight: 400,
      [theme.breakpoints.up("md")]: {
        fontSize: 24
      }
    },
    titleContainer: {
      display: "flex",
      marginBottom: 12,
      width: "auto"
    },
    selectContainer: {
      flex: 1
    },
    selectTitle: {
      display: "flex",
      marginBottom: 8,
      marginTop: 8,
      marginRight: "auto"
    },
    layoutBiasLeft: {
      [theme.breakpoints.up("md")]: {
        flex: 1
      }
    },
    layoutContent: {
      [theme.breakpoints.up("md")]: {
        minWidth: 500
      },
      flex: 3,
      flexDirection: "column",
      display: "flex"
    },
    layoutBiasRight: {
      [theme.breakpoints.up("md")]: {
        flex: 4
      }
    },
    footer: {
      position: "fixed",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "white",
      bottom: 0,
      minHeight: 100,
      marginTop: "auto"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  nextClick: (job: any) => void;
  job: any;
}

export default withStyles(styles)(withRouter(CreateJobTitle));
