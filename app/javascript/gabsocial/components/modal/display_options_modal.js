import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'
import SettingSwitch from '../setting_switch'

const messages = defineMessages({
  message: { id: 'display_options.message', defaultMessage: 'Display settings affect your Gab account on this browser. These settings are only visible to you.' },
  title: { id: 'display_options', defaultMessage: 'Customize your view' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['notifications', 'filter']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(path, value) {
    dispatch(setFilter(path, value))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class DisplayOptionsModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  }

  handleClick = () => {
    this.props.onClose()
    this.props.onConfirm(this.props.account, this.props.notifications)
  }

  // document.documentElement.style.setProperty("--color-surface", "black");
  
  render() {
    const {
      account,
      intl,
      settings,
      onChange,
      onClose,
    } = this.props

    // theme - light, muted, dark
    // text size - extra small, small, normal, medium, large, extra large
    // rounded borders

    return (
      <ModalLayout
        onClose={onClose}
        width={520}
        title={intl.formatMessage(messages.title)}
      >

        <div className={[_s.default, _s.mb15].join(' ')}>
          <Text>
            {intl.formatMessage(messages.message)}
          </Text>
        </div>

        <div className={[_s.default, _s.mb10].join(' ')}>
          <Text weight='bold' color='secondary'>
            Font Size
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.mt10, _s.py15, _s.px15, _s.bgTertiary].join(' ')}>
            test
          </div>
        </div>

        <div className={[_s.default, _s.mb10].join(' ')}>
          <Text weight='bold' color='secondary'>
            Rounded
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.mt10, _s.py15, _s.px15, _s.bgTertiary].join(' ')}>
            <SettingSwitch
              prefix='notification'
              settings={settings}
              settingPath={'onlyVerified'}
              onChange={onChange}
              label={'Small Radius'}
            />

            <SettingSwitch
              prefix='notification'
              settings={settings}
              settingPath={'onlyVerified'}
              onChange={onChange}
              label={'Circle Radius'}
            />
          </div>
        </div>

        <div className={[_s.default, _s.mb10].join(' ')}>
          <Text weight='bold' color='secondary'>
            Theme
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.flexRow, _s.mt10, _s.py15, _s.px15, _s.bgTertiary].join(' ')}>

            <div className={[_s.default, _s.py10, _s.px10, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.bgPrimary, _s.radiusSmall]}>
                <Text>
                  Light
                </Text>
              </div>
            </div>

            <div className={[_s.default, _s.py10, _s.px10, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.bgPrimary, _s.radiusSmall]}>
                <Text>
                  Muted
                </Text>
              </div>
            </div>

            <div className={[_s.default, _s.py10, _s.px10, _s.flexGrow1].join(' ')}>
              <div className={[_s.default, _s.bgPrimary, _s.radiusSmall]}>
                <Text>
                  Black
                </Text>
              </div>
            </div>

          </div>
        </div>
        
        <div className={[_s.mlAuto, _s.mrAuto].join(' ')}>
          <Button>
            <Text size='medium' color='inherit'>
              Done
            </Text>
          </Button>
        </div>

      </ModalLayout> 
    )
  }

}
