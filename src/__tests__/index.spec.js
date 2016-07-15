import {
  default as expect,
} from "expect";

import {
  withGoogleMap,
  GoogleMap,

  Circle,
  DirectionsRenderer,
  DrawingManager,
  InfoWindow,
  Marker,
  OverlayView,
  Polygon,
  Polyline,
  Rectangle,
  SearchBox,
} from "../index";

describe(`index`, () => {
  it(`should be exported`, () => {
    expect(withGoogleMap).toExist();
    expect(GoogleMap).toExist();

    expect(Circle).toExist();
    expect(DirectionsRenderer).toExist();
    expect(DrawingManager).toExist();
    expect(InfoWindow).toExist();
    expect(Marker).toExist();
    expect(OverlayView).toExist();
    expect(Polygon).toExist();
    expect(Polyline).toExist();
    expect(Rectangle).toExist();
    expect(SearchBox).toExist();
  });
});
