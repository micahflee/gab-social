# frozen_string_literal: true

class REST::PollOptionSerializer < ActiveModel::Serializer
  attributes :title, :votes_count

end