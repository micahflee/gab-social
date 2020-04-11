import unicodeMapping from './emoji/emoji_unicode_mapping_light'

const assetHost = process.env.CDN_HOST || ''

// .autosuggest-emoji {
//   display: flex;
//   justify-items: center;
//   align-content: flex-start;
//   flex-direction: row;

//   @include text-sizing(14px, 400, 18px);

//   img {
//     display: block;
//     margin-right: 8px;

//     @include size(16px);
//   }
// }

// .emojione {
//   font-size: inherit;
//   vertical-align: middle;
//   object-fit: contain;
//   margin: -.2ex .15em .2ex;

//   @include size(16px);

//   img {
//     width: auto;
//   }
// }

export default class AutosuggestEmoji extends PureComponent {

  static propTypes = {
    emoji: PropTypes.object.isRequired,
  }

  render () {
    const { emoji } = this.props
    let url

    if (emoji.custom) {
      url = emoji.imageUrl
    } else {
      const mapping = unicodeMapping[emoji.native] || unicodeMapping[emoji.native.replace(/\uFE0F$/, '')]

      if (!mapping) return null

      url = `${assetHost}/emoji/${mapping.filename}.svg`
    }

    return (
      <div className='autosuggest-emoji'>
        <img className='emojione' src={url} alt={emoji.native || emoji.colons} />
        {emoji.colons}
      </div>
    )
  }

}
