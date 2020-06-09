import Layout from './layout'

export default class DefaultLayout extends PureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node.isRequired,
    layout: PropTypes.object,
    showBackBtn: PropTypes.bool,
    noComposeButton: PropTypes.bool,
    noRightSidebar: PropTypes.bool,
    tabs: PropTypes.array,
    title: PropTypes.string.isRequired,
  }

  render() {
    const {
      actions,
      children,
      layout,
      showBackBtn,
      tabs,
      title,
      noComposeButton,
      noRightSidebar,
    } = this.props

    return (
      <Layout
        actions={actions}
        layout={layout}
        showBackBtn={showBackBtn}
        tabs={tabs}
        title={title}
        noComposeButton={noComposeButton}
        noRightSidebar={noRightSidebar}
      >
        {children}
      </Layout>
    )
  }

}
