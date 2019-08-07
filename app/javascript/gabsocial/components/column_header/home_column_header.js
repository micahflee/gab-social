import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import { injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import Icon from '../icon';
import { fetchLists } from '../../actions/lists';

import './column_header.scss';

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
  homeTitle: { id: 'home_column_header.home', defaultMessage: 'Home' },
  allTitle: { id: 'home_column_header.all', defaultMessage: 'All' },
  listTitle: { id: 'home_column.lists', defaultMessage: 'Lists' },
});

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = state => {
  return {
    lists: getOrderedLists(state),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class HomeColumnHeader extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node,
    activeItem: PropTypes.string,
    activeSubItem: PropTypes.string,
    lists: ImmutablePropTypes.list,
  };

  state = {
    collapsed: true,
    listsExpanded: false,
  };

  componentDidMount() {
    this.props.dispatch(fetchLists());
  }

  handleToggleClick = (e) => {
    e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed });
  }

  expandLists = () => {
    this.setState({ listsExpanded: !this.state.listsExpanded });
  }

  render () {
    const { active, children, intl: { formatMessage }, activeItem, activeSubItem, lists } = this.props;
    const { collapsed, listsExpanded } = this.state;

    const wrapperClassName = classNames('column-header__wrapper', {
      'column-header__wrapper--active': active,
    });

    const buttonClassName = classNames('column-header', {
      'column-header--active': active,
    });

    const collapsibleClassName = classNames('column-header__collapsible', {
      'column-header__collapsible--collapsed': collapsed,
    });

    const collapsibleButtonClassName = classNames('column-header__button', {
      'column-header__button--active': !collapsed,
    });

    const expansionClassName = classNames('column-header column-header__expansion', {
      'column-header__expansion--open': listsExpanded,
    });

    const btnTitle = formatMessage(collapsed ? messages.show : messages.hide);

    let expandedContent = null;
    if ((listsExpanded || activeItem === 'lists') && lists) {
      expandedContent = lists.map((list) => {
        const listId = list.get('id');
        const linkUrl = `/list/${listId}`;
        const classes = classNames('column-header-btn column-header-btn--sub column-header-btn--grouped', {
          'column-header-btn--active': listId === activeSubItem,
        });

        return (
          <Link key={listId} to={linkUrl} className={classes}>
            {list.get('title')}
          </Link>
        );
      });
    }

    return (
      <div className={wrapperClassName}>
        <h1 className={buttonClassName}>
          <Link to='/home' className={classNames('column-header-btn column-header-btn--grouped', { 'column-header-btn--active': 'home' === activeItem })}>
            <Icon id='home' fixedWidth className='column-header__icon' />
            {formatMessage(messages.homeTitle)}
          </Link>

          <Link to='/timeline/all' className={classNames('column-header-btn column-header-btn--grouped', { 'column-header-btn--active': 'all' === activeItem })}>
            <Icon id='globe' fixedWidth className='column-header__icon' />
            {formatMessage(messages.allTitle)}
          </Link>

          { lists.size > 0 &&
            <a onClick={this.expandLists} className={classNames('column-header-btn column-header-btn--grouped', { 'column-header-btn--active': 'lists' === activeItem })}>
              <Icon id='list' fixedWidth className='column-header__icon' />
              {formatMessage(messages.listTitle)}
            </a>
          }
          { lists.size == 0 &&
            <Link to='/lists' className='column-header-btn column-header-btn--grouped'>
              <Icon id='list' fixedWidth className='column-header__icon' />
              {formatMessage(messages.listTitle)}
            </Link>
          }

          <div className='column-header__buttons'>
            <button
              className={collapsibleButtonClassName}
              title={btnTitle}
              aria-label={btnTitle}
              aria-pressed={collapsed ? 'false' : 'true'}
              onClick={this.handleToggleClick}
            >
              <Icon id='sliders' />
            </button>
          </div>
        </h1>

        <h1 className={expansionClassName}>
          {expandedContent}
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