import './columns_area.scss';

export default class ColumnsArea extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    layout: PropTypes.object,
  };

  render () {
    const { children } = this.props;
    const layout = this.props.layout || {LEFT:null,RIGHT:null};

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                {layout.LEFT}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                {layout.RIGHT}
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
