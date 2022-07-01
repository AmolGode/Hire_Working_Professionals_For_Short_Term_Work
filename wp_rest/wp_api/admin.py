from django.contrib import admin
from .models import *
from django.utils.html import format_html
from server_data.mail import send_mail
import threading

# Register your models here.


class BusinessAccountAdmin(admin.ModelAdmin):
    list_display = ['business_title', 'subscription_expiry_date', 'basic_info', 'profession_tags_list',
                    'service_areas_list', 'work_samples_list', 'verification_status', 'send_custom_mail']
    list_editable = ['verification_status']
    list_filter = ['verification_status', 'subscription_expiry_date']
    search_fields = ['business_title']
    ordering = ['business_title']
    list_per_page = 1

    def save_model(self, request, obj, form, change):  # overriding save method
        if change and obj.user.is_email_id_verified:
            to_email_id = obj.user.email_id
            message = f'''Your Working Professionals Business Account verification status is changed to <b>{obj.verification_status}</b> by the Administrator. '''
            thread = threading.Thread(target=send_mail, args=(message,to_email_id))
            thread.start()
        super().save_model(request, obj, form, change)

    def send_custom_mail(self, instance):
        user_email_id = instance.user.email_id
        html = f'''
                <html>
                    <body>
                        <head>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                        
                        <a class="btn btn-success" href="mailto:{user_email_id}?subject=About Working Professionals Business Account Verification&body=Things you need to fix in your account." 
                        style="color:white;">Send Mail</a> 
                        
                    </body> 
                </html> '''
        return format_html(html)

    def basic_info(self, instance):
        user = instance.user
        res = ''
        res = res + str(user.first_name) + ' ' + str(user.last_name) + ' | '
        res = res + str(user.email_id) + ' | ' + str(user.contact_number) + '<hr>'
        res = res + f'<img src="http://127.0.0.1:8000/media/{user.profile_pic}" style="max-width : 100%;"> <hr>'
        res = res + '<h3>Business Info</h3>'
        res = res + f'Description : {instance.business_description} <hr>'
        res = res + f'Status : {instance.status} <hr>'
        res = res + f'Note : {instance.note} <hr>'
        res = res + f'verification_status : {instance.verification_status} <hr>'
        res = res + f'subscription_expiry_date : {instance.subscription_expiry_date} <hr>'

        model = f'''
                <html>
                    <body>
                        <head>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

                                <!-- Modal -->
        <div class="modal fade" id="staticBackdrop-user-info-{instance.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">User Info</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                {res}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">All ok</button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-user-info-{instance.id}">
          User Info
        </button>

                    </body>
                </html>
                    '''
        return format_html(model)

    def profession_tags_list(self, instance):
        tags = instance.professiontagsmodel_set.all()

        res = ''
        i = 1
        for tag in tags:
            res = res + str(i) + '] ' + str(tag.tag_name) + '<hr>'
            i += 1

        model = f'''
        <html>
            <body>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                </head>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                
                        <!-- Modal -->
<div class="modal fade" id="staticBackdrop-{instance.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Tags</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {res}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">All ok</button>
      </div>
    </div>
  </div>
</div>

<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-{instance.id}">
  Tags
</button>
            
            </body>
        </html>
            '''
        return format_html(model)

    def service_areas_list(self, instance):
        service_areas = instance.serviceareasmodel_set.all()
        res = ''
        i = 1
        for service_area in service_areas:
            res = res + str(i) + '] ' + str(service_area.city_name) + '<hr>'
            i += 1

        model = f'''
            <html>
                <body>
                    <head>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    </head>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

                            <!-- Modal -->
    <div class="modal fade" id="staticBackdrop-service-areas-{instance.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Service Areas</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {res}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">All ok</button>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-service-areas-{instance.id}">
      Service Areas
    </button>

                </body>
            </html>
                '''
        return format_html(model)

    def work_samples_list(self, instance):
        work_samples = instance.worksamplesmodel_set.all()

        res = ''
        i = 1
        for ws in work_samples:
            if ws.is_business_card_image:
                res = res + '<h6>**This is Business Card Image**</h6>'
            res = res + f'{i}] <img src="http://127.0.0.1:8000/media/{ws.work_sample_image}" style="height: 380px;width:100%;">'
            res = res + '<h3>Description</h3>'
            res = res + f'Description : {ws.work_sample_description} <br><br><hr><br><br>'
            i += 1

        model = f'''
                <html>
                    <body>
                        <head>
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

                                <!-- Modal -->
        <div class="modal fade" id="staticBackdrop-work-samples-{instance.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">Work Samples</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                {res}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">All ok</button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-work-samples-{instance.id}">
          Work Samples
        </button>

                    </body>
                </html>
                    '''
        return format_html(model)


admin.site.register(BusinessAccountModel, BusinessAccountAdmin)
