import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import isObject from 'lodash.isobject'
import { setupListEditor, resetListEditor } from '../../actions/lists'
import Account from './components/account'
import ListEditorSearch from './components/list_editor_search'
import EditListForm from './components/edit_list_form/edit_list_form'
import Button from '../../components/button'
import Input from '../../components/input'

const mapStateToProps = (state, { params }) => {

  console.log("params:", params)

  const listId = isObject(params) ? params['id'] : null

	return {
    listId,
    title: state.getIn(['listEditor', 'title']),
    accountIds: state.getIn(['listEditor', 'accounts', 'items']),
    searchAccountIds: state.getIn(['listEditor', 'suggestions', 'items']),
  }
}

const mapDispatchToProps = dispatch => ({
  onInitialize: listId => dispatch(setupListEditor(listId)),
  onReset: () => dispatch(resetListEditor()),
})

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  changeTitle: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  addToList: { id: 'lists.account.add', defaultMessage: 'Add to list' },
  removeFromList: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  editList: { id: 'lists.edit', defaultMessage: 'Edit list' },
  editListTitle: { id: 'lists.new.edit_title_placeholder', defaultMessage: 'Edit list title' },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListEdit extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.string,
    listId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onInitialize: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list.isRequired,
    searchAccountIds: ImmutablePropTypes.list.isRequired,
  }

  componentDidMount() {
    const { onInitialize, listId } = this.props
    console.log("listId:", listId)
    if (listId) {
      onInitialize(listId)
    }
  }

  componentWillUnmount() {
    this.props.onReset()
  }

  onClickClose = () => {
    this.props.onClose('LIST_ADDER')
  }

  render() {
    const {
      title,
      accountIds,
      searchAccountIds,
      intl
    } = this.props

    console.log("title:", title)

    return (
      <div>
        <Input
          title={intl.formatMessage(messages.editListTitle)}
          placeholder='My new list title...'
          value={title}
        // onChange={onChange}
        // onSubmit={onSubmit}
        // disabled={disabled}
        />

        {
          /*
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            {intl.formatMessage(messages.editList)}
          </h3>
          <Button className='compose-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
        </div>
        <div className='compose-modal__content'>
          <div className='list-editor'>
            <EditListForm />
            <br />

            {
              accountIds.size > 0 &&
              <div>
                <div className='list-editor__accounts'>
                  {accountIds.map(accountId => <Account key={accountId} accountId={accountId} added />)}
                </div>
              </div>
            }

            <br />
            <ListEditorSearch />
            <div className='list-editor__accounts'>
              {searchAccountIds.map(accountId => <Account key={accountId} accountId={accountId} />)}
            </div>
          </div>
        </div>
          */ }

      </div>
    )

  }

}
