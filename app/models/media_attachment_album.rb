# frozen_string_literal: true
# == Schema Information
#
# Table name: media_attachment_albums
#
#  id          :bigint(8)        not null, primary key
#  title       :text             default(""), not null
#  description :text
#  account_id  :integer          not null
#  visibility  :integer          default("public"), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  cover_id    :bigint(8)
#  count       :integer          default(0), not null
#

class MediaAttachmentAlbum < ApplicationRecord

  include Paginable

  enum visibility: [
    :public,
    :private,
  ], _suffix: :visibility

  belongs_to :account
  belongs_to :cover, class_name: 'MediaAttachment', optional: true

end
