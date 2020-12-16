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

class BookmarkCollectionCreate extends React.PureComponent {

  state = {
    value: '',
  }

  onChange = (value) => {
    this.setState({ value })
  }

  handleOnSubmit = () => {
    this.props.onSubmit()
  }

  render() {
    const { disabled, isModal } = this.props
    const { value } = this.state

    const isDisabled = !value || disabled

    return (
      <Form>
        <Input
          title='Title'
          placeholder='Bookmark collection title'
          value={value}
          onChange={this.onChange}
        />

        <Button
          isDisabled={isDisabled}
          onClick={this.handleOnSubmit}
          className={[_s.mt10].join(' ')}
        >
          <Text color='inherit' align='center'>
            Create
          </Text>
        </Button>
      </Form>
    )
  }

}

const mapStateToProps = (state) => ({
  disabled: state.getIn(['listEditor', 'isSubmitting']),
})

const mapDispatchToProps = (dispatch, { isModal }) => ({
  onSubmit() {
    if (isModal) dispatch(closeModal(MODAL_LIST_CREATE))
    dispatch(submitListEditor(true))
  },
})

BookmarkCollectionCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkCollectionCreate)