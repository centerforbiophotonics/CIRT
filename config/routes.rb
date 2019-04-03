Rails.application.routes.draw do
  resources :roles, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end
  resources :person_events, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :events, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :event_categories, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :person_funds, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :group_categories, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :funds, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end

  resources :person_groups, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
      get :all_roles
    end
  end

  resources :groups, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end
  
  root :to => "people#index"

  resources :people, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
      get :merge_assoc
      get :event_filter
      get :group_filter
    end

    member do
      get :iam_lookup
    end
  end
  
  resources :users, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end
end
