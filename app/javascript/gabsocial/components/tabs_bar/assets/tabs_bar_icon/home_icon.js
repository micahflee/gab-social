const HomeIcon = ({
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
      <path className='tabs-bar-icon__path' d='M 47.238281 21.695312 L 25.039062 0.417969 C 24.457031 -0.140625 23.542969 -0.140625 22.960938 0.417969 L 0.738281 21.71875 C 0.269531 22.1875 0 22.835938 0 23.5 C 0 24.878906 1.121094 26 2.5 26 L 6 26 L 6 45 C 6 46.65625 7.34375 48 9 48 L 17.5 48 C 18.328125 48 19 47.328125 19 46.5 L 19 33.5 C 19 33.226562 19.222656 33 19.5 33 L 28.5 33 C 28.773438 33 29 33.226562 29 33.5 L 29 46.5 C 29 47.328125 29.671875 48 30.5 48 L 39 48 C 40.65625 48 42 46.65625 42 45 L 42 26 L 45.5 26 C 46.878906 26 48 24.878906 48 23.5 C 48 22.835938 47.730469 22.1875 47.238281 21.695312 Z M 47.238281 21.695312' />
    </g>
  </svg>
)

export default HomeIcon