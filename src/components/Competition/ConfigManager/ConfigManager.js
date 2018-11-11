import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import RoomsConfig from './RoomsConfig/RoomsConfig';
import RoundsConfig from './RoundsConfig/RoundsConfig';
import { getExpectedCompetitorsByRound } from '../../../logic/competitors';
import { roomsConfigComplete, activitiesConfigComplete } from '../../../logic/activities';

export default class ConfigManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localWcif: props.wcif,
      tabValue: 0
    };
    this.expectedCompetitorsByRound = getExpectedCompetitorsByRound(props.wcif);
  }

  handleWcifChange = wcif => {
    this.setState({ localWcif: wcif });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  wcifConfigComplete() {
    const { localWcif } = this.state;
    return roomsConfigComplete(localWcif) && activitiesConfigComplete(localWcif);
  }

  render() {
    const { tabValue, localWcif } = this.state;
    const { onWcifUpdate } = this.props;

    return (
      <Grid container spacing={8} justify="flex-end">
        <Grid item xs={12}>
          <AppBar position="static" color="default">
            <Tabs value={tabValue} onChange={this.handleTabChange} centered>
              <Tab label="Rooms" />
              <Tab label="Rounds" disabled={!roomsConfigComplete(localWcif)} />
              <Tab label="General" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          {tabValue === 0 && (
            <RoomsConfig wcif={localWcif} onWcifChange={this.handleWcifChange} />
          )}
          {tabValue === 1 && (
            <RoundsConfig wcif={localWcif} onWcifChange={this.handleWcifChange} expectedCompetitorsByRound={this.expectedCompetitorsByRound} />
          )}
          {tabValue === 2 && (
            <Paper>
              <Typography>General settings</Typography>
            </Paper>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" component={Link} to={`/competitions/${localWcif.id}`}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onWcifUpdate(localWcif)}
            component={Link}
            to={`/competitions/${localWcif.id}`}
            disabled={!this.wcifConfigComplete()}
          >
            Done
          </Button>
        </Grid>
      </Grid>
    );
  }
}
