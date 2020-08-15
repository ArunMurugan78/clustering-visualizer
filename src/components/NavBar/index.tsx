import React, { Component, SyntheticEvent, ChangeEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  InputBase,
  withStyles,
  fade,
  Grid,
  Hidden,
  Fade,
  SvgIcon,
} from "@material-ui/core";
import { connect, ConnectedProps } from "react-redux";

import logo from "../../assets/logo.svg";
import { AlgorithmNames } from "../../common/algorithms.enum";
import GlobalActionTypes from "../../store/types/global.types";
import AlgorithmActionTypes from "../../store/types/algorithm.types";
import "./styles.css";
import Speed from "../../common/speed.enum";
import menuIcon from "../../assets/menu.svg";
import Drawer from "../Drawer";
import BlueButton from "../BlueButton";
import IterationModeDialog from "../IterationModeDialog";
import KMEANSMode from "../../common/kmeans.mode.enum";

// define types of Props and State

interface State {
  anchor1: (EventTarget & Element) | null;
  anchor2: (EventTarget & Element) | null;
  anchor3: (EventTarget & Element) | null;
  isDrawerOpen: boolean;
  isIterationModeDialogOpen: boolean;
}

// define mapStateToProps and mapDispatchToProps
const mapStateToProps = (state: any) => ({ global: state.global });

const mapDispatchToProps = {
  changeNumberOfClusters: (numberOfClusters: number) => ({
    type: GlobalActionTypes.SET_NUMBER_OF_CLUSTERS,
    payload: numberOfClusters,
  }),
  changeAlgorithm: (algo: AlgorithmNames) => ({
    type: GlobalActionTypes.SET_ALGORITHM,
    payload: algo,
  }),
  reset: () => ({ type: GlobalActionTypes.RESET }),
  startVisualization: () => ({ type: GlobalActionTypes.START_VISUALIZATION }),
  resetAlgorithmData: () => ({ type: AlgorithmActionTypes.RESET_DATA }),
  setSpeed: (speed: Speed) => ({
    type: GlobalActionTypes.SET_SPEED,
    payload: speed,
  }),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  classes: any;
};

// NavBar
class NavBar extends Component<Props, State> {
  state = {
    anchor1: null,
    anchor2: null,
    isDrawerOpen: false,
    anchor3: null,
    isIterationModeDialogOpen: false,
  };

  handleSpeeMenu = (event: SyntheticEvent) => {
    this.setState({ anchor2: event.currentTarget });
  };
  handleAlgorithmMenu = (event: SyntheticEvent) => {
    this.setState({ anchor1: event.currentTarget });
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    if (parseInt(e.target.value) >= 0) {
      this.props.changeNumberOfClusters(parseInt(e.target.value));
    } else {
      this.props.changeNumberOfClusters(0);
    }
  };

  handleSpeeMenuClose = (speed: Speed | null) => {
    this.setState({ anchor2: null });
    if (speed !== null)
      switch (speed) {
        case Speed.slow:
          this.props.setSpeed(Speed.slow);
          break;
        case Speed.average:
          this.props.setSpeed(Speed.average);
          break;
        case Speed.fast:
          this.props.setSpeed(Speed.fast);
          break;
        case Speed.faster:
          this.props.setSpeed(Speed.faster);
          break;
      }
  };

  handleAlgorithmClose = (algo: AlgorithmNames | null) => {
    this.setState({ anchor1: null });
    if (algo !== null)
      switch (algo) {
        case AlgorithmNames.KMEANS:
          this.props.changeAlgorithm(algo);
          break;
      }
  };

