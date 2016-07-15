import {
  default as invariant,
} from "invariant";

import {
  default as canUseDOM,
} from "can-use-dom";

import {
  default as getDisplayName,
} from "react-display-name";

import {
  default as React,
  PropTypes,
  Component,
} from "react";

const LOAIDNG_STATE_NONE = `NONE`;
const LOAIDNG_STATE_BEGIN = `BEGIN`;
const LOAIDNG_STATE_LOADED = `LOADED`;

export default function withScriptjs(WrappedComponent) {
  return class Container extends Component {
    static displayName = `withScriptjs(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      loadingElement: PropTypes.node.isRequired,
      googleMapURL: PropTypes.string.isRequired,
    };

    state = {
      loadingState: LOAIDNG_STATE_NONE,
    };

    handleComponentMount = ::this.handleComponentMount;

    componentWillMount() {
      const {
        loadingElement,
        googleMapURL,
      } = this.props;
      invariant(!!loadingElement && !!googleMapURL,
`Required props loadingElement or googleMapURL is missing. You need to provide both of them.`
      );
    }

    handleComponentMount(node) {
      const {
        loadingState,
      } = this.state;
      if (
        loadingState === LOAIDNG_STATE_LOADED ||
        loadingState === LOAIDNG_STATE_BEGIN ||
        node === null ||
        !canUseDOM
      ) {
        return;
      }
      this.setState({
        loadingState: LOAIDNG_STATE_BEGIN,
      });
      // Don't load scriptjs as dependency since we want this module be used on server side.
      // eslint-disable-next-line global-require
      const scriptjs = require(`scriptjs`);
      const {
        googleMapURL,
      } = this.props;
      scriptjs(googleMapURL, () => this.setState({
        loadingState: LOAIDNG_STATE_LOADED,
      }));
    }

    render() {
      const {
        loadingElement,
        googleMapURL, // eslint-disable-line no-unused-vars
        ...restProps,
      } = this.props;

      const {
        loadingState,
      } = this.state;

      if (loadingState === LOAIDNG_STATE_LOADED) {
        return (
          <WrappedComponent {...restProps} />
        );
      } else {
        return (
          React.cloneElement(loadingElement, {
            ref: this.handleComponentMount,
          })
        );
      }
    }
  };
}
