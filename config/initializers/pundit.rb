# This line forces rails to load the application_policy.rb file which includes stub definitions for the policies for all other models except User.
# Otherwise controllers will throw a NotDefinedError
Pundit::ApplicationPolicy
