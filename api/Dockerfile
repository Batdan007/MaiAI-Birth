# Mai-AI API - Public SaaS Backend
# Clean wrapper - no proprietary code

FROM python:3.11-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m maiai && chown -R maiai:maiai /app
USER maiai

# Expose port (Railway uses dynamic PORT)
EXPOSE 8000

# Run application (Railway overrides with $PORT)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
