import './index.scss';

export default class Badge extends PureComponent {

  static propTypes = {
    type: PropTypes.oneOf([
      'pro',
      'donor',
      'investor',
    ]).isRequired,
  };

  render() {
    const { type } = this.props;

    if (!type) return null;

    return (
      <span className={`badge badge--${type}`}>
        {type.toUpperCase()}
      </span>
    );
  }

};
