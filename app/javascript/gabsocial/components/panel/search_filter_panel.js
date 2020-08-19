import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { setFilter } from '../../actions/search'
import PanelLayout from './panel_layout'
import SettingSwitch from '../setting_switch'

class SearchFilterPanel extends ImmutablePureComponent {

  componentWillUnmount () {
    //reset
    this.props.onChange('onlyVerified', false, false)
  }

  render() {
    const {
      intl,
      onChange,
      settings,
    } = this.props

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <SettingSwitch
          prefix='search'
          settings={settings}
          settingPath={'onlyVerified'}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyVerified)}
        />
      </PanelLayout>
    )
  }
}

const messages = defineMessages({
  title: { id: 'search_filters', defaultMessage: 'Search Filters' },
  onlyVerified: { id: 'notification_only_verified', defaultMessage: 'Only Verified Users' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['search', 'filter']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(path, value) {
    dispatch(setFilter(path, value, true))
  },
})

SearchFilterPanel.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  settings: ImmutablePropTypes.map.isRequired,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SearchFilterPanel))