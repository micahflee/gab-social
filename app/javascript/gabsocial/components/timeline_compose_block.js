import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { me } from '../initial_state'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import Block from './block'
import Heading from './heading'

const cx = classNames.bind(_s)

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
          <div className={[_s.default, _s.backgroundSubtle, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15, _s.py2].join(' ')}>
            <Heading size='h5'>
              {intl.formatMessage(messages.createPost)}
            </Heading>
          </div>
          <div className={[_s.default, _s.flexRow, _s.px15, _s.py15].join(' ')}>
            <ComposeFormContainer {...rest} />
          </div>
        </Block>
      </section>
    )
  }

}