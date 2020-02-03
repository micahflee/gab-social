import Header from '../header'

console.log("in the page_layout - styles:", styles);

export default class PageLayout extends PureComponent {
  static propTypes = {
    layout: PropTypes.object,
  };

  render() {
    const { children, layout } = this.props;

    const right = layout.RIGHT || null;

    return (
      <div className='page'>
        {/*<Header />*/}
        <main className='main' role='main'>
          <div className='main__container'>
            <div className='main-contents'>
              <div className='main-contents__inner'>
                { /* children */ }
              </div>
            </div>
            <div className='main-sidebar'>
              <div className='main-sidebar__inner'>
                { /* right */ }
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

}
