FROM python:3.14.0a1-slim-bullseye
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY ./ /app
EXPOSE 5000
CMD [ "flask", "--app", "src/driver_app", "run", "--debug", "--host=0.0.0.0" ]