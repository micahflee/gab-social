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
#

class MediaAttachmentAlbum < ApplicationRecord

  enum visibility: [
    :public,
    :private,
  ], _suffix: :visibility

  belongs_to :account

end
