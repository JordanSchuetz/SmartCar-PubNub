import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import GoogleMapReact from "google-map-react";
import ReactChartkick, { LineChart, PieChart } from "react-chartkick";
import Chart from "chart.js";
import styled from "styled-components";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PubNubReact from 'pubnub-react';
ReactChartkick.addAdapter(Chart);

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
`;

const SideMenu = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
`;
const Center = styled.div`
`;

const styles = {
  card: {
    maxWidth: "80%",
    margin: "auto"
  },
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {

  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
        publishKey: 'pub-c-a5669391-d317-44ec-a5f9-782e7bce9832',
        subscribeKey: 'sub-c-cc81b7b4-b523-11e8-80bd-3226ad0d6938'
    });
    this.pubnub.init(this);
  }

  componentWillMount() {
    this.pubnub.subscribe({
        channels: ['channel1'],
        withPresence: true
    });

    this.pubnub.getMessage('smartcar', (msg) => {
        console.log(msg);
    });

    this.pubnub.getStatus((st) => {
        this.pubnub.publish({
            message: 'hello world from react',
            channel: 'smartcar'
        });
    });
  }

componentWillUnmount() {
    this.pubnub.unsubscribe({
        channels: ['smartcar']
    });
}


  static defaultProps = {
    center: {
      lat: 37.783266,
      lng: -122.39944
    },
    zoom: 15
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.grow}>
            My Vehicle Dashboard
          </Typography>
          <Button color="inherit">Connect Vehicle</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Center>
          <Card className={classes.card}>
              <div style={{height: "70vh", width: "100%" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyC1AhKe8qh8W0jgIvfJdGu8Nr5_aXnvddQ"
                  }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                />
              </div>
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  Car Name
                </Typography>
                <Typography component="p">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Typography>
              </CardContent>
          </Card>
        </Center>
        <SideMenu>
            <Card styles={{width: "100%", height: "50px", psa:"20px 20px auto auto"}}>
              <CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                    Odometer Reading
                  </Typography>
                <LineChart
                  data={{
                    "2017-09-04": 100,
                    "2017-09-05": 80,
                    "2017-09-06": 70,
                    "2017-09-07": 130,
                    "2017-09-08": 10
                  }}
                />
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                    Interact with car
                  </Typography>
                  <Typography component="p">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Open Door
                </Button>
                <Button size="small" color="primary">
                  Open Trunk
                </Button>
              </CardActions>
            </Card>
        </SideMenu>
      </Container>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
