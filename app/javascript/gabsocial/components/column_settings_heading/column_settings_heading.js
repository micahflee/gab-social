import './column_settings_heading.scss';

export default class ColumnSettingsHeading extends PureComponent {
  static propTypes = {
    heading: PropTypes.object.isRequired,
    id: PropTypes.string,
  };

  render() {
    const { heading } = this.props;

    return (
      <span id={id} className='column-settings-heading'>{heading}</span>
    )
  }
}