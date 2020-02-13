import { VisitorPlan } from "@frankyjuang/milkapi-client";
import { Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/styles";
import { paymentUrl } from "config";
import { PurchaseMethod } from "helpers";
import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { Link } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    infoContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    info: {
      fontSize: 16,
      color: theme.palette.text.primary
    },
    error: {
      fontSize: 16,
      color: theme.palette.error.main
    },
    link: {
      fontSize: 16,
      color: theme.palette.text.primary,
      cursor: "pointer",
      textDecoration: "underline"
    }
  })
);

interface BuyDialogProps {
  open: boolean;
  handleClose: () => void;
  plan: VisitorPlan;
  method: PurchaseMethod;
}

const BuyDialog: React.FC<BuyDialogProps> = ({
  open,
  handleClose,
  plan,
  method
}) => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState(false);
  const [readErrorMessage, setReadErrorMessage] = useState("");
  const [url, setUrl] = useState("");

  const addOrder = async (plan: VisitorPlan) => {
    if (user && user.recruiterInfo && user.recruiterInfo.team) {
      setLoading(true);
      const orderApi = await getApi("Order");
      const order = await orderApi.addOrder({
        teamId: user.recruiterInfo.team.uuid,
        visitorPlanId: plan.uuid
      });
      setLoading(false);
      if (order && order.token) {
        setUrl(
          paymentUrl(
            method === PurchaseMethod.Credit ? "CREDIT" : "ATM",
            order.token
          )
        );
      }
    }
  };

  useEffect(() => {
    read && setReadErrorMessage("");
  }, [read]);

  useEffect(() => {
    if (!open) {
      setRead(false);
      setReadErrorMessage("");
      setUrl("");
    }
  }, [open]);

  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">購買點閱人數</DialogTitle>
        {url ? (
          <DialogContent>
            <Iframe
              url={url}
              width="100%"
              height="500px"
              id="myId"
              frameBorder={0}
              position="relative"
            />
          </DialogContent>
        ) : (
          <DialogContent>
            <div className={classes.infoContainer}>
              <div className={classes.info}>購買：</div>
              <div className={classes.info}>
                {plan.visitorsToBe.toLocaleString() + " 個點閱人數"}
              </div>
            </div>
            <div className={classes.infoContainer}>
              <div className={classes.info}>費用：</div>
              <div className={classes.info}>
                {plan.price.toLocaleString() + " 元"}
              </div>
            </div>
            <div className={classes.infoContainer}>
              <div className={classes.info}>付款方式：</div>
              <div className={classes.info}>
                {method === PurchaseMethod.Credit ? "信用卡" : "ATM 轉帳"}
              </div>
            </div>
            <div className={classes.info}>
              詳閱服務條款，且確認無誤後，將跳轉到第三方網站，請安心付款。
            </div>
            <div className={classes.infoContainer}>
              <Checkbox
                checked={read}
                onChange={() => setRead(!read)}
                color="primary"
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
              <div className={classes.info}>以詳閱並同意</div>
              <Link
                to={"/help/tos#第五章-商品購買"}
                target="_blank"
                className={classes.link}
              >
                服務條款
              </Link>
            </div>
            <div className={classes.error}>{readErrorMessage}</div>
          </DialogContent>
        )}
        <DialogActions>
          {url ? (
            <Button onClick={handleClose} color="primary">
              結束
            </Button>
          ) : (
            <>
              <Button onClick={handleClose} color="primary">
                取消
              </Button>
              {loading ? (
                <CircularProgress
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 20,
                    marginRight: 20
                  }}
                />
              ) : (
                <Button
                  onClick={() => {
                    !read && setReadErrorMessage("請閱讀並同意服務條款");
                    read && addOrder(plan);
                  }}
                  color="primary"
                >
                  {method === PurchaseMethod.Credit
                    ? "付款"
                    : "取得 ATM 轉帳資訊"}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { BuyDialog };
