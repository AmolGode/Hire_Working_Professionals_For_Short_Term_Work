from django.contrib import admin
from .models import UserModel

# Register your models here.


class UserModelAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email_id', 'contact_number', 'gender', 'is_email_id_verified']
    list_filter = ['gender', 'is_email_id_verified']
    search_fields = ['email_id', 'contact_number']
    ordering = ['first_name']


admin.site.register(UserModel, UserModelAdmin)
