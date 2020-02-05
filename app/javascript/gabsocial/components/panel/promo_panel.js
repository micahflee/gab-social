import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { me } from '../../initial_state';
import Icon from '../icon'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  pro: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  donation: { id: 'promo.donation', defaultMessage: 'Make a Donation' },
  store: { id: 'promo.store', defaultMessage: 'Store - Buy Merch' },
  apps: { id: 'promo.gab_apps', defaultMessage: 'Gab Apps' },
})

const mapStateToProps = state => {
  return {
    isPro: state.getIn(['accounts', me, 'is_pro']),
  };
};

export default
@injectIntl
@connect(mapStateToProps)
class PromoPanel extends PureComponent {

  static propTypes = {
    isPro: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  render() {
    const { isPro, intl } = this.props

    const cx = classNames.bind(styles)

    const items = [
      {
        text: intl.formatMessage(messages.pro),
        href: 'https://pro.gab.com',
        icon: 'arrow-up',
        conditions: isPro,
        highlighted: true,
      },
      {
        text: intl.formatMessage(messages.donation),
        href: 'https://shop.dissenter.com/category/donations',
        icon: 'heart',
      },
      {
        text: intl.formatMessage(messages.store),
        href: 'https://shop.dissenter.com',
        icon: 'shopping-cart',
      },
      {
        text: intl.formatMessage(messages.apps),
        href: 'https://apps.gab.com',
        icon: 'th',
      }
    ]

    return (
      <PanelLayout>
        {
          items.map((item, i) => {
            if (item.conditions === false) return null

            const classes = cx({
              default: true,
              borderColorSubtle: i !== items.length - 1,
              borderBottom1PX: i !== items.length - 1,
            })

            return (
              <div key={`promo-panel-item-${i}`} className={classes}>
                <a className={[styles.default, styles.text, styles.colorBlack, styles.noUnderline, styles.paddingVertical10PX, styles.alignItemsCenter].join(' ')} href={item.href}>
                  <Icon id={item.icon} height='13px' width='13px' className={[styles.flex, styles.marginRight10PX].join(' ')} />
                  {item.text}
                </a>
              </div>
            )
          })
        }
      </PanelLayout>
    )
  }
}
