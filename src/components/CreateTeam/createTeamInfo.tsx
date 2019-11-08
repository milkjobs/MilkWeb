import React, { useState } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import MilkSelect from "components/Util/Select";
import AutoSuggestion from "components/Util/AutoSuggestion";
import Dropzone from "react-dropzone";
import CreateTeamFooter from "./createTeamFooter";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Team } from "@frankyjuang/milkapi-client";

const fieldOptions = [
  { label: "科技", value: "科技" },
  { label: "服務", value: "服務" },
  { label: "製造", value: "製造" },
  { label: "金融", value: "金融" },
  { label: "文創", value: "文創" },
  { label: "餐飲", value: "餐飲" },
  { label: "醫藥", value: "醫藥" },
  { label: "零售", value: "零售" }
];

const scaleOptions = [
  { label: "0~20人", value: "0~20人" },
  { label: "20~99人", value: "20~99人" },
  { label: "100~499人", value: "100~499人" },
  { label: "500~999人", value: "500~999人" },
  { label: "1000~9999人", value: "1000~9999人" },
  { label: "10000人以上", value: "10000人以上" }
];

const CreateTeamInfo: React.FC<Props> = props => {
  const { team } = props;
  const [, setFiles] = useState(null);
  const [nickname, setNickname] = useState(team.nickname);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [address, setAddress] = useState(team.address);
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  // TODO: Team size
  const [scale, setScale] = useState("100人");
  const [scaleErrorMessage, setScaleErrorMessage] = useState("");
  const [primaryField, setPrimaryField] = useState(team.primaryField);
  const [primaryFieldErrorMessage, setPrimaryFieldErrorMessage] = useState("");
  const [secondaryField, setSecondaryField] = useState(team.secondaryField);

  const onDrop = files => {
    setFiles(files);
  };
  const { classes, history } = props;

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.layoutBiasLeft} />
        <div className={classes.layoutContent}>
          <div className={classes.titleContainer}>
            <span className={classes.title}>我們來填寫公司相關的基本資料</span>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>上傳公司Logo(選填)</div>
            <div
              style={{
                flex: 1,
                color: "#888888",
                border: "1px solid hsl(0,0%,80%)",
                borderRadius: 4,
                marginTop: 4,
                marginBottom: 4
              }}
            >
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      style={{ outline: 0 }}
                      {...getRootProps({ className: "dropzone" })}
                    >
                      <input {...getInputProps()} />
                      <p>點擊上傳Logo</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司簡稱</div>
            <AutoSuggestion
              value={nickname}
              onChange={(event, { newValue }) => {
                setNickname(newValue);
                setNicknameErrorMessage("");
              }}
              placeholder={"請輸入公司全稱簡寫或是主要產品的名稱"}
              errorMessage={nicknameErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司產業領域</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginRight: 8, flex: 1 }}>
                <MilkSelect
                  value={
                    // The type of value in MilkSelect is {label, value}
                    primaryField
                      ? { label: primaryField, value: primaryField }
                      : primaryField
                  }
                  handleChange={field => {
                    setPrimaryField(field.value);
                    setPrimaryFieldErrorMessage("");
                  }}
                  placeholder={"主要領域"}
                  options={fieldOptions}
                  errorMessage={primaryFieldErrorMessage}
                />
              </div>
              <div style={{ marginLeft: 8, flex: 1 }}>
                <MilkSelect
                  value={
                    secondaryField
                      ? { label: secondaryField, value: secondaryField }
                      : secondaryField
                  }
                  handleChange={field => setSecondaryField(field.value)}
                  placeholder={"次要領域(選填)"}
                  options={fieldOptions}
                />
              </div>
            </div>
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司人數</div>
            <MilkSelect
              value={scale ? { label: scale, value: scale } : scale}
              handleChange={scale => {
                setScale(scale.value);
                setScaleErrorMessage("");
              }}
              placeholder={"請選擇公司人數"}
              options={scaleOptions}
              errorMessage={scaleErrorMessage}
            />
          </div>
          <div className={classes.selectContainer}>
            <div className={classes.selectTitle}>公司地址</div>
            <AutoSuggestion
              value={address.street}
              onChange={(event, { newValue }) => {
                setAddress({ ...address, street: newValue });
                setAddressErrorMessage("");
              }}
              placeholder={"請輸入公司地址"}
              errorMessage={addressErrorMessage}
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
          <CreateTeamFooter
            nextText={"下一步"}
            nextClick={() => {
              if (nickname === "") {
                setNicknameErrorMessage("請輸入公司簡稱或產品名稱");
              }
              if (primaryField === "") {
                setPrimaryFieldErrorMessage("請選擇主要產業");
              }
              if (scale === "") {
                setScaleErrorMessage("請選擇公司人數規模");
              }
              if (address.street === "") {
                setAddressErrorMessage("請輸入公司地址");
              }
              if (
                nickname !== "" &&
                primaryField !== "" &&
                scale !== "" &&
                address.street !== ""
              ) {
                props.nextClick({
                  nickname,
                  primaryField,
                  secondaryField,
                  scale,
                  address
                });
                history.push("/create-team/more-info");
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
      marginRight: "auto",
      marginTop: 8,
      marginBottom: 8
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
  nextClick: (team: any) => void;
  team: Team;
}

export default withStyles(styles)(withRouter(CreateTeamInfo));
