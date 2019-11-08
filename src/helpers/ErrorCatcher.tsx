import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as Sentry from "@sentry/browser";
import { Header } from "components/Header";
import { ErrorStatus } from "components/Util";
import React, { Component, ErrorInfo } from "react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      backgroundColor: theme.palette.background.default
    }
  });

interface States {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

// https://docs.sentry.io/platforms/javascript/react/
class ErrorCatcher extends Component<WithStyles<typeof styles>, States> {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, eventId: null };
  }

  componentDidCatch = (error: Error, errorInfo: ErrorInfo) => {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ error, errorInfo, eventId });
    });
  };

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={this.props.classes.root}>
          <Header />
          <ErrorStatus
            subheader="發生了預期之外的錯誤"
            description="錯誤代碼：500。我們正在解決這個問題！將會在短時間內恢復正常。"
          />
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default withStyles(styles)(ErrorCatcher);
