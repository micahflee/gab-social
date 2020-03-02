import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Button from '../button'
import Divider from '../divider'
import Heading from '../heading'
import Icon from '../icon'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'search_filters', defaultMessage: 'Search Filters' },
})

export default
@injectIntl
class SearchFilterPanel extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { intl, group } = this.props

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
      
      </PanelLayout>
    )
  }
}