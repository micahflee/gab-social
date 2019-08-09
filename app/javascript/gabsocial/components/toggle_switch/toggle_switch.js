import Toggle from 'react-toggle';

import './toggle_switch.scss';

export default class ToggleSwitch extends PureComponent {
  render() {
    return <Toggle {...this.props} />
  };
}