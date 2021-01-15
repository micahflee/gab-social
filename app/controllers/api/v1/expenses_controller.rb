# frozen_string_literal: true

class Api::V1::ExpensesController < EmptyController

  def show
    amount = Redis.current.get("monthly_funding_amount") || 0
    amount = [amount.to_f, 100].min
    render json: { "expenses": amount }
  end

end
