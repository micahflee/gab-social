import classNames from 'classnames';

import './icon.scss';
export default class Icon extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  static defaultProps = {
    width: '26px',
    height: '26px',
  };

  render () {
    const { className, width, height } = this.props;

    return (
      <svg
        className={className}
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        width={width}
        height={height}
        viewBox='0 0 48 48'
        xmlSpace='preserve'
      >
        <g>
          <path d='M 17 40 C 18 46 21 48 24 48 C 26 48 29 46 30 40 Z M 17 40' />
          <path d='M 24 4 C 25 4 27 4 29 5 L 29 5 C 29 2 27 0 24 0 L 23 0 C 20 0 18 2 18 5 L 18 5 C 20 4 22 4 24 4 Z M 24 4' />
          <path d='M 41 40 L 6 40 C 5 40 5 40 5 39 C 4 39 5 38 5 38 C 5 38 6 37 8 35 C 9 30 10 25 10 21 C 10 13 16 7 24 7 C 31 7 37 13 37 20 C 37 20 37 20 37 21 C 37 25 38 30 39 35 C 41 37 42 38 42 38 C 42 38 43 39 42 39 C 42 40 42 40 41 40 Z M 42 38 Z M 42 38' />
        </g>
      </svg>
    );
  }

}
