import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment-mini'
import PanelLayout from './panel_layout'
import ColumnIndicator from '../column_indicator'
import Divider from '../divider'
import Icon from '../icon'
import Text from '../text'

class ListDetailsPanel extends ImmutablePureComponent {

  render() {
    const {
      intl,
      list,
      onEdit,
    } = this.props

    const title = !!list ? list.get('title') : ''
    const createdAt = !!list ? list.get('created_at') : ''

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.edit)}
        headerButtonAction={onEdit}
      >
        {
          (!title || !createdAt) &&
          <ColumnIndicator type='loading' />
        }
        {
          title && createdAt &&
          <div className={_s.d}>

            <div className={_s.d}>
              <Text weight='medium'>
                {title}
              </Text>
            </div>

            <Divider isSmall />

            <div className={[_s.d, _s.flexRow, _s.aiCenter].join(' ')}>
              <Icon id='calendar' size='12px' className={_s.cSecondary} />
              <Text
                size='small'
                color='secondary'
                className={_s.ml5}
              >
                {
                  <FormattedMessage id='lists.panel_created' defaultMessage='Created: {date}' values={{
                    date: moment(createdAt).format('lll'),
                  }} />
                }
              </Text>
            </div>

          </div>
        }
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'lists_information', defaultMessage: 'List Information' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
})

ListDetailsPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  list: ImmutablePropTypes.map,
  onEdit: PropTypes.func.isRequired,
}

export default injectIntl(ListDetailsPanel)