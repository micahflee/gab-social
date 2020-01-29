import SearchContainer from '../compose/containers/search_container';
import SearchResultsContainer from '../compose/containers/search_results_container';

export default class Search extends PureComponent {

  render() {
    return (
      <div className='column search-page'>
        <SearchContainer />

        <div className='drawer__pager'>
          <div className='drawer__inner darker'>
            <SearchResultsContainer />
          </div>
        </div>
      </div>
    )
  }

}
