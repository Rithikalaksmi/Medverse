# Build stage
FROM python:3.11-slim AS builder
WORKDIR /app

# Install dependencies into local user directory
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
WORKDIR /app

# Copy the dependencies from builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Ensure the local bin is on PATH
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000

# Run the application
CMD ["python", "run.py"]
