import React, { ChangeEvent, Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Typography, withStyles } from '@material-ui/core';
import { fade, InputBase, Grid } from '@material-ui/core';

import AlgorithmNames from '../../../../common/algorithms.enum';
import { Slider } from '../../../../components';
import { CommonNavBar } from '../../../../components';
import { GlobalActionTypes, RootState, DBSCANAlgorithmActionTypes } from '../../../../reduxStore';

const mapStateToProps = (state: RootState) => ({ global: state.global, dbscan: state.dbscan });

const mapDispatchToProps = {
    setAlgorithm: (algo: AlgorithmNames) => ({
        type: GlobalActionTypes.SET_ALGORITHM,
        payload: algo,
    }),
    setMinPts: (minpts: number) => ({ type: DBSCANAlgorithmActionTypes.SET_MIN_POINTS, payload: minpts }),
    setEps: (eps: number) => ({ type: DBSCANAlgorithmActionTypes.SET_EPSILON, payload: eps }),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    classes: any;
};

type State = any;

class NavBar extends Component<Props, State> {
    state = {};

    componentDidMount() {
        if (this.props.global.algorithm !== AlgorithmNames.DBSCAN) this.props.setAlgorithm(AlgorithmNames.DBSCAN);
    }
    componentDidUpdate() {
        if (this.props.global.algorithm !== AlgorithmNames.DBSCAN) this.props.setAlgorithm(AlgorithmNames.DBSCAN);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <CommonNavBar
                    isSliderDisabled={this.props.dbscan.render.length !== 0}
                    disabled={() => this.props.dbscan.minPts <= 1 && this.props.dbscan.eps <= 10}
                    drawerChildren={[
                        <Grid container justify="center" alignItems="center" key={0}>
                            <Grid
                                container
                                direction="column"
                                style={{
                                    width: '100%',
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginTop: '10px',
                                    maxWidth: '500px',
                                }}
                            >
                                <Typography>Min Points</Typography>
                                <Slider
                                    disabled={this.props.global.start}
                                    valueLabelDisplay="auto"
                                    color="secondary"
                                    min={1}
                                    max={20}
                                    value={this.props.dbscan.minPts}
                                    onChange={(e, val) => this.props.setMinPts(val as number)}
                                />
                            </Grid>
                        </Grid>,
                        <Grid container justify="center" alignItems="center" key={1}>
                            <Grid
                                container
                                direction="column"
                                style={{
                                    width: '100%',
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginTop: '10px',
                                    maxWidth: '500px',
                                }}
                            >
                                <Typography>Epsilon</Typography>
                                <Slider
                                    disabled={this.props.global.start}
                                    valueLabelDisplay="auto"
                                    color="secondary"
                                    min={20}
                                    max={100}
                                    value={this.props.dbscan.eps}
                                    onChange={(e, val) => this.props.setEps(val as number)}
                                />
                            </Grid>
                        </Grid>,
                    ]}
                >
                    {[
                        <Grid
                            key={0}
                            container
                            direction="column"
                            style={{ maxWidth: '150px', marginLeft: '10px', marginRight: '10px' }}
                        >
                            <Typography>Min Points</Typography>
                            <Slider
                                disabled={this.props.global.start}
                                valueLabelDisplay="auto"
                                color="secondary"
                                min={1}
                                max={20}
                                value={this.props.dbscan.minPts}
                                onChange={(e, val) => this.props.setMinPts(val as number)}
                            />
                        </Grid>,

                        <Grid
                            key={1}
                            container
                            direction="column"
                            style={{ maxWidth: '150px', marginLeft: '10px', marginRight: '20px' }}
                        >
                            <Typography>Epsilon</Typography>
                            <Slider
                                disabled={this.props.global.start}
                                valueLabelDisplay="auto"
                                color="secondary"
                                min={20}
                                max={100}
                                value={this.props.dbscan.eps}
                                onChange={(e, val) => this.props.setEps(val as number)}
                            />
                        </Grid>,
                    ]}
                </CommonNavBar>
            </div>
        );
    }
}

export default withStyles((theme) => ({
    input: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    },

    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(0.75, 1, 0.75, 1),
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1.15, 1, 1.15, 1),
        },
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}))(connector(NavBar));
