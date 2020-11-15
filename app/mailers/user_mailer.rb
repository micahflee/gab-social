# frozen_string_literal: true

class UserMailer < Devise::Mailer
  layout 'mailer'

  helper :application
  helper :instance

  add_template_helper RoutingHelper

  def pro_expired(user)
    @resource = user
    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.pro_expired.subject')
    end
  end

  def remind_expired_pro(user, date_range)
    @date_range = date_range
    valid_date_ranges = ['7', '16', '30', '45', '60', '75', '90']

    return unless valid_date_ranges.include?(@date_range)

    @resource = user
    return if @resource.disabled?

    subject = "Renew GabPRO Today"
    case @date_range
    when '16'
      subject = "Gab’s Mission"
    when '30'
      subject = "GabPRO Membership"
    when '45'
      subject = "Renew GabPRO"
    when '60'
      subject = "Gab Depends On People Like You"
    when '75'
      subject = "Free Speech Online Powered By You"
    when '90'
      subject = "Defend Freedom Online With Us"
    end

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: subject
    end
  end

  def introduce_pro(user, date_range)
    valid_date_ranges = ['7', '15', '30']
    @date_range = date_range

    return unless valid_date_ranges.include?(@date_range)

    @resource = user
    return if @resource.disabled?

    subject = 'Gab Is Powered By You'
    case @date_range
    when '15'
      subject = 'The Silicon Valley Alternative'
    when '30'
      subject = 'Free Speech Software'
    end

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: subject
    end
  end

  def confirmation_instructions(user, token, **)
    @resource = user
    @token    = token
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.unconfirmed_email.presence || @resource.email,
           subject: I18n.t(@resource.pending_reconfirmation? ? 'devise.mailer.reconfirmation_instructions.subject' : 'devise.mailer.confirmation_instructions.subject', instance: @instance),
           template_name: @resource.pending_reconfirmation? ? 'reconfirmation_instructions' : 'confirmation_instructions'
    end
  end

  def reset_password_instructions(user, token, **)
    @resource = user
    @token    = token
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.reset_password_instructions.subject')
    end
  end

  def password_change(user, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.password_change.subject')
    end
  end

  def email_changed(user, **)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('devise.mailer.email_changed.subject')
    end
  end

  def welcome(user)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.welcome.subject')
    end
  end

  def backup_ready(user, backup)
    @resource = user
    @instance = Rails.configuration.x.local_domain
    @backup   = backup

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.backup_ready.subject')
    end
  end

  def warning(user, warning)
    @resource = user
    @warning  = warning
    @instance = Rails.configuration.x.local_domain

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email,
           subject: I18n.t("user_mailer.warning.subject.#{@warning.action}", acct: "@#{user.account.local_username_and_domain}"),
           reply_to: 'support@gab.com'
    end
  end

  def verification_approved(user)
    @resource = user
    @instance = Rails.configuration.x.local_domain

    return if @resource.disabled?

    I18n.with_locale(@resource.locale || I18n.default_locale) do
      mail to: @resource.email, subject: I18n.t('user_mailer.verifications.approved.subject')
    end
  end
end
