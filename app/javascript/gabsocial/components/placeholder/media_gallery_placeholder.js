import PlaceholderLayout from './placeholder_layout'

export default class MediaGalleryPlaceholder extends PureComponent {
  
  static propTypes = {
    type: PropTypes.string,
  }

  render() {
    const { type } = this.props

    return (
      <div className={[_s.default, _s.px5, _s.py5].join(' ')}>
        <PlaceholderLayout viewBox='0 0 400 196'>
          <rect x='0' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='100' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='300' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='200' y='0' rx='0' ry='0' width='96' height='96' /> 
          <rect x='-2' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='100' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='300' y='100' rx='0' ry='0' width='96' height='96' /> 
          <rect x='200' y='100' rx='0' ry='0' width='96' height='96' />
        </PlaceholderLayout>
      </div>
    )
  }

}