const SearchIcon = ({
  className = 'tabs-bar-icon',
  width = '16px',
  height = '16px',
  viewBox = '0 0 48 48'
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
  >
    <g>
      <path className='tabs-bar-icon__path' d='M 47.414062 44.585938 L 33.761719 30.9375 C 36.40625 27.671875 38 23.519531 38 19 C 38 8.523438 29.476562 0 19 0 C 8.523438 0 0 8.523438 0 19 C 0 29.476562 8.523438 38 19 38 C 23.519531 38 27.667969 36.40625 30.9375 33.765625 L 44.585938 47.414062 C 44.976562 47.804688 45.488281 48 46 48 C 46.511719 48 47.023438 47.804688 47.414062 47.414062 C 48.195312 46.632812 48.195312 45.367188 47.414062 44.585938 Z M 19 34 C 10.726562 34 4 27.273438 4 19 C 4 10.726562 10.726562 4 19 4 C 27.273438 4 34 10.726562 34 19 C 34 27.273438 27.273438 34 19 34 Z M 19 34'/>
    </g>
  </svg>
)

export default SearchIcon