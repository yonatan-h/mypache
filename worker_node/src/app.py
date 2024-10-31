from flask import Flask
from os import environ
import requests

def tell_driver(my_addr:str):
    print("Telling driver to start working...", flush=True)
    try:
        res = requests.post('http://driver-service:5000/workers/register', json={
            "address": my_addr
        })
        data = res.text
        print(data, flush=True)
    except Exception as e:
        print(f"Error: {e}", flush=True)


if __name__ == '__main__':
    app = Flask(__name__)

    @app.get('/')
    def hello():
        return 'Hello from worker node!'

    tell_driver(environ['ADDR'])
    app.run(host='0.0.0.0', debug=True, port=5001)
    print(f"Worker #{environ['NAME']} is running")

