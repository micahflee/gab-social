const PlayIcon = ({
  className = '',
  width = '16px',
  height = '16px',
  viewBox = '0 0 64 64',
  title = 'Play',
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
        <path d="M 52.492188 26.058594 L 16.941406 1.71875 C 15.300781 0.59375 13.644531 0 12.269531 0 C 9.613281 0 7.96875 2.132812 7.96875 5.703125 L 7.96875 58.304688 C 7.96875 61.871094 9.609375 64 12.261719 64 C 13.640625 64 15.265625 63.402344 16.914062 62.277344 L 52.476562 37.941406 C 54.765625 36.371094 56.03125 34.261719 56.03125 31.996094 C 56.03125 29.734375 54.78125 27.625 52.492188 26.058594 Z M 52.492188 26.058594" />
      </g>
    </svg>
  )

export default PlayIcon