import { Order } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { OrderEntry } from "components/Point";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  }
}));

const History: React.FC = () => {
  const { getApi, user } = useAuth();
  const classes = useStyles();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageNo] = useState<number>(1);
  const [hasNoMore, setHasNoMore] = useState<boolean>(false);
  const pageSize = 20;

  useEffect(() => {
    const getOrders = async () => {
      if (user && user.recruiterInfo && user.recruiterInfo.team && !hasNoMore) {
        const orderApi = await getApi("Order");
        const fetchOrders = await orderApi.getTeamOrders({
          teamId: user.recruiterInfo.team.uuid,
          pageNo,
          pageSize
        });
        if (fetchOrders && fetchOrders.length < pageSize) setHasNoMore(true);
        fetchOrders && setOrders([...orders, ...fetchOrders]);
      }
    };

    getOrders();
  }, [pageNo, getApi, hasNoMore, orders, user]);

  return (
    <div className={classes.root}>
      {orders.length > 0 ? (
        orders.map(o => <OrderEntry key={o.uuid} order={o} />)
      ) : (
        <div style={{ margin: 16 }}>無購買紀錄</div>
      )}
    </div>
  );
};

export default History;
