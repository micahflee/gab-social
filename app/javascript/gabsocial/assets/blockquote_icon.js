const BlockQuoteIcon = ({
  className = '',
  size = '16px',
  title = 'Block Quote',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={size}
    height={size}
    viewBox='0 0 34 32'
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d='M 0 18.285156 L 6.855469 18.285156 L 2.285156 27.429688 L 9.144531 27.429688 L 13.714844 18.285156 L 13.714844 4.570312 L 0 4.570312 Z M 0 18.285156' />
      <path d='M 18.285156 4.570312 L 18.285156 18.285156 L 25.144531 18.285156 L 20.570312 27.429688 L 27.429688 27.429688 L 32 18.285156 L 32 4.570312 Z M 18.285156 4.570312' />
    </g>
  </svg>
)

export default BlockQuoteIcon
