from django.contrib import admin
from landing.models import *

class ContactAdmin(admin.ModelAdmin):
	readonly_fields = ('datetime',)

admin.site.register(Contact,ContactAdmin)
#admin.site.register(Contact)
