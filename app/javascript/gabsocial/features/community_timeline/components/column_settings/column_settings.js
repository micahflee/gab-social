import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import SettingToggle from '../../../../components/setting_toggle';
import { changeSetting } from '../../../../actions/settings';

const mapStateToProps = state => ({
  settings: state.getIn(['settings', 'community']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['community', ...key], checked));
    },
  };
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class ColumnSettings extends ImmutablePureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render () {
    const { settings, onChange } = this.props;

    return (
      <div>
        <SettingToggle
          settings={settings}
          settingPath={['other', 'onlyMedia']}
          onChange={onChange}
          label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media Only' />}
        />
        <SettingToggle
          settings={settings}
          settingPath={['other', 'allFediverse']}
          onChange={onChange}
          label={<FormattedMessage id='community.column_settings.all_fediverse' defaultMessage='All Fediverse' />}
        />
      </div>
    );
  }

}
