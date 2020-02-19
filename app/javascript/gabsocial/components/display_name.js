import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from './icon';

export default class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    multiline: PropTypes.bool,
  };

  render () {
    const { account } = this.props;

    return (
      <span className={[_s.default, _s.flexRow, _s.maxWidth100PC, _s.alignItemsCenter].join(' ')}>
        <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
          <strong
            className={[_s.text, _s.overflowWrapBreakWord, _s.whiteSpaceNoWrap, _s.fontSize15PX, _s.fontWeightBold, _s.colorPrimary, _s.lineHeight125, _s.marginRight2PX].join(' ')}
            dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
          />
        </bdi>
        {
          account.get('is_verified') &&
          <Icon id='verified' width='16px' height='16px' className={_s.default} title='Verified Account' />
          /*<Icon id='verified' width='15px' height='15px' className={[_s.default]} title='PRO' />
          <Icon id='verified' width='15px' height='15px' className={[_s.default]} title='Donor' />
          <Icon id='verified' width='15px' height='15px' className={[_s.default]} title='Investor' />*/
        }
        <span className={[_s.text, _s.displayFlex, _s.flexNormal, _s.flexShrink1, _s.fontSize15PX, _s.overflowWrapBreakWord, _s.textOverflowEllipsis, _s.marginLeft5PX, _s.colorSecondary, _s.fontWeightNormal, _s.lineHeight125].join(' ')}>
          @{account.get('acct')}
        </span>
      </span>
    );
  }

}
