import { length } from 'stringz';
import classNames from 'classnames';

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

    return (
      <div className='character-counter__wrapper'>
        <span className={classes}>{diff}</span>
      </div>
    )
  }

}
