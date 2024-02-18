import boto3
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

@api_view(['POST'])
def upload_file(request):
    file = request.FILES['file']
    filename = file.name

    if not file:
        return Response({'error': 'No file uploaded'}, status=400)
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_S3_REGION_NAME")
        )
        s3_client.upload_fileobj(file, os.getenv("AWS_STORAGE_BUCKET_NAME"), file.name)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    return Response({'message': 'File uploaded successfully'}, status=200)