  isDisabled = (): boolean => {
    const { global } = this.props;

    if (
      global.numberOfClusters <= 1 ||
      global.algorithm === null ||
      global.coordinatesOfNodes.length < 5 ||
      global.start
    ) {
      return true;
    }

    return false;
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar
        elevation={0}
        className="appbar"
        color="transparent"
        style={{ color: "white" }}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Grid container alignItems="center" item xs={9} md={2} lg={4}>
              <Hidden smDown>
                <Grid
                  container
                  alignItems="flex-start"
                  style={{
                    height: "48px",
                    width: "auto",
                    marginRight: "20px",
                    padding: "10px",
                  }}
                  onClick={() => this.setState({ isDrawerOpen: true })}
                >
                  <img
                    src={menuIcon}
                    alt="menu"
                    style={{ height: "36px", width: "auto" }}
                  />
                </Grid>
              </Hidden>
              <Hidden only={["sm", "xs"]}>
                <img
                  src={logo}
                  alt="logo"
                  style={{ height: "48px", width: "auto" }}
                />
              </Hidden>
              <Hidden only={["md"]}>
                <Typography variant="h5" style={{ flexGrow: 1 }}>
                  Clustering Visualizer
                </Typography>
              </Hidden>
            </Grid>
            <Hidden only={["md", "lg", "xl"]}>
              <Grid
                container
                alignItems="center"
                justify="flex-end"
                item
                style={{ height: "48px", width: "auto" }}
                onClick={() => this.setState({ isDrawerOpen: true })}
                xs={3}
              >
                <img
                  src={menuIcon}
                  alt="menu"
                  style={{ height: "36px", width: "auto" }}
                />
              </Grid>
            </Hidden>
            <Hidden smDown>
              <Grid
                container
                alignItems="center"
                justify="flex-end"
                item
                xs={12}
                md={10}
                lg={8}
              >
                <Fade
                  in={this.props.global.algorithm === AlgorithmNames.KMEANS}
                >
                  <InputBase
                    placeholder="Number of Clusters"
                    style={{ maxWidth: "180px" }}
                    color="secondary"
                    value={
                      this.props.global.numberOfClusters === 0
                        ? ""
                        : this.props.global.numberOfClusters
                    }
                    onChange={this.handleInputChange}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    className={classes.input}
                    type="number"
                  />
                </Fade>
                <Fade
                  in={this.props.global.algorithm === AlgorithmNames.KMEANS}
                >
                  <Button
                    size="small"
                    variant="contained"
                    style={{ marginRight: "20px" }}
                    onClick={() =>
                      this.setState({ isIterationModeDialogOpen: true })
                    }
                    startIcon={
                      <SvgIcon>
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                      </SvgIcon>
                    }
                  >
                    {this.props.global.mode === KMEANSMode.SingleIteration
                      ? "Single Iteration Mode"
                      : this.props.global.mode === KMEANSMode.MultipleIteration
                      ? `Multiple Iterations - ${this.props.global.maxIterations}`
                      : `Find best value of K - ${this.props.global.maxIterations}`}
                  </Button>
                </Fade>

                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  size="small"
                  onClick={this.handleAlgorithmMenu}
                  startIcon={
                    <SvgIcon>
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                    </SvgIcon>
                  }
                  variant="contained"
                  style={{ marginRight: "20px" }}
                >
                  {this.props.global.algorithm === null
                    ? "Select Algorithm"
                    : this.props.global.algorithm}
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  aria-haspopup="true"
                  onClick={this.handleSpeeMenu}
                  style={{ marginRight: "20px" }}
                  startIcon={
                    <SvgIcon>
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                    </SvgIcon>
                  }
                >
                  {this.props.global.speed === null
                    ? "Select Speed"
                    : this.props.global.speed === Speed.slow
                    ? "Slow"
                    : this.props.global.speed === Speed.average
                    ? "Average"
                    : this.props.global.speed === Speed.fast
                    ? "Fast"
                    : "Faster"}
                </Button>

                <BlueButton
                  variant="contained"
                  size="small"
                  className={classes.startButton}
                  onClick={() => {
                    this.props.startVisualization();
                  }}
                  disabled={this.isDisabled()}
                >
                  Start
                </BlueButton>
              </Grid>
            </Hidden>
          </Grid>
        </Toolbar>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor1}
          keepMounted
          open={this.state.anchor1 !== null}
          style={{ zIndex: 10000 }}
          onClose={() => this.handleAlgorithmClose(null)}
        >
          <MenuItem
            onClick={() => this.handleAlgorithmClose(AlgorithmNames.KMEANS)}
          >
            K Means
          </MenuItem>
        </Menu>
        <Menu
          id="menu-speed"
          anchorEl={this.state.anchor2}
          keepMounted
          style={{ zIndex: 10000 }}
          open={this.state.anchor2 !== null}
          onClose={() => this.handleSpeeMenuClose(null)}
        >
          <MenuItem onClick={() => this.handleSpeeMenuClose(Speed.slow)}>
            Slow
          </MenuItem>
          <MenuItem onClick={() => this.handleSpeeMenuClose(Speed.average)}>
            Average
          </MenuItem>
          <MenuItem onClick={() => this.handleSpeeMenuClose(Speed.fast)}>
            Fast
          </MenuItem>
          <MenuItem onClick={() => this.handleSpeeMenuClose(Speed.faster)}>
            Faster
          </MenuItem>
        </Menu>
        <Drawer
          isDisabled={this.isDisabled}
          handleSpeeMenu={this.handleSpeeMenu}
          handleAlgorithmMenu={this.handleAlgorithmMenu}
          open={this.state.isDrawerOpen}
          onOpen={() => this.setState({ isDrawerOpen: true })}
          onClose={() => this.setState({ isDrawerOpen: false })}
        />
        {this.state.isIterationModeDialogOpen ? (
          <IterationModeDialog
            open={this.state.isIterationModeDialogOpen}
            onClose={() => this.setState({ isIterationModeDialogOpen: false })}
          />
        ) : null}
      </AppBar>
    );
  }
}

export default withStyles((theme) => ({
  input: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },

  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}))(connector(NavBar));
