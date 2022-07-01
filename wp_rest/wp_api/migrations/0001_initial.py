# Generated by Django 4.0.4 on 2022-06-22 16:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessAccountModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_title', models.CharField(max_length=70)),
                ('business_description', models.CharField(max_length=500)),
                ('status', models.CharField(max_length=100)),
                ('note', models.CharField(max_length=200)),
                ('verification_status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Not Selected', 'Not Selected')], default='Pending', max_length=20)),
                ('subscription_expiry_date', models.DateField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='user_api.usermodel')),
            ],
            options={
                'db_table': 'wp_business_acc',
            },
        ),
        migrations.CreateModel(
            name='WorkSamplesModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('work_sample_image', models.ImageField(blank=True, null=True, upload_to='work_samples')),
                ('work_sample_description', models.CharField(max_length=1000)),
                ('is_business_card_image', models.BooleanField(default=False)),
                ('business_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wp_api.businessaccountmodel')),
            ],
            options={
                'db_table': 'work_samples',
            },
        ),
        migrations.CreateModel(
            name='ServiceAreasModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city_name', models.CharField(max_length=20)),
                ('business_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wp_api.businessaccountmodel')),
            ],
            options={
                'db_table': 'service_areas',
            },
        ),
        migrations.CreateModel(
            name='ProfessionTagsModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag_name', models.CharField(max_length=50)),
                ('business_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wp_api.businessaccountmodel')),
            ],
            options={
                'db_table': 'profession_tags',
            },
        ),
        migrations.CreateModel(
            name='FeedbackModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback_text', models.CharField(max_length=1000)),
                ('rating', models.IntegerField()),
                ('date', models.DateField(auto_now=True)),
                ('business_account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wp_api.businessaccountmodel')),
                ('feedback_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_api.usermodel')),
            ],
            options={
                'db_table': 'feedback',
            },
        ),
    ]
