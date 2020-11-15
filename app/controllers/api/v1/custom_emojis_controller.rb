# frozen_string_literal: true

class Api::V1::CustomEmojisController < EmptyController

  def index
    data = ActiveModelSerializers::SerializableResource.new(CustomEmoji.local, each_serializer: REST::CustomEmojiSerializer)
    render json: data.to_json, content_type: 'application/json'
  end

end
