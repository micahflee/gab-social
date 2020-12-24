# frozen_string_literal: true

class REST::GroupSerializer < ActiveModel::Serializer
  include RoutingHelper
  
  attributes :id, :title, :description, :description_html,
             :cover_image_url, :is_archived, :member_count,
             :created_at, :is_private, :is_visible, :slug, :url,
             :tags, :group_category, :password, :has_password

  def id
    object.id.to_s
  end

  def has_password
    object.has_password?
  end

  def password
    if !defined?(current_user) || current_user.nil?
      return nil
    end

    if instance_options[:individual_group]
      if object.group_accounts.where(account_id: current_user.account.id, role: :admin).exists?
        object.password
      else
        nil
      end
    else
      nil
    end
  end

  def group_category
    if object.group_categories
      object.group_categories
    end
  end

  def description
    object.description
  end

  def description_html
    Formatter.instance.formatGroupDescription(object.description).strip
  end

  def clean_migrated_url
    object
      .cover_image_file_name
      .sub("gab://groups/", "https://gab.com/media/user/")
  end

  def cover_image_url
    if object.cover_image_file_name and object.cover_image_file_name.start_with? "gab://groups/"
      return clean_migrated_url
    end

    full_asset_url(object.cover_image.url)
  end

  def url
    group_show_page_url(object)
  end
  
end
