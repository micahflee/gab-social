import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import Avatar from './avatar'
import Block from './block'
import Heading from './heading'

const messages = defineMessages({
  createPost: { id: 'column_header.create_post', defaultMessage: 'Create Post' },
})

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

export default
@connect(mapStateToProps)
@injectIntl
class TimelineComposeBlock extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    size: PropTypes.number,
    modal: PropTypes.bool,
  }

  static defaultProps = {
    size: 32,
  }

  render() {
    const {
      account,
      size,
      intl,
      modal,
      ...rest
    } = this.props

    if (modal) {
      return (
        <section className={_s.default}>
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <ComposeFormContainer {...rest} />
          </div>
        </section>
      )
    }

    return (
      <section className={[_s.default, _s.mb15].join(' ')}>
        <Block>
          <div className={[_s.default, _s.backgroundColorSubtle, _s.borderTop1PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15, _s.py2, _s.alignItemsCenter, _s.flexRow].join(' ')}>
            <div className={_s.mr10}>
              <Avatar account={account} size={20} noHover />
            </div>
            <Heading size='h5'>
              {intl.formatMessage(messages.createPost)}
            </Heading>
          </div>
          <ComposeFormContainer {...rest} />
        </Block>
      </section>
    )
  }

}