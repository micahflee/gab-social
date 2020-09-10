import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { connect } from 'react-redux'
import { fetchGroupCategories } from '../actions/group_categories'
import slugify from '../utils/slugify'
import Block from '../components/block'
import BlockHeading from '../components/block_heading'
import List from '../components/list'

class GroupCategories extends ImmutablePureComponent {

  componentDidMount() {
    this.props.dispatch(fetchGroupCategories())
  }

  render() {
    const { categories } = this.props

    let categoriesOptions = []
		if (categories) {
			for (let i = 0; i < categories.count(); i++) {
        const c = categories.get(i)
        const title = c.get('text')
				categoriesOptions.push({
					title,
					to: `/groups/browse/categories/${slugify(title)}`,
				})
			}
    }

    return (
      <Block>
        <BlockHeading title='Browse group categories' />
        <List items={categoriesOptions} />
      </Block>
    )
  }

}

const mapStateToProps = (state) => ({
  categories: state.getIn(['group_categories', 'items']),
})

GroupCategories.propTypes = {
  categories: ImmutablePropTypes.list.isRequired,
}

export default connect(mapStateToProps)(GroupCategories)