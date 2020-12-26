# frozen_string_literal: true

class ManifestsController < EmptyController
  def show
    render json: {
      name: 'Gab Social',
      short_name: 'Gab Social',
      description: 'Gab is a social network that champions free speech, individual liberty and the free flow of information online. All are welcome.',
      icons: [{
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      }],
      theme_color: '#21D07B',
      background_color: '#191b22',
      display: 'standalone',
      start_url: '/home',
      scope: root_url,
      share_target: {
        action: '/compose',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text',
          url: 'url',
        }
      }
    }
  end
end
