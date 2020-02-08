import { injectIntl, defineMessages } from 'react-intl';
import { fetchTrends } from '../../actions/trends';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TrendingItem from '../../components/trending_item';
import PanelLayout from './panel_layout';

const messages = defineMessages({
  title: { id:'trends.title', defaultMessage: 'Trends for you' },
});

const mapStateToProps = state => ({
  trends: state.getIn(['trends', 'items']),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchTrends: () => dispatch(fetchTrends()),
  }
};

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    trends: ImmutablePropTypes.list.isRequired,
    fetchTrends: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.fetchTrends();
  }

  render() {
    const { intl, trends } = this.props;

    // !!! TESTING !!!
    // if (trends.isEmpty()) {
    //   return null;
    // }

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <div className={styles.default}>
          { /* trends && trends.map(hashtag => (
            <TrendingItem key={hashtag.get('name')} hashtag={hashtag} />
          )) */ }
          <TrendingItem />
          <TrendingItem />
          <TrendingItem />
          <TrendingItem />
          <TrendingItem />
        </div>
      </PanelLayout>
    );
  }
};