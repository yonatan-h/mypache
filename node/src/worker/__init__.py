import requests
import logging
from flask import Flask
from time import sleep
from threading import Thread
from os import environ
from worker.routes.instruction import bp as instruction_bp

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


#like a heart beat
def tell_driver(my_addr:str):
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    driver_addr = environ['DRIVER_ADDR']

    print("Telling driver to start working...", flush=True)
    wait = 3
    while True:
        try:
             requests.post(f'{driver_addr}/workers/register', json={
                "address": my_addr
            })
        except requests.exceptions.RequestException as e:
            print(f"Failed to tell driver: {e}", flush=True)
            
        wait += 1
        sleep(wait)

def create_app():
    Thread(target=tell_driver, args=(environ['ADDR'],), daemon=True).start()

    app = Flask(__name__)
    app.register_blueprint(instruction_bp)
    print(f"Worker #{environ['NAME']} is running")
    return app



