from django.db import models
from user_api.models import UserModel

# Create your models here.
class MessageModel(models.Model):
    message = models.CharField(max_length=2000)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    msg_is_read = models.BooleanField(default=False)
    msg_from = models.ForeignKey(UserModel,on_delete=models.CASCADE,related_name='msg_from')
    msg_to = models.ForeignKey(UserModel,on_delete=models.CASCADE,related_name='msg_to')
    
    class Meta:
        db_table = 'messages'