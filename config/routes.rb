Rails.application.routes.draw do
  resources :person_groups, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
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
    end
  end
  
  resources :users, only: [:index, :create, :update, :destroy] do
    collection do
      get :search
    end
  end
end
