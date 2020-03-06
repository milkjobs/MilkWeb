import { AwesomeList as AwesomeListType } from "@frankyjuang/milkapi-client";
import { CircularProgress, Fab } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { KeyboardArrowUp } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import to from "await-to-js";
import { AwesomeHeader, CompanyCard } from "components/Awesome";
import { Header } from "components/Header";
import { ScrollTop, Title } from "components/Util";
import { webConfig } from "config";
import { BreadcrumbListStructuredData, PageMetadata } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "stores";
import urljoin from "url-join";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexDirection: "column",
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
  introduction: {
    fontSize: 18,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    },
    fontWeight: 800,
    margin: "16px 0"
  }
}));

const AwesomeList: React.FC = () => {
  const { getApi } = useAuth();
  const history = useHistory();
  const params = useParams<{ name: string }>();
  const classes = useStyles();
  const [awesomeList, setAwesomeList] = useState<AwesomeListType>();
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string>();
  const [loading, setLoading] = useState(true);
  const introduction = `為了幫助學生更了解自己有哪些選擇，我們整理了${params.name}畢業生最常去的公司。先從這些公司開始應徵吧！`;

  const sendSuggestion = async () => {
    setSuggestionDialogOpen(false);
    const supportApi = await getApi("Support");
    await supportApi.addAnonymousSupportTicket({
      newSupportTicket: {
        subject: params.name || "我要建議",
        body: suggestion,
        email: "awesome-suggestion@milk.jobs"
      }
    });
    setSuggestion(undefined);
  };

  useEffect(() => {
    const getAwesomeList = async () => {
      setLoading(true);
      const awesomeApi = await getApi("Awesome");
      const [, list] = await to(
        awesomeApi.getAwesomeLists({ name: params.name })
      );
      list && list.length > 0 && setAwesomeList(list[0]);
      setLoading(false);
    };

    getAwesomeList();
  }, [getApi, params.name]);

  return (
    <div className={classes.root}>
      <PageMetadata
        title={`${params.name}－牛奶找工作`}
        description={introduction}
      />
      <BreadcrumbListStructuredData
        breadcrumbs={[
          { name: "就業精選", url: urljoin(webConfig.basePath, "departments") },
          {
            name: params.name,
            url: urljoin(webConfig.basePath, "awesome", params.name)
          }
        ]}
      />
      <Header />
      <div className={classes.container}>
        <div id="back-to-top-anchor" />
        <AwesomeHeader containerStyle={{ marginBottom: 32 }} />
        <Title
          text={params.name}
          buttonText="我要建議"
          buttonOnClick={() => setSuggestionDialogOpen(true)}
        />
        {loading ? (
          <div style={{ flex: 1, justifyContent: "center", margin: 16 }}>
            <CircularProgress style={{ width: 30, height: 30 }} />
          </div>
        ) : awesomeList?.teams && awesomeList.teams.length > 0 ? (
          <>
            <div className={classes.introduction}>{introduction}</div>
            {awesomeList.teams.map(c => (
              <CompanyCard key={c.name + (params.name || "")} {...c} />
            ))}
          </>
        ) : (
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  history.push("/departments");
                }}
              >
                看其他就業精選
              </Button>
            }
          >
            {`目前沒有${params.name}的就業精選`}
          </Alert>
        )}
      </div>
      <ScrollTop>
        <Fab color="secondary" size="small">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
      <Dialog
        open={suggestionDialogOpen}
        onClose={() => setSuggestionDialogOpen(false)}
      >
        <DialogTitle>我要建議</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這些數據是牛奶找工作詢問系上教授、同學、104 公開資料及統計 LinkedIn
            上 2010
            年後入學的學生，自行整理的名單，並沒有受公司委託進行廣告。如果有任何與事實不符的地方，或想補充、新增、刪除公司，歡迎留言告訴我們，一起幫助大學生畢業更有方向！
          </DialogContentText>
          <TextField
            value={suggestion}
            id="outlined-multiline-static"
            multiline
            rows="8"
            fullWidth
            variant="outlined"
            onChange={e => setSuggestion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSuggestionDialogOpen(false)}
            color="primary"
          >
            取消
          </Button>
          <Button onClick={sendSuggestion} color="primary">
            送出
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AwesomeList;
