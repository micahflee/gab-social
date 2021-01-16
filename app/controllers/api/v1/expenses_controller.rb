# frozen_string_literal: true

class Api::V1::ExpensesController < EmptyController

  def show
    Redis.current.with do |conn|
      amount = conn.get("monthly_funding_amount") || 0
    end
    amount = [amount.to_f, 100].min
    render json: { "expenses": amount }
  end

end
