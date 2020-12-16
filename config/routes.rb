# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Sidekiq::Web.set :session_secret, Rails.application.secrets[:secret_key_base]

username_regex = /([^\/]*)/
html_only = lambda { |req| req.format.nil? || req.format.html? }

Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: 'letter_opener' if Rails.env.development?

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web, at: 'sidekiq', as: :sidekiq
    mount PgHero::Engine, at: 'pghero', as: :pghero
  end

  use_doorkeeper do
    controllers authorizations: 'oauth/authorizations',
                authorized_applications: 'oauth/authorized_applications',
                tokens: 'oauth/tokens'
  end

  get '.well-known/change-password', to: redirect('/auth/edit')

  get 'manifest', to: 'manifests#show', defaults: { format: 'json' }

  devise_scope :user do
    match '/auth/finish_signup' => 'auth/confirmations#finish_signup', via: [:get, :patch], as: :finish_signup
  end

  devise_for :users, path: 'auth', controllers: {
    sessions:           'auth/sessions',
    registrations:      'auth/registrations',
    passwords:          'auth/passwords',
    confirmations:      'auth/confirmations',
  }

  get '/authorize_follow', to: redirect { |_, request| "/authorize_interaction?#{request.params.to_query}" }

  namespace :settings do
    resource :profile, only: [:show, :update]
    resource :preferences, only: [:show, :update]
    resource :notifications, only: [:show, :update]

    namespace :billing do
      get :upgrade, to: 'upgrade#index', as: :upgrade
      get :transactions, to: 'transactions#index', as: :transactions
      post '/btcpay-notification', to: 'upgrade#btcpay_notification', as: :btcpay_notification
    end

    resources :promotions, only: [:index, :new, :create, :edit, :update, :destroy]
    resources :expenses, only: [:index, :new, :create, :edit, :update, :destroy]
    resources :group_categories, only: [:index, :new, :create, :edit, :update, :destroy]
    resources :trending_hashtags, only: [:index, :new, :create, :edit, :update, :destroy]

    namespace :verifications do
      get :moderation, to: 'moderation#index', as: :moderation
      get 'moderation/:id/approve', to: 'moderation#approve', as: :approve
      get 'moderation/:id/reject', to: 'moderation#reject', as: :reject

      resources :requests, only: [:index, :create]
    end

    resource :export, only: [:show, :create]
    namespace :exports, constraints: { format: :csv } do
      resources :follows, only: :index, controller: :following_accounts
      resources :blocks, only: :index, controller: :blocked_accounts
      resources :mutes, only: :index, controller: :muted_accounts
      resources :lists, only: :index, controller: :lists
    end

    resource :two_factor_authentication, only: [:show, :create, :destroy]
    namespace :two_factor_authentication do
      resources :recovery_codes, only: [:create]
      resource :confirmation, only: [:new, :create]
    end

    resources :applications, except: [:edit] do
      member do
        post :regenerate
      end
    end

    resource :delete, only: [:show, :destroy]

    resources :sessions, only: [:destroy]
    resources :scheduled_statuses, only: [:index, :destroy]
  end

  resources :media, only: [:show] do
    get :player
  end

  resources :filters, except: [:show]

  get '/media_proxy/:id/(*any)', to: 'media_proxy#show', as: :media_proxy

  namespace :admin do
    get '/dashboard', to: 'dashboard#index'

    resources :email_domain_blocks, only: [:index, :new, :create, :destroy]
    resources :link_blocks, only: [:index, :new, :create, :destroy]
    resources :action_logs, only: [:index]
    resources :warning_presets, except: [:new]
    resource :settings, only: [:edit, :update]

    resources :reports, only: [:index, :show] do
      member do
        post :assign_to_self
        post :unassign
        post :reopen
        post :resolve
      end

      resources :reported_statuses, only: [:create]
    end

    resources :report_notes, only: [:create, :destroy]

    resources :accounts, only: [:index, :show, :edit, :update] do
      member do
        post :enable
        post :unsilence
        post :unsuspend
        post :redownload
        post :remove_avatar
        post :remove_header
        post :memorialize
        post :approve
        post :reject
        post :verify
        post :unverify
        post :add_donor_badge
        post :remove_donor_badge
        post :add_investor_badge
        post :remove_investor_badge
        get :edit_pro
        put :save_pro
      end

      resource :change_email, only: [:show, :update]
      resource :reset, only: [:create]
      resource :action, only: [:new, :create], controller: 'account_actions'
      resources :statuses, only: [:index, :show, :create, :update, :destroy]
      resources :followers, only: [:index]
      resources :joined_groups, only: [:index]
      resources :chat_conversations, only: [:index]
      resources :chat_messages, only: [:index, :show, :create, :update, :destroy]

      resource :confirmation, only: [:create] do
        collection do
          post :resend
        end
      end

      resource :role do
        member do
          post :promote
          post :demote
        end
      end
    end

    resources :users, only: [] do
      resource :two_factor_authentication, only: [:destroy]
    end

    resources :custom_emojis, only: [:index, :new, :create, :update, :destroy]

    resources :groups, only: [:index, :show, :update, :destroy] do
      member do
        post :enable_featured
        post :disable_featured
      end
    end

    resources :account_moderation_notes, only: [:create, :destroy]
  end

  namespace :api do
    # OEmbed
    get '/oembed', to: 'oembed#show', as: :oembed

    # Identity proofs
    get :proofs, to: 'proofs#index'

    # JSON / REST API
    namespace :v1 do
      resources :statuses, only: [:create, :update, :show, :destroy] do
        scope module: :statuses do
          resources :reblogged_by, controller: :reblogged_by_accounts, only: :index
          resources :favourited_by, controller: :favourited_by_accounts, only: :index
          resource :reblog, only: :create
          post :unreblog, to: 'reblogs#destroy'

          resource :favourite, only: :create
          post :unfavourite, to: 'favourites#destroy'

          resource :bookmark, only: [:show, :create]
          post :unbookmark, to: 'bookmarks#destroy'

          resource :pin, only: [:show, :create]
          post :unpin, to: 'pins#destroy'
        end

        member do
          get :comments
          get :context
          get :card
          get :revisions
        end
      end

      namespace :timelines do
        resource :home, only: :show, controller: :home
        resource :public, only: :show, controller: :public
        resource :pro, only: :show, controller: :pro
        resources :tag, only: :show
        resources :list, only: :show
        resources :group, only: :show
        resources :group_collection, only: :show
        resources :group_pins, only: :show
        resources :preview_card, only: :show
        resource :explore, only: :show, controller: :explore
      end

      resource :chat_conversation_accounts, only: :show do
        resource :blocked_chat_accounts, only: :show, controller: 'chat_conversation_accounts/blocked_chat_accounts'
        resource :muted_chat_accounts, only: :show, controller: 'chat_conversation_accounts/muted_chat_accounts'

        member do
          get :is_messenger_blocked
          get :is_messenger_muted
          post :block_messenger
          post :unblock_messenger
          post :mute_messenger
          post :unmute_messenger
          post :set_expiration_policy
        end
      end

      namespace :chat_conversations do
        resources :messages, only: :show do
          member do
            delete :destroy_all
          end
        end
        resources :approved_conversations, only: :index do
          collection do
            get :unread_count
          end
        end
        resources :requested_conversations, only: :index do
          collection do
            get :count
          end
        end
      end

      resources :chat_conversation, only: [:show, :create] do
        member do
          post :mark_chat_conversation_approved
          post :mark_chat_conversation_read
          post :mark_chat_conversation_hidden
        end
      end

      resources :links,         only: :show
      resource :popular_links,  only: :show
      resources :streaming,     only: [:index]
      resources :custom_emojis, only: [:index]
      resources :suggestions,   only: [:index, :destroy]
      resources :scheduled_statuses, only: [:index, :show, :update, :destroy]
      resources :preferences,   only: [:index]
      resources :group_categories, only: [:index]
      resources :chat_messages, only: [:create, :destroy]
      resources :promotions,   only: [:index]
      resources :follows,      only: [:create]
      resources :media,        only: [:create, :update]
      resources :blocks,       only: [:index]
      resources :mutes,        only: [:index]
      resources :favourites,   only: [:index]
      resources :reports,      only: [:create]
      resources :filters,      only: [:index, :create, :show, :update, :destroy]
      resources :shortcuts,    only: [:index, :create, :show, :destroy]
      resources :bookmarks,    only: [:index]
      resources :bookmark_collections, only: [:index, :create, :update, :show, :destroy]
      resources :albums,       only: [:index, :create, :update, :show, :destroy]

      get '/search', to: 'search#index', as: :search
      get '/account_by_username/:username', to: 'account_by_username#show', username: username_regex

      namespace :apps do
        get :verify_credentials, to: 'credentials#show'
      end

      resources :apps, only: [:create]

      resources :follow_requests, only: [:index] do
        member do
          post :authorize
          post :reject
        end
      end

      resources :notifications, only: [:index, :show] do
        collection do
          post :clear
          post :mark_read
        end
      end

      namespace :accounts do
        get :verify_credentials, to: 'credentials#show'
        patch :update_credentials, to: 'credentials#update'
        post :resend_email_confirmation, to: 'credentials#resend_email_confirmation'
        resource :search, only: :show, controller: :search
        resources :relationships, only: :index
      end

      resources :accounts, only: [:create, :show] do
        resources :statuses, only: :index, controller: 'accounts/statuses'
        resources :followers, only: :index, controller: 'accounts/follower_accounts'
        resources :following, only: :index, controller: 'accounts/following_accounts'
        resources :lists, only: :index, controller: 'accounts/lists'

        member do
          post :follow
          post :unfollow
          post :block
          post :unblock
          post :mute
          post :unmute
        end
      end

      resources :lists, only: [:index, :create, :show, :update, :destroy] do
        resource :accounts, only: [:show, :create, :destroy], controller: 'lists/accounts'
      end

      resources :groups, only: [:index, :create, :show, :update, :destroy] do
        member do
          delete '/statuses/:status_id', to: 'groups#destroy_status'
          post '/statuses/:status_id/approve', to: 'groups#approve_status'
        end

        get '/category/:category', to: 'groups#by_category'
        get '/tag/:tag', to: 'groups#by_tag'

        resources :relationships, only: :index, controller: 'groups/relationships'
        resource :accounts, only: [:show, :create, :update, :destroy], controller: 'groups/accounts'
        resource :removed_accounts, only: [:show, :create, :destroy], controller: 'groups/removed_accounts'
        resource :password, only: [:create], controller: 'groups/password'
        resource :join_requests, only: [:show], controller: 'groups/requests'
        
        post '/join_requests/respond', to: 'groups/requests#respond_to_request'

        resource :pin, only: [:show, :create], controller: 'groups/pins'
        post :unpin, to: 'groups/pins#destroy'
      end

      resources :polls, only: [:create, :show] do
        resources :votes, only: :create, controller: 'polls/votes'
      end

      namespace :push do
        resource :subscription, only: [:create, :show, :update, :destroy]
      end
    end

    namespace :v2 do
      get '/search', to: 'search#index', as: :search
      get '/image_proxy', to: 'image_proxy#get'
    end

    namespace :web do
      resource :settings, only: [:update]
      resource :embed, only: [:create]
      resources :push_subscriptions, only: [:create] do
        member do
          put :update
        end
      end
    end
  end

  get '/g/:groupSlug', to: 'react#groupBySlug'
  get '/(*any)', to: 'react#react', as: :web
  root 'react#react'

  get '/', to: 'react#react', as: :homepage

  match '*unmatched_route',
        via: :all,
        to: 'application#raise_not_found',
        format: false
end
