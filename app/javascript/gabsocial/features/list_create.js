import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { changeListEditorTitle, submitListEditor } from '../actions/lists'
import { closeModal } from '../actions/modal'
import { MODAL_LIST_CREATE } from '../constants'
import Button from '../components/button'
import Input from '../components/input'
import Form from '../components/form'
import Text from '../components/text'

class ListCreate extends React.PureComponent {

  render() {
    const {
      value,
      intl,
      onSubmit,
      onChange,
    } = this.props

    const isDisabled = !value

    return (
      <Form>
        <Input
          title={intl.formatMessage(messages.label)}
          placeholder={intl.formatMessage(messages.new_list_placeholder)}
          value={value}
          onChange={onChange}
        />

        <div className={[_s.d, _s.my10, _s.py5, _s.ml10].join(' ')}>
          <Text color='secondary' size='small'>
            {intl.formatMessage(messages.list_description)}
          </Text>
        </div>

        <Button
          isDisabled={isDisabled}
          onClick={onSubmit}
        >
          <Text color='inherit' align='center'>
            {intl.formatMessage(messages.create)}
          </Text>
        </Button>
      </Form>
    )
  }

}

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  create: { id: 'lists.new.create_title', defaultMessage: 'Create list' },
  list_description: { id: 'list.description', defaultMessage: 'Lists are private and only you can see who is on a list.\nNo one else can view your lists. No one knows that they are on your list.' },
  new_list_placeholder: { id: 'list.title_placeholder', defaultMessage: 'My new list...', },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: state.getIn(['listEditor', 'isSubmitting']),
})

const mapDispatchToProps = (dispatch, { isModal }) => ({
  onChange: (value) => dispatch(changeListEditorTitle(value)),
  onSubmit: () => {
    if (isModal) dispatch(closeModal(MODAL_LIST_CREATE))
    dispatch(submitListEditor(true))
  },
})

ListCreate.propTypes = {
  value: PropTypes.string,
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListCreate))