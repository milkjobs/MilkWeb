import { VisitorPlan } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import { mdiEyeCheckOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { BuyDialog } from "components/Point";
import { PurchaseMethod } from "helpers";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: theme.palette.background.default
  },
  plansContainer: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      flexDirection: "row",
      justifyItems: "space-around"
    },
    flexDirection: "column"
  },
  plan: {
    display: "flex",
    cursor: "pointer",
    margin: 5,
    justifyContent: "center",
    height: 160,
    padding: 24,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    textAlign: "left",
    fontSize: 16,
    flexDirection: "column",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.up("md")]: {
      flex: 1,
      marginTop: 32,
      marginBottom: 32
    }
  },
  visitorToBe: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

const Buy: React.FC = () => {
  const { getApi } = useAuth();
  const classes = useStyles();
  const [visitorPlans, setVisitorPlans] = useState<VisitorPlan[]>();
  const [selectedPlan, setSelectedPlan] = useState<VisitorPlan>();
  const [method, setMethod] = useState(PurchaseMethod.Credit);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getVisitorPlans = async () => {
      const membershpiApi = await getApi("Membership");
      const [, fetchedPlans] = await to(membershpiApi.getVisitorPlans());
      setVisitorPlans(fetchedPlans);
    };

    getVisitorPlans();
  }, [getApi]);

  return (
    <div className={classes.root}>
      <ButtonGroup color="primary">
        <Button
          onClick={() => setMethod(PurchaseMethod.Credit)}
          variant={method === PurchaseMethod.Credit ? "contained" : undefined}
        >
          信用卡
        </Button>
        <Button
          onClick={() => setMethod(PurchaseMethod.ATM)}
          variant={method === PurchaseMethod.ATM ? "contained" : undefined}
        >
          ATM 轉帳
        </Button>
      </ButtonGroup>
      <div className={classes.plansContainer}>
        {visitorPlans &&
          visitorPlans.map((p, i) => (
            <div
              key={i}
              className={classes.plan}
              onClick={() => {
                setOpen(true);
                setSelectedPlan(p);
              }}
            >
              <div className={classes.visitorToBe}>
                <Icon
                  path={mdiEyeCheckOutline}
                  size={0.7}
                  style={{ marginRight: 4 }}
                />
                {p.visitorsToBe.toLocaleString()}
              </div>
              <div>{p.price.toLocaleString() + " 元"}</div>
            </div>
          ))}
      </div>
      {selectedPlan && (
        <BuyDialog
          open={open}
          handleClose={() => setOpen(false)}
          method={method}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Buy;
