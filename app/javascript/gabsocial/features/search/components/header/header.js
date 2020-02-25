import { FormattedMessage } from 'react-intl';

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
});

export default
@connect(mapStateToProps)
class Header extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    submitted: PropTypes.bool,
  };

  state = {
    submittedValue: '',
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.submitted) {
      const submittedValue = nextProps.value;
      this.setState({submittedValue})
    }
  }

  render () {
    const { submittedValue } = this.state;

    if (!submittedValue) {
      return null;
    }

    return (
      <div className='search-header'>
        <div className='search-header__text-container'>
          <h1 className='search-header__title-text'>
            {submittedValue}
          </h1>
        </div>
        <div className='search-header__type-filters'>
          <div className='search-header__type-filters-tabs'>
            { /* <SectionHeadlineBar
              items={[
                {
                  to: '/search',
                  title: <FormattedMessage id='search_results.top' defaultMessage='Top' />
                }
              ]}
            /> */ }
          </div>
        </div>
      </div>
    );
  }
}