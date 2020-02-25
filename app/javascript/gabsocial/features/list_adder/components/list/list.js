import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { removeFromListAdder, addToListAdder } from '../../../../actions/lists';
import IconButton from '../../../../components/icon_button';
import Icon from '../../../../components/icon';

const messages = defineMessages({
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
});

const MapStateToProps = (state, { listId, added }) => ({
  list: state.get('lists').get(listId),
  added: typeof added === 'undefined' ? state.getIn(['listAdder', 'lists', 'items']).includes(listId) : added,
});

const mapDispatchToProps = (dispatch, { listId }) => ({
  onRemove: () => dispatch(removeFromListAdder(listId)),
  onAdd: () => dispatch(addToListAdder(listId)),
});

export default
@connect(MapStateToProps, mapDispatchToProps)
@injectIntl
class List extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  render () {
    const { list, intl, onRemove, onAdd, added } = this.props;

    return (
      <div className='list'>
        <div className='list__wrapper'>
          <div className='list__name'>
            <Icon id='list-ul' className='list__name-icon' fixedWidth />
            {list.get('title')}
          </div>

          <div className='list__btn-block'>
            {
              added ?
                <IconButton icon='times' title={intl.formatMessage(messages.remove)} onClick={onRemove} />
                :
                <IconButton icon='plus' title={intl.formatMessage(messages.add)} onClick={onAdd} />
            }
          </div>
        </div>
      </div>
    );
  }

}
