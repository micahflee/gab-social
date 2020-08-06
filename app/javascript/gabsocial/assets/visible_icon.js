const VisibleIcon = ({
  className = '',
  size = '16px',
  title = '',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 48 48'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 24 17.45 C 20.39 17.45 17.45 20.39 17.45 24 C 17.45 27.61 20.39 30.55 24 30.55 C 27.61 30.55 30.55 27.61 30.55 24 C 30.55 20.39 27.61 17.45 24 17.45 Z M 24 17.45' />
      <path d='M 24 7.64 C 13.09 7.64 3.77 14.42 0 24 C 3.77 33.58 13.09 40.36 24 40.36 C 34.92 40.36 44.23 33.58 48 24 C 44.23 14.42 34.92 7.64 24 7.64 Z M 24 34.91 C 17.98 34.91 13.09 30.02 13.09 24 C 13.09 17.98 17.98 13.09 24 13.09 C 30.02 13.09 34.91 17.98 34.91 24 C 34.91 30.02 30.02 34.91 24 34.91 Z M 24 34.91 NaN' />
    </g>
  </svg>
)

export default VisibleIcon