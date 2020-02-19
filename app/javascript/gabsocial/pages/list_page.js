import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import LinkFooter from '../components/link_footer'
import DefaultLayout from '../components/layouts/default_layout'
import ListDetailsPanel from '../components/panel/list_details_panel'

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
});

export default @connect(mapStateToProps)
class ListPage extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map,
  };

  handleEditListTimeline () {
    console.log("handleEditListTimeline")
  }

  render() {
    const { children, list } = this.props

    const title = list ? list.get('title') : ''

    return (
      <DefaultLayout
        title={title}
        actions={[
          {
            icon: 'ellipsis',
            onClick: this.handleEditListTimeline
          },
        ]}
        layout={(
          <Fragment>
            <ListDetailsPanel />
            <LinkFooter />
          </Fragment>
        )}
        showBackBtn
      >
        { children }
      </DefaultLayout>
    )
  }
}