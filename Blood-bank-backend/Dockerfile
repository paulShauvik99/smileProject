FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

RUN python manage.py migrate

CMD ["gunicorn", "--config", "gunicorn_config.py", "smile.wsgi:application"]

