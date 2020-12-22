class AddUnreadCountToChatConversationAccountsNotNull < ActiveRecord::Migration[5.2]
  def change
    safety_assured do
      execute 'ALTER TABLE "chat_conversation_accounts" ADD CONSTRAINT "chat_conversation_accounts_unread_count_null" CHECK ("unread_count" IS NOT NULL) NOT VALID' 
    end
  end
end

class ValidateAddUnreadCountToChatConversationAccountsNotNull < ActiveRecord::Migration[5.2]
  def change
    safety_assured do
      execute 'ALTER TABLE "chat_conversation_accounts" VALIDATE CONSTRAINT "chat_conversation_accounts_unread_count_null"' 
    end
  end
end