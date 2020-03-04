import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'
import Text from './text'

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
})

export default
@injectIntl
class Comment extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  }

  render() {

    //

    return (
      <div>

      </div>
    )
  }

}
