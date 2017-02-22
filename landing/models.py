from __future__ import unicode_literals
from django.utils.encoding import python_2_unicode_compatible
from django.db import models

@python_2_unicode_compatible
class Contact(models.Model):

	def __str__(self):
		return '[%s] %s (%s)' % (self.datetime, self.name, self.email,)

	name = models.CharField(max_length=500)
	email = models.CharField(max_length=500)
	source = models.CharField(max_length=500)
	datetime = models.DateTimeField(auto_now=False, auto_now_add=True)