import './index.scss';

export default class Column extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
  };

  render () {
    const { label, children } = this.props;

    return (
      <div role='region' aria-label={label} className='column'>
        {children}
      </div>
    );
  }

}