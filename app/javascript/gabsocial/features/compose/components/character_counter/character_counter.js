import { length } from 'stringz';
import classNames from 'classnames';

import './character_counter.scss';

export default class CharacterCounter extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
  };

  render () {
    const diff = this.props.max - length(this.props.text);

    const classes = classNames('character-counter', {
      'character-counter--over': (diff < 0),
    });

    <div className='character-counter__wrapper'>
      <span className={classes}>{diff}</span>
    </div>
  }

}
