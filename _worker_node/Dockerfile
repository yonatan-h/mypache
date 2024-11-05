FROM python:3.14.0a1-slim-bullseye
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

EXPOSE 5001
CMD [ "python", "src/app.py"]