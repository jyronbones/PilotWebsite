from django.http import JsonResponse

class CustomErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        error_statuses = {401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 500: 'Server Error'}

        if response.status_code in error_statuses:
            error_data = {
                'error': {
                    'code': response.status_code,
                    'message': error_statuses[response.status_code]
                }
            }
            return JsonResponse(error_data, status=response.status_code)

        return response
