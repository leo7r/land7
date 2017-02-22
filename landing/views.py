from django.shortcuts import render
from django.http import HttpResponse
from landing.models import *
import pdb
from django.views.decorators.csrf import csrf_exempt

def _7pics(request):

	return render( request , 'landing/7pics.html', {} )

def _7tips(request):

	return render( request , 'landing/7tips.html', {} )

def subscribe(request):

	if request.method == 'POST':

		name = request.POST['name']
		email = request.POST['email']
		source = request.POST['source']

		if not Contact.objects.filter( email = email , source = source ).exists():

			contact = Contact( name = name , email = email , source = source )
			contact.save()

		return HttpResponse('ok')

def thanks( request , source ):

	info = {
		'source': source,
	}

	return render( request , 'landing/thanks.html', info )
