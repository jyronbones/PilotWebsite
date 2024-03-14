# Pilot Website

The Pilot Website is a modern web application designed to provide a seamless user experience. It's built using Django for the backend and React for the frontend, with AWS DynamoDB as the database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.12
- Node.js and npm
- AWS CLI configured with proper access rights

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

## Local Deployment

#### Backend Setup

1. Clone the repository to your local machine

2. Navigate to the `backend` directory

```
cd backend
```

3. Create a virtual environment

```
python -m venv venv
```

4. Activate the virtual environment

- On Windows:
  ```
  .\venv\Scripts\activate
  ```
- On MacOS/Linux:
  ```
  source venv/bin/activate
  ```

5. Install the required dependencies

```
pip install -r requirements.txt
```

6. Set up the DynamoDB tables

```
python dynamodb_migrator.py
```

7. Start the Django development server on port 8080 (for local)

```
python manage.py runserver 8080
```

#### Using DynamoDB Locally with Docker

For local development and testing, you can use a DynamoDB local instance provided by Amazon that can be run as a Docker container. This approach doesn't require manual download of any Docker image files. Follow these steps after installing Docker:

1. Open Docker and search for the `amazon/dynamodb-local` image in the Docker Hub search bar.

2. Download (or simply run) the `amazon/dynamodb-local` image.

#### Frontend Setup

1. Navigate to the `frontend/pilot-website` directory

```
cd frontend/pilot-website
```

2. Install the required npm packages

```
npm install
```

3. Start the frontend application

```
npm start
```

The React application will now be running on [http://localhost:3000](http://localhost:3000).

## Live Deployment

For deploying the Django backend using Zappa:

1. Ensure AWS credentials are configured correctly in your environment or AWS CLI.

2. Navigate to the `backend` directory if not already there.

3. Activate the virtual environment as shown in the backend setup.

4. Initialize Zappa with `zappa init` to create a `zappa_settings.json` if not present.

5. Modify `zappa_settings.json` as required for your AWS environment, ensuring the correct `aws_region`, `django_settings`, `profile_name`, `project_name`, `runtime`, and `s3_bucket` are set.

```json
{
  "dev": {
    "aws_region": "us-east-1",
    "django_settings": "PilotWebsite.settings",
    "profile_name": "default",
    "project_name": "backend",
    "runtime": "python3.12",
    "s3_bucket": "zappa-c1dvks3gm"
  }
}
```

1. Deploy your application to AWS Lambda with Zappa

```
zappa deploy dev
```

2. Update your application as needed\

```
zappa update dev
```

Refer to the official [Zappa documentation](https://github.com/zappa/Zappa) for more advanced configurations and options.

## Configuration

### Backend

The `.env` file in the backend directory contains environment-specific settings and AWS DynamoDB service credentials:

```
DB_TABLE=users
DB_ENDPOINT=http://localhost:8000
DB_REGION_NAME=us-east-1
DB_AWS_ACCESS_KEY_ID=your_access_key_id
DB_AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

nsure these values are set according to your AWS DynamoDB configuration. Replace `your_access_key_id` and `your_secret_access_key` with your actual AWS credentials.

### Frontend

The frontend `.env` file should contain the backend API URL. Adjust it according to the environment the frontend is running in:

- For local development, use:

```
REACT_APP_API_URL="http://127.0.0.1:8000/api/v1"
```

For production, set it to your deployed backend API:

```
REACT_APP_API_URL="https://gkpxsmym2h.execute-api.us-east-1.amazonaws.com/dev/api/v1"
```

## Built With

Django - The web framework used for the backend.
React - The web library used for the frontend
DynamoDB - NoSQL database service provided by Amazon Web Services
Zappa - Serverless Python web services

## Authors

Byron Jones - @jyronbones
Amy Fujimoto - @fuji0014
Ngoc Phuong Khanh - @le000222
Michael Garrison - @Garrison86

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
