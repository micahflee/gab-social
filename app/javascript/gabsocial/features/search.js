// import SearchContainer from '../compose/containers/search_container';
import SearchResults from './compose/components/search_results';

export default class Search extends PureComponent {

  render() {
    return (
      <div className='column search-page'>
        { /* <SearchContainer /> */ }

        <div className='drawer__pager'>
          <div className='drawer__inner darker'>
            <SearchResults />
          </div>
        </div>
      </div>
    )
  }

}
