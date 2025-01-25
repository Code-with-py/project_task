from core.models import Product, Category, SubCategory
from rest_framework.viewsets import ModelViewSet
from core.serializer import ProductSerializer, CategorySerializer, SubCategorySerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from oauthlib.common import generate_token
import datetime
from oauth2_provider.models import AccessToken, Application
from oauth2_provider.settings import oauth2_settings
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from random import randint
from .models import OTP
from django.conf import settings

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
   

class SubCategoryViewSet(ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticated]

    

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=email, email=email, password=password)
            user.save()
            return Response({'message': 'Registration successful.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate OAuth2 token
        application = Application.objects.first()
        expires = datetime.datetime.now(
        ) + datetime.timedelta(seconds=oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS)
        token = AccessToken.objects.create(
            user=user,
            token=generate_token(),
            application=application,
            expires=expires,
            scope="read write"
        )
        return Response({"access_token": token.token, "expires_in": oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS})


class LogoutView(APIView):
    def post(self, request):
        token = request.auth
        if token:
            token.delete()
            return Response({"message": "Logged out successfully."})
        return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            otp = randint(100000, 999999)
            OTP.objects.create(user=user, otp=otp)
            send_mail(
                'Your OTP Code',
                f'Your OTP code is {otp}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
            otp_instance = OTP.objects.get(user=user, otp=otp)
            otp_instance.delete()  # OTP is valid, delete it
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({"error": "Invalid OTP or email"}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(email=email)
            otp_instance = OTP.objects.get(user=user, otp=otp)
            user.set_password(new_password)
            user.save()
            otp_instance.delete()  # OTP is used, delete it
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return Response({"error": "Invalid OTP or email"}, status=status.HTTP_400_BAD_REQUEST)
