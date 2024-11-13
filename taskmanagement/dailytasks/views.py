
# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate
from datetime import timedelta
from django.conf import settings
from .forms import taskForm
from .models import ToDoTask
from .serializers import TaskSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .forms import CustomUserCreationForm 
from django.contrib.auth import authenticate

from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView

from django.core.mail import send_mail
from django.urls import reverse
from .forms import CustomUserCreationForm
from .models import CustomUser  

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import CustomUser

import random
from datetime import datetime, timedelta
from django.utils import timezone
from .models import CustomUser 

import random
from django.core.mail import send_mail



# #SIGNUP

def generate_otp():
    return str(random.randint(100000, 999999))

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    # Initialize the form with request data
    form = CustomUserCreationForm(data=request.data)

    
    if form.is_valid():
        user = form.save()  # Create user instance
        otp = generate_otp() 
        otp_expiry = timezone.now() + timedelta(minutes=1) 

        # Saving OTP and expiry time to the user instance
        user.otp = otp
        user.otp_expiry = otp_expiry
        user.is_active = False  # User is inactive until OTP verification
        user.save()  # Save user with OTP details

        # Send OTP via email
        send_mail(
            'Verify your email',
            f'Your OTP for email verification is: {otp}',
            'from@example.com',  
            [user.email],  # Recipient 
            fail_silently=False,  
        )

        
        return Response({
            "message": "Account created successfully. Please check your email to verify your account.",
            "uid": user.id,
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)



#LOGIN
@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    remember_me = request.data.get("remember_me")

    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=status.HTTP_404_NOT_FOUND)

    # Set token lifetime based on "Remember Me"
    if remember_me:
        # Longer expiration if "Remember Me" is checked
        access_token_lifetime = timedelta(days=7)
        refresh_token_lifetime = timedelta(days=30)
    else:
        # Default expiration for normal sessions
        access_token_lifetime = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
        refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

    # Generate JWT tokens with above lifetime values
    refresh = RefreshToken.for_user(user)
    refresh.set_exp(lifetime=refresh_token_lifetime)
    access = refresh.access_token
    access.set_exp(lifetime=access_token_lifetime)

    email = user.email if user.email else "Email not provided"

    return Response({
        'message': 'Login successful',
        'refresh': str(refresh),
        'access': str(access),
        'email': email,
        'username' :username,
    }, status=status.HTTP_200_OK)


# Add task
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    
    task_data = request.data.copy()  
    task_data['user'] = request.user.id 
    print("Task Data:", task_data)  
    serializer = TaskSerializer(data=task_data)  
    if serializer.is_valid():
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Read or list Tasks
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tasks_list(request):
    tasks = ToDoTask.objects.filter(user=request.user)  # Filter tasks by logged-in user
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


#task details of each id
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_each_task_details(request, pk):
    task = get_object_or_404(ToDoTask, pk=pk)
    serializer = TaskSerializer(task)
    return Response(serializer.data)


# Edit tasks
@api_view(['PUT'])
@permission_classes([IsAuthenticated,])
def edit_task(request, pk):
    task = get_object_or_404(ToDoTask, pk=pk)
    form = taskForm(request.data, instance=task)  # Bind the form with the existing instance
    if form.is_valid():
        form.save()  
        serializer = TaskSerializer(task) 
        return Response(serializer.data) 
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST) 


# Delete a task
@api_view(['DELETE'])
@permission_classes([IsAuthenticated,])
def delete_task(request, pk):
    task = get_object_or_404(ToDoTask, pk=pk)  
    task.delete() 
    return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT) 


#Logout
#@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})


# To verify the OTP entered by the user
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    user_id = request.data.get('user_id')
    otp = request.data.get('otp')

    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Check if OTP is valid and not expired
    if user.otp == otp:
        if timezone.now() < user.otp_expiry:
            user.is_active = True
            user.save()
            return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

   

# For otp regeneration
@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    user_id = request.data.get('user_id')

    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Generate new OTP
    new_otp = generate_otp()
    new_otp_expiry = timezone.now() + timedelta(minutes=1)

    # Update user OTP details
    user.otp = new_otp
    user.otp_expiry = new_otp_expiry
    user.save()

    # Send new OTP via email
    send_mail(
        'Verify your email',
        f'Your new OTP for email verification is: {new_otp}',
        'from@example.com',
        [user.email],
        fail_silently=False,
    )

    return Response({"message": "New OTP sent to your email."}, status=status.HTTP_200_OK)
