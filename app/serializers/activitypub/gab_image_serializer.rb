# frozen_string_literal: true

class ActivityPub::GabImageSerializer < ActivityPub::ImageSerializer
  def url
    object
      .sub('gab://avatar/', 'https://gab.com/media/user/')
      .sub('gab://header/', 'https://gab.com/media/user/')
  end

  def media_type; end
end
