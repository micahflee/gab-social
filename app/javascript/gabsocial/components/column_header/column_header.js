import { Fragment } from 'react';
import classNames from 'classnames';
import { injectIntl, defineMessages } from 'react-intl';
import Icon from '../icon';

import './column_header.scss';

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
});

export default @injectIntl
class ColumnHeader extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    title: PropTypes.node,
    icon: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.node,
  };

  state = {
    collapsed: true,
  };

  historyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home'); // homehack
    } else {
      this.context.router.history.goBack();
    }
  }

  handleToggleClick = (e) => {
    e.stopPropagation();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleBackClick = () => {
    this.historyBack();
  }

  render () {
    const { title, icon, active, children, intl: { formatMessage } } = this.props;
    const { collapsed } = this.state;

    const wrapperClassName = classNames('column-header__wrapper', {
      'column-header__wrapper--active': active,
    });

    const buttonClassName = classNames('column-header', {
      'column-header--active': active,
    });

    const btnTitle = formatMessage(collapsed ? messages.show : messages.hide);
    const hasTitle = icon && title;
    const hasChildren = !!children;

    if (!hasChildren && !hasTitle) {
      return null;
    } else if (!hasChildren && hasTitle) {
      return (
        <div className={wrapperClassName}>
          <h1 className={buttonClassName}>
            <Icon id={icon} fixedWidth className='column-header__icon' />
            {title}
          </h1>
        </div>
      );
    }

    const collapsibleClassName = classNames('column-header__collapsible', {
      'column-header__collapsible--collapsed': collapsed,
    });

    const collapsibleButtonClassName = classNames('column-header__button', {
      'column-header__button--active': !collapsed,
    });

    return (
      <div className={wrapperClassName}>
        <h1 className={buttonClassName}>
          {
            hasTitle && (
              <Fragment>
                <Icon id={icon} fixedWidth className='column-header__icon' />
                {title}
              </Fragment>
            )
          }

          <button
            className={collapsibleButtonClassName}
            title={btnTitle}
            aria-label={btnTitle}
            aria-pressed={!collapsed}
            onClick={this.handleToggleClick}
          >
            <Icon id='sliders' />
          </button>
        </h1>

        <div className={collapsibleClassName} tabIndex={collapsed ? -1 : null}>
          <div className='column-header__collapsible-inner'>
            {
              !collapsed &&
              <div key='extra-content' className='column-header__collapsible__extra'>
                {children}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}
