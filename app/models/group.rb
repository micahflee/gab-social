# == Schema Information
#
# Table name: groups
#
#  id                       :bigint(8)        not null, primary key
#  account_id               :bigint(8)
#  title                    :string           not null
#  description              :string           not null
#  cover_image_file_name    :string
#  cover_image_content_type :string
#  cover_image_file_size    :integer
#  cover_image_updated_at   :datetime
#  is_nsfw                  :boolean          default(FALSE), not null
#  is_featured              :boolean          default(FALSE), not null
#  is_archived              :boolean          default(FALSE), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  member_count             :integer          default(0)
#  slug                     :text
#  is_private               :boolean          default(FALSE)
#  is_visible               :boolean          default(FALSE)
#  tags                     :string           default([]), is an Array
#  password                 :string
#  group_category_id        :integer
#

class Group < ApplicationRecord
  self.ignored_columns = ["group_categories_id"]

  include Paginable
  include GroupInteractions
  include GroupCoverImage

  PER_ACCOUNT_LIMIT = 50

  belongs_to :account, optional: true

  has_many :group_accounts, inverse_of: :group, dependent: :destroy
  has_many :accounts, through: :group_accounts
  
  has_many :group_join_requests, inverse_of: :group, dependent: :destroy
  has_many :join_requests, source: :account, through: :group_join_requests

  has_many :group_pinned_statuses, inverse_of: :group, dependent: :destroy
  has_many :pinned_statuses, source: :status, through: :group_pinned_statuses

  has_many :group_removed_accounts, inverse_of: :group, dependent: :destroy
  has_many :removed_accounts, source: :account, through: :group_removed_accounts

  belongs_to :group_categories, optional: true, foreign_key: 'group_category_id'

  validates :title, presence: true
  validates :description, presence: true

  validates_each :account_id, on: :create do |record, _attr, value|
    record.errors.add(:base, I18n.t('groups.errors.limit')) if Group.where(account_id: value).count >= PER_ACCOUNT_LIMIT
  end

  before_save :set_password
  before_destroy :clean_feed_manager
  after_create :add_owner_to_accounts

  class << self
    def search_for(term, limit = 25, offset = 0)
      pattern = sanitize_sql_like(term.strip) + '%'

      Group.where('lower(title) like lower(?) AND is_archived=false AND is_visible=true', pattern)
        .order('member_count DESC')
        .limit(limit)
        .offset(offset)
    end
  end

  private

  def set_password
    if password.nil? || !password || password.gsub(/\s+/, "").length <= 1 || password == "null"
      nil
    else
      password
    end
  end
  def add_owner_to_accounts
    group_accounts << GroupAccount.new(account: account, role: :admin, write_permissions: true)
  end

  def clean_feed_manager
    reblog_key       = FeedManager.instance.key(:group, id, 'reblogs')
    reblogged_id_set = Redis.current.zrange(reblog_key, 0, -1)

    Redis.current.pipelined do
      Redis.current.del(FeedManager.instance.key(:group, id))
      Redis.current.del(reblog_key)

      reblogged_id_set.each do |reblogged_id|
        reblog_set_key = FeedManager.instance.key(:group, id, "reblogs:#{reblogged_id}")
        Redis.current.del(reblog_set_key)
      end
    end
  end
end
