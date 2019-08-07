import './column_subheading.scss';

export default class ColumnSubheading extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    const { text } = this.props;

    return (
      <div className='column-subheading'>
        {text}
      </div>
    );
  }
};