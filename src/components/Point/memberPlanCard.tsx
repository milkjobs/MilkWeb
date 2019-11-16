import { VisitorPlan } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  memberCard: {
    display: "flex",
    flex: 1,
    margin: 5,
    marginTop: 32,
    padding: 24,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    textAlign: "left",
    fontSize: 16,
    flexDirection: "column",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    alignItems: "center"
  },
  memberCardTitle: {
    marginTop: 32,
    fontSize: 24,
    display: "flex",
    flexDirection: "row",
    color: theme.palette.text.primary,
    marginBottom: 8
  },
  memberCardPrice: {
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    color: theme.palette.text.hint,
    marginBottom: 32
  },
  memberCardDescription: {
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    marginRight: "auto",
    color: theme.palette.text.secondary
  },
  button: {
    padding: 8,
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%"
  },
  iframe: { border: "none" }
}));

interface Props {
  isOpen: boolean;
  onFinish: () => void;
  close: () => void;
  paymentUrl: string;
  planPoints: number;
  planPrice: number;
}

const MemberPlanDialog: React.FC<Props> = props => {
  const { isOpen, onFinish, close, paymentUrl, planPoints, planPrice } = props;
  const classes = useStyles();
  const { user } = useAuth();
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      try {
        const eventData = JSON.parse(e.data);
        if ("MerchantID" in eventData) {
          setFinish(true);
        }
      } catch {
        console.warn("callback failed");
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFinish(false);
      !paymentUrl && setFinish(true);
    }
  }, [isOpen, paymentUrl]);

  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={smMatches}
      fullWidth={true}
      maxWidth={"md"}
      open={isOpen}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"請確認你選擇的方案"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          你將使用以下帳號訂閱方案。 <br />
          用戶姓名： {user ? user.name : ""}
          <br />
          公司名稱：{" "}
          {user && user.recruiterInfo && user.recruiterInfo.team
            ? user.recruiterInfo.team.nickname
            : ""}
          <br />
          公司統編：{" "}
          {user && user.recruiterInfo && user.recruiterInfo.team
            ? user.recruiterInfo.team.unifiedNumber
            : ""}
          <br />
          訂閱方案： {planPoints + (planPrice ? `（${planPrice}元 / 月）` : "")}
          <br />
          {paymentUrl &&
            "若確認資訊無誤後請在下方的第三方工具支付款項，請安心結帳。"}
        </DialogContentText>
        {paymentUrl && (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Iframe
              url={paymentUrl}
              width="710px"
              height={smMatches ? "800px" : "560px"}
              id="myId"
              display="inline"
              position="relative"
              className={classes.iframe}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={finish ? onFinish : close} color="primary">
          {finish ? "完成" : "重新選擇"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MemberPlanCard: React.FC<VisitorPlan> = props => {
  const { visitorsToBe, price, uuid } = props;
  const { getApi, user, reloadUser } = useAuth();
  const classes = useStyles();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [open, setOpen] = useState(false);

  const buyPoints = async () => {
    if (user && user.recruiterInfo && user.recruiterInfo.team) {
      const orderApi = await getApi("Order");
      const order = await orderApi.addOrder({
        teamId: user.recruiterInfo.team.uuid,
        visitorPlanId: uuid
      });
      order && order.token
        ? setPaymentUrl(
            `https://payment-stage.ecpay.com.tw/SP/SPCheckOut?MerchantID=2000214&PaymentType=CREDIT&SPToken=${order.token}`
          )
        : setPaymentUrl("");
    }
  };

  return (
    <Card className={classes.memberCard}>
      <div className={classes.memberCardTitle}>
        {visitorsToBe.toLocaleString() + " 點"}
      </div>
      <div className={classes.memberCardPrice}>
        {price.toLocaleString() + " 元"}
      </div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={async () => {
          await buyPoints();
          setOpen(true);
        }}
      >
        {"購買"}
      </Button>
      <MemberPlanDialog
        isOpen={open}
        onFinish={() => {
          !price && reloadUser();
          setOpen(false);
        }}
        close={() => setOpen(false)}
        planPoints={visitorsToBe}
        planPrice={price}
        paymentUrl={paymentUrl}
      />
    </Card>
  );
};

export { MemberPlanCard };
