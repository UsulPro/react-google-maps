import {
  default as expect,
} from "expect";

import {
  default as React,
} from "react";

import {
  unmountComponentAtNode,
  render,
} from "react-dom";

import * as maps from "../__mocks__/google.maps.mock";

import {
  withGoogleMap,
  GoogleMap,

  Circle,
  DirectionsRenderer,
  InfoWindow,
  Marker,
  OverlayView,
  Polygon,
  Polyline,
  Rectangle,
} from "../index";

describe(`index`, () => {
  it(`should be exported`, () => {
    expect(withGoogleMap).toExist();
    expect(GoogleMap).toExist();

    expect(Circle).toExist();
    expect(DirectionsRenderer).toExist();
    expect(InfoWindow).toExist();
    expect(Marker).toExist();
    expect(OverlayView).toExist();
    expect(Polygon).toExist();
    expect(Polyline).toExist();
    expect(Rectangle).toExist();
  });

  context(`combine withGoogleMap with GoogleMap`, () => {
    let Component;

    before(() => {
      global.google = { maps };
      Component = withGoogleMap(GoogleMap);
    });

    after(() => {
      delete global.google;
    });

    describe(`initialization`, () => {
      context(`global.google is undefined`, () => {
        let prevGoogle;

        before(() => {
          prevGoogle = global.google;
          delete global.google;
        });

        after(() => {
          global.google = prevGoogle;
        });

        it(`should warn and throw error`, () => {
          const warningSpy = expect.spyOn(console, `error`);
          expect(warningSpy).toNotHaveBeenCalled();

          let error;
          try {
            render((
              <Component
                containerElement={<div />}
                mapElement={<div />}
              />
            ), document.createElement(`div`));
          } catch (__e__) {
            error = __e__;
          }
          expect(error).toExist();
          expect(warningSpy).toHaveBeenCalled();

          warningSpy.restore();
        });
      });
    });

    describe(`rendering`, () => {
      let domEl;

      beforeEach(() => {
        domEl = document.createElement(`div`);
      });

      afterEach(() => {
        unmountComponentAtNode(domEl);
        domEl = null;
      });

      it(`should call setOptions during initial render`, () => {
        const setOptionsSpy = expect.spyOn(maps.Map.prototype, `setOptions`);
        expect(setOptionsSpy).toNotHaveBeenCalled();

        render((
          <Component
            containerElement={<div />}
            mapElement={<div />}
          />
        ), domEl);

        expect(setOptionsSpy).toHaveBeenCalled();

        setOptionsSpy.restore();
      });

      it(`should call setZoom when props.zoom changes`, () => {
        const setZoomSpy = expect.spyOn(maps.Map.prototype, `setZoom`);
        expect(setZoomSpy).toNotHaveBeenCalled();

        render((
          <Component
            containerElement={<div />}
            mapElement={<div />}
          />
        ), domEl);
        expect(setZoomSpy).toNotHaveBeenCalled();

        render((
          <Component
            containerElement={<div />}
            mapElement={<div />}
            zoom={10}
          />
        ), domEl);
        expect(setZoomSpy).toHaveBeenCalled();

        setZoomSpy.restore();
      });
    });
  });
});
