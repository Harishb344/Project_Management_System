from django.http import JsonResponse
from .models import Organization

class OrganizationMiddleware:

    """
     Resolves organization from request headers
    """

    def __init__(self, get_response):
        self.get_response= get_response
    
    def __call__(self, request):
        org_slug= request.headers.get("X-ORG-SLUG")

        if not org_slug:
            request.organization= None

            return self.get_response(request)
        
        try:
            request.organization= Organization.objects.get(slug=org_slug)
        except Organization.DoesNotExist:
            return JsonResponse(
                {"error":"Invalid Organization"},
                status= 400
            )
        return self.get_response(request)