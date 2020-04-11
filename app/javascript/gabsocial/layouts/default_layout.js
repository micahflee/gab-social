import Layout from './layout'

export default class DefaultLayout extends PureComponent {
  static propTypes = {
    actions: PropTypes.array,
    tabs: PropTypes.array,
    layout: PropTypes.object,
    showBackBtn: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const {
      children,
      title,
      showBackBtn,
      layout,
      actions,
      tabs,
     } = this.props

    return (
      <Layout
        title={title}
        showBackBtn={showBackBtn}
        actions={actions}
        tabs={tabs}
        layout={layout}
      >
        {children}
      </Layout>
    )
  }

}
