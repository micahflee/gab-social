import React from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import { getLocale } from '../locales';
import MediaGallery from 'gabsocial/components/media_gallery';
import Video from 'gabsocial/components/video';
import Card from 'gabsocial/components/status_card';
import Poll from 'gabsocial/components/poll';
import { List as ImmutableList, fromJS } from 'immutable';

const { localeData, messages } = getLocale();
addLocaleData(localeData);

const MEDIA_COMPONENTS = { MediaGallery, Video, Card, Poll };

class MediaContainer extends React.PureComponent {

  state = {
    media: null,
    index: null,
    time: null,
  };

  handleOpenMedia = (media, index) => {
    document.body.classList.add('with-modals--active');
    this.setState({ media, index });
  }

  handleOpenVideo = (video, time) => {
    const media = ImmutableList([video]);

    document.body.classList.add('with-modals--active');
    this.setState({ media, time });
  }

  handleCloseMedia = () => {
    document.body.classList.remove('with-modals--active');
    this.setState({ media: null, index: null, time: null });
  }

  render () {
    const { locale, components } = this.props;

    return (
      <IntlProvider locale={locale} messages={messages}>
        <React.Fragment>
          {[].map.call(components, (component, i) => {
            const componentName = component.getAttribute('data-component');
            const Component = MEDIA_COMPONENTS[componentName];
            const { media, card, poll, ...props } = JSON.parse(component.getAttribute('data-props'));

            Object.assign(props, {
              ...(media ? { media: fromJS(media) } : {}),
              ...(card  ? { card:  fromJS(card)  } : {}),
              ...(poll  ? { poll:  fromJS(poll)  } : {}),

              ...(componentName === 'Video' ? {
                onOpenVideo: this.handleOpenVideo,
              } : {
                onOpenMedia: this.handleOpenMedia,
              }),
            });

            return ReactDOM.createPortal(
              <Component {...props} key={`media-${i}`} />,
              component,
            );
          })}
        </React.Fragment>
      </IntlProvider>
    );
  }

}

MediaContainer.propTypes = {
  locale: PropTypes.string.isRequired,
  components: PropTypes.object.isRequired,
}

export default MediaContainer