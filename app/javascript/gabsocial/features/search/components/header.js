import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
});

export default
@withRouter
@connect(mapStateToProps)
class Header extends React.PureComponent {

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

    return (
      <div className='search-header'>
        <div className='search-header__text-container'>
          <h1 className='search-header__title-text'>
            {submittedValue}
          </h1>
        </div>
        <div className='search-header__type-filters'>
          <div className='account__section-headline'>
            <div className='search-header__type-filters-tabs'>
              <NavLink to='/search' exact activeClassName='active'>
                <FormattedMessage id='search_results.top' defaultMessage='Top' />
              </NavLink>
              <NavLink to='/search/people' exact activeClassName='active'>
                <FormattedMessage id='search_results.accounts' defaultMessage='People' />
              </NavLink>
              <NavLink to='/search/hashtags' exact activeClassName='active'>
                <FormattedMessage id='search_results.hashtags' defaultMessage='Hashtags' />
              </NavLink>
              <NavLink to='/search/groups' exact activeClassName='active'>
                <FormattedMessage id='search_results.groups' defaultMessage='Groups' />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}