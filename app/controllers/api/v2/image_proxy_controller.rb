require 'base64'
require 'net/http'

class Api::V2::ImageProxyController < EmptyController
  def get
    if params[:trends_url].nil?
      raise GabSocial::NotPermittedError
    else
      url = URI.parse(params[:trends_url])
      image = Net::HTTP.get_response(url)
      send_data image.body, type: image.content_type, disposition: 'inline'
    end
  end
end