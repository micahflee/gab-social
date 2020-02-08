import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from './icon';

export default class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { account } = this.props;

    return (
      <span className={[styles.default, styles.flexRow, styles.maxWidth100PC, styles.alignItemsCenter].join(' ')}>
        <bdi className={[styles.text, styles.whiteSpaceNoWrap, styles.textOverflowEllipsis].join(' ')}>
          <strong
            className={[styles.text, styles.overflowWrapBreakWord, styles.whiteSpaceNoWrap, styles.fontSize15PX, styles.fontWeightBold, styles.colorBlack, styles.lineHeight125, styles.marginRight2PX].join(' ')}
            dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
          />
        </bdi>
        {
          account.get('is_verified') &&
          <Icon id='verified' width='15px' height='15px' className={[styles.default]} title='Verified Account' />
          /*<Icon id='verified' width='15px' height='15px' className={[styles.default]} title='PRO' />
          <Icon id='verified' width='15px' height='15px' className={[styles.default]} title='Donor' />
          <Icon id='verified' width='15px' height='15px' className={[styles.default]} title='Investor' />*/
        }
        <span className={[styles.text, styles.displayFlex, styles.flexNormal, styles.flexShrink1, styles.fontSize15PX, styles.overflowWrapBreakWord, styles.textOverflowEllipsis, styles.marginLeft5PX, styles.colorSubtle, styles.fontWeightNormal, styles.lineHeight125].join(' ')}>
          @{account.get('acct')}
        </span>
      </span>
    );
  }

}
