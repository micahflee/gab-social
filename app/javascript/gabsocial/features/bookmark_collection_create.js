import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { createBookmarkCollection } from '../actions/bookmarks'
import { closeModal } from '../actions/modal'
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
    this.props.onSubmit(this.state.value)
  }

  render() {
    const { value } = this.state

    const isDisabled = !value

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

const mapDispatchToProps = (dispatch, { isModal }) => ({
  onSubmit(title) {
    if (isModal) dispatch(closeModal())
    dispatch(createBookmarkCollection(title))
  },
})

BookmarkCollectionCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default connect(null, mapDispatchToProps)(BookmarkCollectionCreate)