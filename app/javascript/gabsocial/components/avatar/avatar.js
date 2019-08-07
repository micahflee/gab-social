import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Map as ImmutableMap } from 'immutable';
import classNames from 'classnames';
import { autoPlayGif } from '../../initial_state';

import './avatar.scss';

export default class Avatar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    size: PropTypes.number,
    inline: PropTypes.bool,
    animate: PropTypes.bool,
  };

  static defaultProps = {
    account: ImmutableMap(),
    animate: autoPlayGif,
    inline: false,
  };

  state = {
    hovering: false,
    sameImg: this.props.account.get('avatar') === this.props.account.get('avatar_static'),
  };

  handleMouseEnter = () => {
    if (this.props.animate || this.state.sameImg) return;

    this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    if (this.props.animate || this.state.sameImg) return;

    this.setState({ hovering: false });
  }

  render () {
    const { account, size, animate, inline } = this.props;
    const { hovering } = this.state;

    // : TODO : remove inline and change all avatars to be sized using css
    const style = !size ? {} : {
      width: `${size}px`,
      height: `${size}px`,
    };

    const theSrc = account.get((hovering || animate) ? 'avatar' : 'avatar_static');

    const className = classNames('account__avatar', {
      'account__avatar--inline': inline,
    });

    return (
      <img
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
        src={theSrc}
        alt={account.get('display_name')}
      />
    );
  }

}
