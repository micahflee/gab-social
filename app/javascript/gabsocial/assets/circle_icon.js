const CircleIcon = ({
  className = '',
  width = '16px',
  height = '16px',
  viewBox = '0 0 48 48',
  title = '',
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
        <circle cx='24' cy='24' r='20' />
      </g>
    </svg>
  )

export default CircleIcon