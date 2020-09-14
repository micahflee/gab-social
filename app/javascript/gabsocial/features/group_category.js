import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import slugify from '../utils/slugify'
import unslugify from '../utils/unslugify'
import { fetchGroupsByCategory } from '../actions/groups'
import Block from '../components/block'
import ColumnIndicator from '../components/column_indicator'
import Heading from '../components/heading'
import GroupListItem from '../components/group_list_item'

class GroupCategory extends ImmutablePureComponent {

  state = {
    category: this.props.params.sluggedCategory,
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.sluggedCategory !== prevProps.params.sluggedCategory) {
      this.handleLoad(this.props.params.sluggedCategory)
    }
  }

  componentDidMount() {
    this.handleLoad(this.props.params.sluggedCategory)
  }

  handleLoad = (sluggedCategory) => {
    const category = unslugify(sluggedCategory)
    this.setState({ category })
    this.props.onFetchGroupsByCategory(category)
  }

  render() {
    const {
      isFetched,
      isLoading,
      groupIds,
    } = this.props
    const { category } = this.state

    let errorMessage
    if (!groupIds || (isFetched && groupIds.size === 0)) {
			errorMessage = <ColumnIndicator type='error' message={<FormattedMessage id='groups.empty' defaultMessage='There are no groups to display' />} />
		} else if (isLoading && groupIds.size === 0) {
      errorMessage = <ColumnIndicator type='loading' />
		} 
  
		return (
			<Block>
				<div className={[_s.d, _s.flexRow, _s.px15, _s.pt10].join(' ')}>
					<div className={[_s.d, _s.aiStart, _s.overflowHidden].join(' ')}>
						<Heading size='h2'>
							Groups by category: {category}
						</Heading>
					</div>
				</div>
				<div className={[_s.d, _s.py10, _s.w100PC].join(' ')}>
					{
            !errorMessage &&
						groupIds.map((groupId, i) => (
							<GroupListItem
								isAddable
								key={`group-collection-item-${i}`}
								id={groupId}
								isLast={groupIds.count() - 1 === i}
							/>
						))
          }
          { !!errorMessage && errorMessage}
				</div>
			</Block>
		)
  }

}

const mapStateToProps = (state, { params: { sluggedCategory } }) => {
  const cleanSluggedCategory = slugify(sluggedCategory)

  return {
    groupIds: state.getIn(['group_lists', 'by_category', cleanSluggedCategory, 'items']),
	  isFetched: state.getIn(['group_lists', 'by_category', cleanSluggedCategory, 'isFetched']),
	  isLoading: state.getIn(['group_lists', 'by_category', cleanSluggedCategory, 'isLoading']),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchGroupsByCategory: (category) => dispatch(fetchGroupsByCategory(category)),
})

GroupCategory.propTypes = {
  groupIds: ImmutablePropTypes.list,
	isFetched: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFetchGroupsByCategory: PropTypes.func.isRequired,
  sluggedCategory: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCategory)