import _ from "lodash";

import {
  default as React,
  PropTypes,
} from "react";

import {
  MAP,
  SEARCH_BOX,
} from "../constants";

import {
  addDefaultPrefixToPropTypes,
  collectUncontrolledAndControlledProps,
  default as enhanceElement,
} from "../enhanceElement";

const controlledPropTypes = {
  // NOTICE!!!!!!
  //
  // Only expose those with getters & setters in the table as controlled props.
  //
  // [].map.call($0.querySelectorAll("tr>td>code", function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
  bounds: PropTypes.any,
};

const defaultUncontrolledPropTypes = addDefaultPrefixToPropTypes(controlledPropTypes);

const eventMap = {
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
  onPlacesChanged: `places_changed`,
};

const publicMethodMap = {
  // Public APIs
  //
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
  //
  // [].map.call($0.querySelectorAll("tr>td>code"), function(it){ return it.textContent; })
  //    .filter(function(it){ return it.match(/^get/) && !it.match(/Map$/); })
  getBounds(searchBox) { return searchBox.getBounds(); },

  getPlaces(searchBox) { return searchBox.getPlaces(); },
  // END - Public APIs
};

const controlledPropUpdaterMap = {
  bounds(searchBox, bounds) { searchBox.setBounds(bounds); },
};

function getInstanceFromComponent(component) {
  return component.state[SEARCH_BOX];
}

export default _.flowRight(
  React.createClass,
  enhanceElement(getInstanceFromComponent, publicMethodMap, eventMap, controlledPropUpdaterMap),
)({
  displayName: `SearchBox`,

  propTypes: {
    ...controlledPropTypes,
    ...defaultUncontrolledPropTypes,
  },

  contextTypes: {
    [MAP]: PropTypes.object,
  },

  getInitialState() {
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#SearchBox
    const searchBox = new google.maps.places.SearchBox({
      map: this.context[MAP],
      ...collectUncontrolledAndControlledProps(
        defaultUncontrolledPropTypes,
        controlledPropTypes,
        this.props
      ),
    });
    return {
      [SEARCH_BOX]: searchBox,
    };
  },

  componentWillUnmount() {
    const searchBox = this.state[SEARCH_BOX];
    if (searchBox) {
      searchBox.setMap(null);
    }
  },

  render() {
    return false;
  },
});
