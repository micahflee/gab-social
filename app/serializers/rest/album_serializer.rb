# frozen_string_literal: true

class REST::AlbumSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :count

  belongs_to :cover, serializer: REST::MediaAttachmentSerializer

  def id
    object.id.to_s
  end

end