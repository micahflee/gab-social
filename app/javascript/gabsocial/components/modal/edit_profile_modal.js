import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import ModalLayout from './modal_layout'
import Avatar from '../avatar'
import Button from '../button'
import Divider from '../divider'
import Image from '../image'
import Input from '../input'
import Text from '../text'
import Textarea from '../textarea'

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
})

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

export default
@injectIntl
@connect(mapStateToProps)
class EditProfileModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { account, intl } = this.props
    
    const headerSrc = !!account ? account.get('header') : ''

    return (
      <ModalLayout
        title={intl.formatMessage(messages.edit_profile)}
        noPadding
        width={460}
      >
        <div className={[_s.default, _s.py5, _s.px5, _s.width100PC, _s.overflowHidden].join(' ')}>
          <Image
            alt={intl.formatMessage(messages.headerPhoto)}
            className={_s.radiusSmall}
            height='180px'
            src={headerSrc}
          />
        </div>

        <div className={[_s.default, _s.flexRow, _s.pl25].join(' ')}>
          <div className={[_s.default, _s.circle, _s.mtNeg75PX, _s.boxShadowProfileAvatar].join(' ')}>
            <Avatar
              size={98}
              account={account}
              noHover
            />
          </div>
        </div>

        <div className={[_s.default, _s.px15, _s.py15].join(' ')}>
          <Input
            title='Name'
            value=''
            disabled={false}
            // onChange={this.handleTitleChange}
            placeholder='Add your name...'
          />

          <Divider isInvisible />

          <Textarea
            title='Bio'
            value=''
            disabled={false}
            // onChange={this.handleDescriptionChange}
            placeholder='Add your bio...'
          />

        </div>

      </ModalLayout>
    )
  }
}
