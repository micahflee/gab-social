import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchGroupsByTab } from '../../actions/groups'
import GroupCollectionItem from '../group_collection_item'
import TimelineInjectionLayout from './timeline_injection_layout'

class FeaturedGroupsInjection extends ImmutablePureComponent {

  componentDidMount() {
    if (!this.props.isFetched) {
      this.props.onFetchGroupsByTap('featured')
    }
  }
  
  render() {
    const {
      groupIds,
      isLoading,
      isFetched,
      isXS,
      injectionId,
		} = this.props

    if (isFetched && groupIds.size === 0) {
			return <div />
    }
    
    return (
      <TimelineInjectionLayout
        id={injectionId}
        title='Featured groups'
        buttonLink='/groups/browse/featured'
        buttonTitle='See more featured groups'
        isXS={isXS}
        >
          {
            groupIds.map((groupId) => (
              <div className={[_s.d, _s.w300PX].join(' ')}>
                <GroupCollectionItem
                  isAddable
                  id={groupId}
                />
              </div>
            ))
          }
        </TimelineInjectionLayout>
    )
  }

}

const mapStateToProps = (state) => ({
	groupIds: state.getIn(['group_lists', 'featured', 'items']),
	isFetched: state.getIn(['group_lists', 'featured', 'isFetched']),
	isLoading: state.getIn(['group_lists', 'featured', 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
	onFetchGroupsByTap: (tab) => dispatch(fetchGroupsByTab(tab)),
})

FeaturedGroupsInjection.propTypes = {
	groupIds: ImmutablePropTypes.list,
	isFetched: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFetchGroupsByTab: PropTypes.func.isRequired,
  injectionId: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedGroupsInjection)