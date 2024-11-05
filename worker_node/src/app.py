from flask import Flask
from os import environ
import requests
from threading import Thread
from time import sleep


import logging


#like a heart beat
def tell_driver(my_addr:str):

    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)

    print("Telling driver to start working...", flush=True)
    while True:
        try:
             requests.post('http://driver-service:5000/workers/register', json={
                "address": my_addr
            })
        except requests.exceptions.RequestException as e:
            print(f"Failed to tell driver: {e}", flush=True)
            
        sleep(2)


if __name__ == '__main__':
    app = Flask(__name__)


    @app.get('/')
    def hello():
        return 'Hello from worker node!'

    Thread(target=tell_driver, args=(environ['ADDR'],), daemon=True).start()
    app.run(host='0.0.0.0', debug=True, port=5001)
    print(f"Worker #{environ['NAME']} is running")

