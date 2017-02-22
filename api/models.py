from __future__ import unicode_literals
from django.utils.encoding import python_2_unicode_compatible
from django.db import models

@python_2_unicode_compatible
class Contact(models.Model):

	def __str__(self):
		return '[%s] %s' % (self.email, self.name, )

	name = models.CharField(max_length=500)
	email = models.CharField(max_length=500)
	source = models.CharField(max_length=500)
	created_datetime = models.DateTimeField(auto_now=False, auto_now_add=True)

@python_2_unicode_compatible
class Drip(models.Model):

	def __str__(self):
		return '%s' % (self.name, )

	name = models.CharField( max_length = 200 )
	source = models.CharField( max_length = 500 )
	subscribers = models.ManyToManyField( Contact , null = True , blank = True , related_name = 'subscribers' )
	unsubscribers = models.ManyToManyField( Contact , null = True , blank = True , related_name = 'unsubscribers' )

@python_2_unicode_compatible
class Email(models.Model):

	def __str__(self):
		return '[%s] %s' % (self.drip, self.subject, )

	drip = models.ForeignKey( Drip )
	subject = models.CharField( max_length = 300 )
	body = models.TextField()
	send_delay = models.IntegerField( max_length = 2 )

@python_2_unicode_compatible
class Analytic(models.Model):

	def __str__(self):
		return '[%s] %s - %s' % (self.action, self.contact.name, self.email.subject, )

	action = models.CharField( max_length = 100 )
	contact = models.ForeignKey( Contact )
	email = models.ForeignKey( Email )
	datetime = models.DateTimeField(auto_now=False, auto_now_add=True)