FROM python:3.11-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=main.py

# Run the application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]