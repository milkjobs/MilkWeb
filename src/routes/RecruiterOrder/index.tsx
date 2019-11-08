import { Order } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Header } from "components/Header";
import moment from "moment";
import "moment/locale/zh-tw";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
moment.locale("zh-tw");

const columns = ["交易序號", "金額", "付費日期"];

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
    justifyContent: "center",
    alignItems: "center",
    width: 960,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    marginBottom: 100
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  }
}));

const RecruiterOrder: React.FC = () => {
  const { getApi, user } = useAuth();
  const classes = useStyles();
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    const getTeamOrders = async () => {
      if (user && user.recruiterInfo && user.recruiterInfo.team) {
        const orderApi = await getApi("Order");
        const orders = await orderApi.getTeamOrders({
          teamId: user.recruiterInfo.team.uuid
        });
        orders && setOrders(orders);
      }
    };

    getTeamOrders();
  }, [getApi, user]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.title}>付費紀錄</div>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell key={i} align={"center"}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders.map((o, i) => {
                return (
                  o.amount && (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      <TableCell align={"center"}>{o.uuid}</TableCell>
                      <TableCell align={"center"}>{o.amount + "元"}</TableCell>
                      <TableCell align={"center"}>
                        {o.paidAt && moment(o.paidAt).format("LL")}
                      </TableCell>
                    </TableRow>
                  )
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecruiterOrder;
