import { injectIntl, defineMessages } from 'react-intl'
import { URL_GAB_PRO } from '../../constants'
import PanelLayout from './panel_layout';
import Button from '../button'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'promo.gab_pro', defaultMessage: 'Upgrade to GabPRO' },
  text: { id: 'pro_upgrade_modal.text_sm', defaultMessage: 'Please consider supporting us on our mission to defend free expression online for all people.' },
})

export default
@injectIntl
class ProPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool.isRequired,
  }

  render() {
    const { intl, isPro } = this.props

    // if (isPro) return null

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.text)}
      >
        <Button
          isBlock
          href={URL_GAB_PRO}
          icon='arrow-up'
          className={[_s.justifyContentCenter].join(' ')}
        >
          <Text
            color='inherit'
            weight='medium'
            size='medium'
            align='center'
            className={_s.ml5}
          >
            {intl.formatMessage(messages.title)}
          </Text>
        </Button>
      </PanelLayout>
    )
  }

}