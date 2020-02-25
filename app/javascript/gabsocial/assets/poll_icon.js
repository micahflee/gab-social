const PollIcon = ({
  className = '',
  width = '16px',
  height = '16px',
  viewBox = '0 0 48 48',
  title = 'Poll',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={width}
    height={height}
    viewBox={viewBox}
    xmlSpace='preserve'
    aria-label={title}
  >
  <g>
    <path d="M 42.667969 0 L 5.332031 0 C 2.386719 0 0 2.386719 0 5.332031 L 0 42.667969 C 0 45.613281 2.386719 48 5.332031 48 L 42.667969 48 C 45.613281 48 48 45.613281 48 42.667969 L 48 5.332031 C 48 2.386719 45.613281 0 42.667969 0 Z M 16 37.332031 L 10.667969 37.332031 L 10.667969 18.667969 L 16 18.667969 Z M 26.667969 37.332031 L 21.332031 37.332031 L 21.332031 10.667969 L 26.667969 10.667969 Z M 37.332031 37.332031 L 32 37.332031 L 32 26.667969 L 37.332031 26.667969 Z M 37.332031 37.332031" />
  </g>
</svg>
)

export default PollIcon