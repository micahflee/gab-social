import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';

import './promo_panel.scss';

export default class PromoPanel extends PureComponent {

  render() {
    return (
      <div className='promo-panel'>
        <div className='promo-panel__container'>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn button button-alternative-2' href='https://invest.gab.com'>
              <Icon id='check-circle' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.invest_heading' defaultMessage='Invest in Gab' />
            </a>
            <p className='promo-panel-item__message'>
              <FormattedMessage
                id='promo.invest_message'
                defaultMessage='Learn more about investing in Gab and our vision for the future.'
              />
            </p>
          </div>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn button button-alternative-2' href='/invites'>
              <Icon id='envelope' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.invite_heading' defaultMessage='Invite Friends' />
            </a>
            <p className='promo-panel-item__message promo-panel-item__message--dark'>
              <FormattedMessage
                id='promo.invite_message'
                defaultMessage='Invite others to be a member of Gab.'
              />
            </p>
          </div>

        </div>
      </div>
    );
  }
}
