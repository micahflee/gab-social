import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import Block from './block'
import Avatar from './avatar'
import Heading from './heading'

const messages = defineMessages({
  createPost: { id: 'column_header.create_post', defaultMessage: 'Create Post' },
})

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class TimelineComposeBlock extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 32,
  }

  render() {
    const { account, size, intl, ...rest } = this.props

    return (
      <section className={[_s.default, _s.marginBottom15PX].join(' ')}>
        <Block>
          <div className={[_s.default, _s.backgroundSubtle, _s.borderBottom1PX, _s.borderColorSecondary, _s.paddingHorizontal15PX, _s.paddingVertical2PX].join(' ')}>
            <Heading size='h5'>
              {intl.formatMessage(messages.createPost)}
            </Heading>
          </div>
          <div className={[_s.default, _s.flexRow, _s.paddingVertical15PX, _s.paddingHorizontal15PX].join(' ')}>
            <div className={[_s.default, _s.marginRight10PX].join(' ')}>
              <Avatar account={account} size={46} />
            </div>
            <ComposeFormContainer {...rest} />
          </div>
        </Block>
      </section>
    )
  }

}