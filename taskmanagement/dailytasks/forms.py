from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from .models import ToDoTask

User = get_user_model()  # For custom user model

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)  
    mobile_number = forms.CharField(max_length=15, required=False)  

    class Meta:
        model = User  # custom user model
        fields = ('username', 'email', 'mobile_number', 'password1', 'password2')

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        user.mobile_number = self.cleaned_data.get("mobile_number") 
        if commit:
            user.save()
        return user


class taskForm(forms.ModelForm):  
    class Meta:
        model = ToDoTask
        fields = ['task_name', 'description', 'deadline', 'status']
