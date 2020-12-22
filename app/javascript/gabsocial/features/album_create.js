import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { createAlbum } from '../actions/albums'
import { closeModal } from '../actions/modal'
import Button from '../components/button'
import Input from '../components/input'
import Form from '../components/form'
import Text from '../components/text'
import Divider from '../components/divider'
import Textarea from '../components/textarea'

class AlbumCreate extends React.PureComponent {

  state = {
    titleValue: '',
    descriptionValue: '',
    checked: false,
  }

  onChangeTitle = (titleValue) => {
    this.setState({ titleValue })
  }

  onChangeDescription = (descriptionValue) => {
    this.setState({ descriptionValue })
  }

  handleOnSubmit = () => {
    const { titleValue, descriptionValue, checked } = this.state
    this.props.onSubmit(titleValue, descriptionValue, checked)
  }

  onTogglePrivacy = (checked) => {
    this.setState({ checked })
  }

  render() {
    const {
      titleValue,
      descriptionValue,
    } = this.state

    const isDisabled = !titleValue

    console.log("HELLO")

    return (
      <Form>
        <Input
          title='Title'
          placeholder='Album title'
          value={titleValue}
          onChange={this.onChangeTitle}
        />
        <Divider isInvisible />
        <Textarea
          title='Description'
          placeholder='Album description'
          value={descriptionValue}
          onChange={this.onChangeDescription}
        />
        <Divider isInvisible />
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
  onSubmit(title, description, isPrivate) {
    if (isModal) dispatch(closeModal())
    dispatch(createAlbum(title, description, isPrivate))
  },
})

AlbumCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

export default connect(null, mapDispatchToProps)(AlbumCreate)