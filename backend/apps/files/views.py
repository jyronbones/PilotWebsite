import boto3
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

s3 = boto3.client(
  's3',
  aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
  aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
  region_name=os.getenv('AWS_S3_REGION_NAME')
)

bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")

@api_view(['POST'])
def upload_file(request):
  file = request.FILES['file']
  filename = file.name
  category = request.POST.get('category')

  if not file:
    return Response({'error': 'No file uploaded'}, status=400)

  if not filename.lower().endswith('.pdf'):
    return Response({'error': 'Invalid file format. Must be a PDF file'}, status=400)

  try:
    s3.upload_fileobj(file, bucket_name, file.name, ExtraArgs={'Metadata': {'category': category}})
  except Exception as e:
    return Response({'error': str(e)}, status=500)

  return Response({'message': 'File uploaded successfully'}, status=200)

@api_view(['GET'])
def list_files(request):
  try:
    response = s3.list_objects_v2(Bucket=bucket_name)
    files = []
    for obj in response.get('Contents', []):
      filename = obj['Key']
      file_type = 'pdf' if filename.endswith('.pdf') else 'Unknown'
      metadata_response = s3.head_object(Bucket=bucket_name, Key=filename)
      category = metadata_response.get('Metadata', {}).get('category', 'Unknown')
      files.append({
        'filename': filename,
        'dateAdded': obj['LastModified'].strftime('%Y-%m-%d'),
        'category': category
      })

    return Response({'files': files})
  except Exception as e:
    return Response({'error': 'Failed to retrieve files'}, status=500)

  return Response({'message': 'File retrieved successfully'}, status=200)

  