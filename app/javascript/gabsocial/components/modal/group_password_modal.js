import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  joinGroup,
  checkGroupPassword,
  checkGroupPasswordReset,
} from '../../actions/groups'
import ModalLayout from './modal_layout'
import Button from '../button'
import Input from '../input'
import Text from '../text'

class GroupPasswordModal extends ImmutablePureComponent {

  state = {
    text: '',
    isError: false,
  }

  componentDidMount() {
    const { url } = this.props
    this.props.onCheckGroupPasswordReset()
  }

  componentDidUpdate(prevProps) {
    if (this.props.group !== prevProps.group) {
      this.props.onCheckGroupPasswordReset()
    }
    if (this.props.passwordCheckIsError && prevProps.passwordCheckIsLoading) {
      this.setState({ isError: true })
    }
    if (this.props.passwordCheckIsSuccess) {
      this.props.onClose()
    }
  }

  componentWillUnmount() {
    this.props.onCheckGroupPasswordReset()
  }

  handlePasswordChange = (value) => {
    this.setState({
      text: value,
      isError: false,
    })
  }

  handleOnClick = () => {
    this.props.onCheckGroupPassword(this.props.group.get('id'), this.state.text)
  }

  render() {
    const {
      intl,
      group,
      onClose,
      passwordCheckIsLoading,
      passwordCheckIsError,
      passwordCheckIsSuccess,
    } = this.props
    const { text, isError } = this.state

    if (!group) {
      //loading
      return <div/>
    }

    const hasPassword = group.get('has_password')
    const isPrivate = group.get('is_private')

    const instructions = isPrivate ? 'Enter the group password and then your join request will be sent to the group admin.' : 'Enter the group password to join the group.'

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        onClose={onClose}
        width={360}
      >
        <div className={_s.d}>
          <div className={[_s.d, _s.my10].join(' ')}>
            {
              isError &&
              <Text color='error' className={[_s.pb15, _s.px15].join(' ')}>There was an error submitting the form.</Text>
            }
            <Input
              isDisabled={passwordCheckIsLoading}
              type='text'
              value={text}
              placeholder='•••••••••••'
              id='group-password'
              title='Enter group password'
              onChange={this.handlePasswordChange}
            />

            <Text className={[_s.my10, _s.ml15].join(' ')} size='small' color='secondary'>
              {instructions}
            </Text>
          </div>

          <Button
            isDisabled={passwordCheckIsLoading}
            onClick={this.handleOnClick}
            icon={passwordCheckIsLoading ? 'loading' : null}
            iconSize='20px'
            className={[_s.aiCenter, _s.jcCenter].join(' ')}
          > 
            <Text color='inherit' className={_s.px10}>{intl.formatMessage(messages.submit)}</Text>
          </Button>

        </div>
      </ModalLayout>
    )
  }

}

const messages = defineMessages({
  title: { id: 'group.password_required', defaultMessage: 'Group password required' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
})

const mapStateToProps = (state) => ({
  passwordCheckIsLoading: state.getIn(['group_lists', 'passwordCheck', 'isLoading'], false),
  passwordCheckIsError: state.getIn(['group_lists', 'passwordCheck', 'isError'], false),
  passwordCheckIsSuccess: state.getIn(['group_lists', 'passwordCheck', 'isSuccess'], false),
})

const mapDispatchToProps = (dispatch) => ({
  onCheckGroupPassword(groupId, password) {
    dispatch(checkGroupPassword(groupId, password))
  },
  onCheckGroupPasswordReset() {
    dispatch(checkGroupPasswordReset())
  },
  onJoinGroup(groupId) {
    dispatch(joinGroup(groupId))
  },
})

GroupPasswordModal.propTypes = {
  group: ImmutablePropTypes.map,
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCheckGroupPassword: PropTypes.func.isRequired,
  onCheckGroupPasswordReset: PropTypes.func.isRequired,
  onJoinGrouponJoinGroup: PropTypes.func.isRequired,
  passwordCheckIsLoading: PropTypes.bool.isRequired,
  passwordCheckIsError: PropTypes.bool.isRequired,
  passwordCheckIsSuccess: PropTypes.bool.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GroupPasswordModal))