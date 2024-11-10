import requests
import logging
from flask import Flask
from time import sleep
from threading import Thread
from os import environ

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


#like a heart beat
def tell_driver(my_addr:str):

    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)

    print("Telling driver to start working...", flush=True)
    wait = 3
    while True:
        try:
             requests.post('http://driver-service:5000/workers/register', json={
                "address": my_addr
            })
        except requests.exceptions.RequestException as e:
            print(f"Failed to tell driver: {e}", flush=True)
            
        wait += 1
        sleep(wait)

def create_app():
    app = Flask(__name__)
    Thread(target=tell_driver, args=(environ['ADDR'],), daemon=True).start()
    print(f"Worker #{environ['NAME']} is running")
    return app



