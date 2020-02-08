import classNames from 'classnames';
import Overlay from 'react-overlays/lib/Overlay';
import Icon from '../icon';
import SearchPopout from '../search_popout';

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
    const { value, submitted, placeholder, searchTitle, onKeyUp, handleClear, handleSubmit, withOverlay, onChange } = this.props;
    const { expanded } = this.state;

    const hasValue = value ? value.length > 0 || submitted : 0;
    const iconClass = hasValue ? 'active' : '';

    return (
      <div className={[styles.default, styles.justifyContentCenter, styles.height53PX].join(' ')}>
        <div className={[styles.default, styles.backgroundWhite, styles.border1PX, styles.borderColorSubtle, styles.flexRow, styles.circle, styles.alignItemsCenter].join(' ')}>
          <Icon id='search' width='16px' height='16px' className={[styles.default, styles.marginLeft15PX, styles.marginRight10PX].join(' ')} />
          <input
            className={[styles.default, styles.text, styles.outlineFocusBrand, styles.lineHeight125, styles.displayBlock, styles.paddingVertical10PX, styles.paddingHorizontal10PX, styles.backgroundTransparent, styles.fontSize15PX, styles.flexGrow1].join(' ')}
            type='text'
            placeholder='Search on Gab...'
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <div role='button' tabIndex='0' className={[styles.default, styles.cursorPointer, styles.marginRight5PX, styles.paddingHorizontal10PX, styles.paddingVertical10PX, styles.circle, styles.backgroundColorBrandLight].join(' ')} onClick={handleClear}>
            <Icon id='close' width='10px' height='10px' className={styles.fillColorWhite} aria-label={placeholder} />
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
