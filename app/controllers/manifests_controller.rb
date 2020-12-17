# frozen_string_literal: true

class ManifestsController < EmptyController

  def show
    render json: {} #InstancePresenter.new, serializer: ManifestSerializer
  end

end
