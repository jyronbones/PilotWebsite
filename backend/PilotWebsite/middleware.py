from django.http import HttpResponseRedirect

class CustomErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # List of error status codes to handle
        error_statuses = {401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 500: 'Server Error'}

        # Check if the response status code is in our list of errors
        if response.status_code in error_statuses:
            # Frontend error handling URL
            error_url = f'https://districtonepilots.ca/error?errorCode={response.status_code}&errorMessage={error_statuses[response.status_code]}'
            return HttpResponseRedirect(error_url)

        return response
