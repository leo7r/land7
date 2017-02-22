from django.conf.urls import url, include
from django.contrib import admin

from . import views

urlpatterns = [
	url(r'^subscribe$', views.subscribe, name='subscribe'),
	url(r'^thanks/(?P<source>[a-zA-Z0-9]+)$', views.thanks, name='thanks'),
	url(r'^7pics$', views._7pics, name='7pics'),
	url(r'^7tips$', views._7tips, name='7tips'),
]
