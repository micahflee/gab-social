import classNames from 'classnames';
import Overlay from 'react-overlays/lib/Overlay';
import Icon from '../icon';
import SearchPopout from '../search_popout';

import './search.scss';

export default class Search extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onShow: PropTypes.func.isRequired,
    openInRoute: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    searchTitle: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    withOverlay: PropTypes.bool,
    handleClear: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
  };

  handleFocus = () => {
    this.setState({ expanded: true });
    this.props.onShow();
  }

  handleBlur = () => {
    this.setState({ expanded: false });
  }

  render() {
    const { value, submitted, placeholder, className, searchTitle, onKeyUp, handleClear, handleSubmit, withOverlay, onChange } = this.props;
    const { expanded } = this.state;

    const hasValue = value.length > 0 || submitted;
    const classes = classNames('search', className);
    const iconClass = hasValue ? 'active' : '';

    return (
      <div className={classes}>
        <label>
          <span className='invisible'>{placeholder}</span>
          <input
            className='search__input'
            type='text'
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </label>

        <div role='button' tabIndex='0' className='search__icon' onClick={handleClear}>
          <Icon id='search' className={iconClass} />
          <Icon id='times-circle' className={iconClass} aria-label={placeholder} />
        </div>

        {
          withOverlay &&
          <Overlay show={expanded && !hasValue} placement='bottom' target={this}>
            <SearchPopout />
          </Overlay>
        }

        {
          (searchTitle && handleSubmit) &&
          <Button onClick={handleSubmit}>{intl.formatMessage(messages.searchTitle)}</Button>
        }

      </div>
    );
  }

}
