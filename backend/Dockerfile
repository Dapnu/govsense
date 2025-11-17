FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 9000

# Use a different port (9000) to avoid conflicts on the host
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]
