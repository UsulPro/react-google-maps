import _ from "lodash";

import {
  default as React,
  Component,
  PropTypes,
} from "react";

import {
  default as update,
} from "react-addons-update";

import {
  default as FaSpinner,
} from "react-icons/lib/fa/spinner";

import {
  default as withScriptjs,
} from "react-google-maps/lib/async/withScriptjs";

import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
const AsyncGettingStartedGoogleMap = _.flowRight(
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));

export default class AsyncGettingStarted extends Component {

  static propTypes = {
    toast: PropTypes.func.isRequired,
  };

  state = {
    markers: [{
      position: {
        lat: 25.0112183,
        lng: 121.52067570000001,
      },
      key: `Taiwan`,
      defaultAnimation: 2,
    }],
  }

  handleMapLoad = ::this.handleMapLoad;
  handleMapClick = ::this.handleMapClick;
  handleMarkerRightClick = ::this.handleMarkerRightClick;

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    let { markers } = this.state;
    markers = update(markers, {
      $push: [
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
        },
      ],
    });
    this.setState({ markers });

    if (markers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMarkerRightClick(index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    let { markers } = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1],
      ],
    });
    this.setState({ markers });
  }

  render() {
    return (
      <AsyncGettingStartedGoogleMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={
          <div style={{ height: `100%` }}>
            <FaSpinner
              style={{
                display: `block`,
                margin: `150px auto`,
                animation: `fa-spin 2s infinite linear`,
              }}
            />
          </div>
        }
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        onMapLoad={this.handleMapLoad}
        onMapClick={this.handleMapClick}
        markers={this.state.markers}
        onMarkerRightClick={this.handleMarkerRightClick}
      />
    );
  }
}
