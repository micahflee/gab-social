import classNames from 'classnames/bind';
import Overlay from 'react-overlays/lib/Overlay';
import Icon from '../icon';
import SearchPopout from '../search_popout';

const cx = classNames.bind(_s)

export default class Search extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    // value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    // onShow: PropTypes.func.isRequired,
    openInRoute: PropTypes.bool,
    // placeholder: PropTypes.string.isRequired,
    searchTitle: PropTypes.string,
    // onChange: PropTypes.func.isRequired,
    // onKeyUp: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    withOverlay: PropTypes.bool,
    // handleClear: PropTypes.func.isRequired,
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
    const { value, submitted, placeholder, searchTitle, onKeyUp, handleClear, handleSubmit, withOverlay, onChange } = this.props;
    const { expanded } = this.state;

    const hasValue = value ? value.length > 0 || submitted : 0;

    const btnClasses = cx({
      default: 1,
      cursorPointer: 1,
      marginRight5PX: 1,
      paddingHorizontal10PX: 1,
      paddingVertical10PX: 1,
      circle: 1,
      backgroundColorBrandLight: 1,
      displayNone: !hasValue,
    })

    return (
      <div className={[_s.default, _s.justifyContentCenter, _s.height53PX].join(' ')}>
        <div className={[_s.default, _s.backgroundWhite, _s.border1PX, _s.bordercolorSecondary, _s.flexRow, _s.circle, _s.alignItemsCenter].join(' ')}>
          <Icon id='search' width='16px' height='16px' className={[_s.default, _s.marginLeft15PX, _s.marginRight10PX].join(' ')} />
          <input
            className={[_s.default, _s.text, _s.outlineFocusBrand, _s.lineHeight125, _s.displayBlock, _s.paddingVertical10PX, _s.paddingHorizontal10PX, _s.backgroundTransparent, _s.fontSize15PX, _s.flexGrow1].join(' ')}
            type='text'
            placeholder='Search on Gab...'
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <div role='button' tabIndex='0' className={btnClasses} onClick={handleClear}>
            <Icon id='close' width='10px' height='10px' className={_s.fillColorWhite} aria-label={placeholder} />
          </div>
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
