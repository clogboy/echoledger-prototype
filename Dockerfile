# Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port and run the app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
