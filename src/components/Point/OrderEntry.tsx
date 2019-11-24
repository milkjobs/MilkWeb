import { Order } from "@frankyjuang/milkapi-client";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@mdi/react";
import { mdiEyeCheckOutline } from "@mdi/js";

const useStyles = makeStyles(theme => ({
  costCard: {
    display: "flex",
    flexDirection: "row",
    padding: 24,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: 1,
    borderBottomStyle: "solid"
  },
  costNameContainer: {
    flex: 2,
    display: "flex",
    flexDirection: "column"
  },
  costName: {
    fontSize: 18,
    color: theme.palette.text.primary,
    textAlign: "left"
  },
  time: {
    fontSize: 16,
    color: theme.palette.text.primary,
    marginTop: 4,
    textAlign: "left"
  },
  costNumberContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: "auto",
    alignItems: "flex-end"
  },
  viewNumber: {
    fontSize: 18,
    color: theme.palette.text.primary
  },
  costNumber: {
    fontSize: 16,
    marginTop: 4,
    color: theme.palette.text.hint
  },
  eyeCheckIcon: {
    marginLeft: 4,
    marginRight: 4,
    color: theme.palette.text.primary
  }
}));

interface OrderProps {
  order: Order;
}

const OrderEntry: React.FC<OrderProps> = props => {
  const { order } = props;
  const classes = useStyles();
  return (
    <div className={classes.costCard}>
      <div className={classes.time}>{order.lastUpdatedAt.toLocaleString()}</div>
      <div className={classes.costNumberContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Icon
            className={classes.eyeCheckIcon}
            path={mdiEyeCheckOutline}
            size={0.7}
          />
          <div className={classes.viewNumber}>{order.visitorsToBe}</div>
        </div>
        <div className={classes.viewNumber}>{order.amount + "元"}</div>
      </div>
    </div>
  );
};

export { OrderEntry };
