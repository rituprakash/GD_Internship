
from django.urls import path
from . import views


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('resend_otp/', views.resend_otp, name='resend_otp'),
    path('login/', views.login, name='login'),
    path('edit_task/<int:pk>/', views.edit_task, name='edit_task'), 
    path('each_id_task_list/<int:pk>/', views.get_each_task_details, name='each_id_task_list'),
    path('add_task/', views.add_task, name='add_task'),
    path('task_list/', views.tasks_list, name='task_list'),
    path('delete_task/<int:pk>/', views.delete_task, name='delete_task'), 
    path('logout/', views.logout_view, name='logout_view'), 

]




