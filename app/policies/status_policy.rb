# frozen_string_literal: true

class StatusPolicy < ApplicationPolicy
  def initialize(current_account, record, preloaded_relations = {})
    super(current_account, record)

    @preloaded_relations = preloaded_relations
  end

  def index?
    staff?
  end

  def show?
    return true if owned? || staff?

    if private?
      if record.group_id
        private_group_member?
      else
        following_author?
      end
    elsif requires_mention?
      mention_exists?
    else
      current_account.nil? || !author_blocking?
    end
  end

  def reblog?
    !requires_mention? && (!private? || owned?) && show? && !blocking_author?
  end

  def favourite?
    show? && !blocking_author?
  end

  def destroy?
    staff? || owned?
  end

  alias unreblog? destroy?

  def update?
    staff? || owned?
  end

  private

  def requires_mention?
    record.limited_visibility?
  end

  def owned?
    author.id == current_account&.id
  end

  def private?
    record.hidden?
  end

  def mention_exists?
    return false if current_account.nil?

    if record.mentions.loaded?
      record.mentions.any? { |mention| mention.account_id == current_account.id }
    else
      record.mentions.where(account: current_account).exists?
    end
  end

  def blocking_author?
    return false if current_account.nil?
    return false if owned?

    @preloaded_relations[:blocking] ? @preloaded_relations[:blocking][author.id] : current_account.blocking?(author)
  end

  def author_blocking?
    return false if current_account.nil?
    return false if owned?
    
    @preloaded_relations[:blocked_by] ? @preloaded_relations[:blocked_by][author.id] : author.blocking?(current_account)
  end

  def following_author?
    return false if current_account.nil?
    return true if owned?

    @preloaded_relations[:following] ? @preloaded_relations[:following][author.id] : current_account.following?(author)
  end

  def private_group_member?
    return false if current_account.nil?
    return false if record.group_id.nil?
    return true if owned?

    GroupAccount.where(group_id: record.group_id, account: current_account).exists?
  end

  def author
    record.account
  end
end
