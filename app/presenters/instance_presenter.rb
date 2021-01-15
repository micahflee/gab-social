# frozen_string_literal: true

class InstancePresenter
  delegate(
    :site_title,
    :site_short_description,
    :site_description,
    to: Setting
  )

  def version_number
    GabSocial::Version
  end

  def source_url
    GabSocial::Version.source_url
  end
  
end
