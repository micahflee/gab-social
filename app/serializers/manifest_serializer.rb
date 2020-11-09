# frozen_string_literal: true

class ManifestSerializer < ActiveModel::Serializer
  include RoutingHelper
  include ActionView::Helpers::TextHelper

  attributes :name, :short_name, :description,
             :icons, :theme_color, :background_color,
             :display, :start_url, :scope,
             :share_target

  def name
    'Gab Social'
  end

  def short_name
    'Gab Social'
  end

  def description
    'Gab is a social network that champions free speech, individual liberty and the free flow of information online. All are welcome.'
  end

  def icons
    [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ]
  end

  def theme_color
    '#21D07B'
  end

  def background_color
    '#191b22'
  end

  def display
    'standalone'
  end

  def start_url
    '/home'
  end

  def scope
    root_url
  end

  def share_target
    {
      url_template: 'share?title={title}&text={text}&url={url}',
      action: 'share',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    }
  end
end
