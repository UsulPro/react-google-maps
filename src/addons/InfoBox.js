import _ from "lodash";

import {
  default as React,
  PropTypes,
  Children,
} from "react";

import {
  render,
} from "react-dom";

import {
  default as GoogleMapsInfobox,
} from "google-maps-infobox";

import {
  MAP,
  ANCHOR,
  INFO_BOX,
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
  // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
  content: PropTypes.any,
  options: PropTypes.object,
  position: PropTypes.any,
  visible: PropTypes.bool,
  zIndex: PropTypes.number,
};

const defaultUncontrolledPropTypes = addDefaultPrefixToPropTypes(controlledPropTypes);

const eventMap = {
  // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
  onCloseClick: `closeclick`,
  // `content_changed`,
  // `domready`,
  // `position_changed`,
  // `zindex_changed`,
};

const publicMethodMap = {
  // Public APIs
  //
  // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
  getPosition(infoBox) { return infoBox.getPosition(); },

  getVisible(infoBox) { return infoBox.getVisible(); },

  getZIndex(infoBox) { return infoBox.getZIndex(); },
  // END - Public APIs
};

const controlledPropUpdaterMap = {
  children(infoWindow, children) {
    render(Children.only(children), infoWindow.getContent());
  },
  content(infoWindow, content) {
    render(Children.only(content), infoWindow.getContent());
  },
  options(infoBox, options) { infoBox.setOptions(options); },
  position(infoBox, position) { infoBox.setPosition(position); },
  visible(infoBox, visible) { infoBox.setVisible(visible); },
  zIndex(infoBox, zIndex) { infoBox.setZIndex(zIndex); },
};

function getInstanceFromComponent(component) {
  return component.state[INFO_BOX];
}

export default _.flowRight(
  React.createClass,
  enhanceElement(getInstanceFromComponent, publicMethodMap, eventMap, controlledPropUpdaterMap),
)({
  displayName: `InfoBox`,

  propTypes: {
    ...controlledPropTypes,
    ...defaultUncontrolledPropTypes,
  },

  contextTypes: {
    [MAP]: PropTypes.object,
    [ANCHOR]: PropTypes.object,
  },

  getInitialState() {
    const map = this.context[MAP];
    // http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
    const infoBox = new GoogleMapsInfobox({
      map,
      ...collectUncontrolledAndControlledProps(
        defaultUncontrolledPropTypes,
        controlledPropTypes,
        this.props
      ),
      // Override props of ReactElement type
      content: document.createElement(`div`),
      children: undefined,
    });
    const anchor = this.context[ANCHOR];
    if (anchor) {
      infoBox.open(map, anchor);
    }
    return {
      [INFO_BOX]: infoBox,
    };
  },

  componentWillUnmount() {
    const infoBox = this.state[INFO_BOX];
    if (infoBox) {
      infoBox.setMap(null);
    }
  },

  render() {
    return false;
  },
});
