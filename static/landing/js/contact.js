$(function() {
	'use strict';
	// Main contact form
    $('#contact').validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Your name must consist of at least 2 characters"
            },
            email: {
                required: "Please enter your email address"
            },
        },
        submitHandler: function(form) {
            
            var source = $(form).find(':input[name=source]').val();

            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"subscribe",
                success: function() {
                    location.href = 'thanks/'+source;
                },
                error: function() {
                    $('#contact').fadeTo( "slow", 0.15, function() {
                        $('#error').fadeIn();
                    });
                }
            });
        }
    });

});