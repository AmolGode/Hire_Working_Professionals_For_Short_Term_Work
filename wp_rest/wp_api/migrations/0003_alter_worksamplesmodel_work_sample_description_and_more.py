# Generated by Django 4.0.4 on 2022-06-23 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wp_api', '0002_alter_professiontagsmodel_tag_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worksamplesmodel',
            name='work_sample_description',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='worksamplesmodel',
            name='work_sample_image',
            field=models.ImageField(blank=True, max_length=3000, null=True, upload_to='work_samples'),
        ),
    ]
