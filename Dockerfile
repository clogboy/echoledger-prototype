# Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app/backend

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port and run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
