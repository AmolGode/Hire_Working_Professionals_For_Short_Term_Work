import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from server_data.PASSWORD_CREDENTIALS import SERVER_EMAIL_ID, SERVER_EMAIL_ID_PASSWORD


def send_mail(message, to):
    sender = SERVER_EMAIL_ID
    password = SERVER_EMAIL_ID_PASSWORD
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "About Working Professional Verification"
    msg['From'] = sender
    msg['To'] = to
    msg.attach(MIMEText(message,'html'))
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(sender, password)
    print('Connected to the smtp sever..!')
    server.sendmail(sender, to, msg.as_string())
    server.quit()
