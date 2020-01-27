import { Sparklines, SparklinesCurve } from 'react-sparklines';
import { FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Permalink from '../permalink/permalink';
import { shortNumberFormat } from '../../utils/numbers';

import './trending_item.scss';

export default class TrendingItem extends ImmutablePureComponent {

  static propTypes = {
    hashtag: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { hashtag } = this.props;
    
    return (
      <div className='trending-item'>
        <div className='trending-item__text'>
          <Permalink href={hashtag.get('url')} to={`/tags/${hashtag.get('name')}`}>
            #<span>{hashtag.get('name')}</span>
          </Permalink>

          <FormattedMessage
            id='trends.count_by_accounts'
            defaultMessage='{count} {rawCount, plural, one {person} other {people}} talking'
            values={{
              rawCount: hashtag.getIn(['history', 0, 'accounts']),
              count: <strong>{shortNumberFormat(hashtag.getIn(['history', 0, 'accounts']))}</strong>,
            }}
          />
        </div>

        <div className='trending-item__uses'>
          {shortNumberFormat(hashtag.getIn(['history', 0, 'uses']))}
        </div>

        <div className='trending-item__sparkline'>
          <Sparklines width={50} height={28} data={hashtag.get('history').reverse().map(day => day.get('uses')).toArray()}>
            <SparklinesCurve style={{ fill: 'none' }} />
          </Sparklines>
        </div>
      </div>
    );
  }

}
