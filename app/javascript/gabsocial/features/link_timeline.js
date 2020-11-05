import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import { expandLinkTimeline } from '../actions/timelines'
import { fetchLinkCard } from '../actions/links'
import { openModal } from '../actions/modal'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'
import Button from '../components/button'
import Text from '../components/text'
import PreviewCardItem from '../components/preview_card_item'
import ResponsiveClassesComponent from './ui/util/responsive_classes_component'

class LinkTimeline extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    this.handleConnect(this.props.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.handleConnect(nextProps.params.id)
    }
  }

  handleConnect(id) {
    const { dispatch } = this.props

    dispatch(fetchLinkCard(id))
    dispatch(expandLinkTimeline(id))
  }

  handleLoadMore = (maxId) => {
    const { id } = this.props.params
    this.props.dispatch(expandLinkTimeline(id, { maxId }))
  }

  render() {
    const {
      link,
      items,
      isFetched,
      isLoading,
    } = this.props
    const { id } = this.props.params

    if (typeof link === 'undefined' && isLoading) {
      return <ColumnIndicator type='loading' />
    } else if (!link) {
      return <ColumnIndicator type='missing' />
    }

    const emptyMessage = (
      <div className={[_s.d, _s.pt10, _s.px15, _s.aiCenter].join(' ')}>
        <Text>No statuses with this url yet.</Text>
      </div>
    )

    return (
      <React.Fragment>
        <ResponsiveClassesComponent
          classNamesSmall={[_s.d, _s.w100PC, _s.pt10].join(' ')}
          classNamesXS={[_s.d, _s.w100PC, _s.pt10].join(' ')}
        >
          <PreviewCardItem id={id} isUnlinked />
        </ResponsiveClassesComponent>
        <StatusList
          scrollKey='link_timeline'
          timelineId={`link:${id}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
        />
      </React.Fragment>
    )
  }

}

const mapStateToProps = (state, props) => ({
  items: state.getIn(['links', 'items']),
  link: state.getIn(['links', 'items', `${props.params.id}`]),
  isFetched: state.getIn(['links', 'isFetched']),
	isLoading: state.getIn(['links', 'isLoading']),
})

LinkTimeline.propTypes = {
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  link: PropTypes.oneOfType([
    ImmutablePropTypes.map,
    PropTypes.bool,
  ]),
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(LinkTimeline)