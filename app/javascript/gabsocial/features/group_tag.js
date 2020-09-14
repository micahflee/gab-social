import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import slugify from '../utils/slugify'
import unslugify from '../utils/unslugify'
import { fetchGroupsByTag } from '../actions/groups'
import Block from '../components/block'
import ColumnIndicator from '../components/column_indicator'
import Heading from '../components/heading'
import GroupListItem from '../components/group_list_item'

class GroupTag extends ImmutablePureComponent {

  state = {
    tag: this.props.params.sluggedTag,
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.sluggedTag !== prevProps.params.sluggedTag) {
      this.handleLoad(this.props.params.sluggedTag)
    }
  }

  componentDidMount() {
    this.handleLoad(this.props.params.sluggedTag)
  }

  handleLoad = (sluggedTag) => {
    const tag = unslugify(sluggedTag)
    this.setState({ tag })
    this.props.onFetchGroupsByTag(tag)
  }

  render() {
    const {
      isFetched,
      isLoading,
      groupIds,
    } = this.props
    const { tag } = this.state

    let errorMessage
    if (!groupIds || (isFetched && groupIds.size === 0)) {
			errorMessage = <ColumnIndicator type='error' message={<FormattedMessage id='groups.empty' defaultMessage='There are no groups to display' />} />
		} else if (isLoading && groupIds.size === 0) {
      errorMessage = <ColumnIndicator type='loading' />
		}
  
		return (
			<Block>
				<div className={[_s.d, _s.flexRow, _s.px15, _s.pt10].join(' ')}>
					<div className={[_s.d, _s.overflowHidden].join(' ')}>
						<Heading size='h2'>
							Groups by tag: {tag}
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

const mapStateToProps = (state, { params: { sluggedTag } }) => {
  const cleanSluggedTag = slugify(sluggedTag)

  return {
    groupIds: state.getIn(['group_lists', 'by_tag', cleanSluggedTag, 'items']),
	  isFetched: state.getIn(['group_lists', 'by_tag', cleanSluggedTag, 'isFetched']),
	  isLoading: state.getIn(['group_lists', 'by_tag', cleanSluggedTag, 'isLoading']),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchGroupsByTag: (tag) => dispatch(fetchGroupsByTag(tag)),
})

GroupTag.propTypes = {
  groupIds: ImmutablePropTypes.list,
	isFetched: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFetchGroupsByTag: PropTypes.func.isRequired,
  sluggedTag: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupTag)