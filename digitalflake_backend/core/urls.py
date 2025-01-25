from core.views import RegisterView, LoginView, LogoutView, ForgotPasswordView, VerifyOTPView, ResetPasswordView
from django.urls import path
from .views import CategoryViewSet, SubCategoryViewSet, ProductViewSet
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# Set up router
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'products', ProductViewSet)

# Custom URLs
custom_urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/forgot-password/',
         ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]

urlpatterns = router.urls + custom_urlpatterns


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
