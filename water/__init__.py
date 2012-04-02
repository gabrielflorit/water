import os
from flask import Flask

app = Flask(__name__)

from util.gzipmiddleware import GzipMiddleware
app.wsgi_app = GzipMiddleware(app.wsgi_app, compresslevel=5)

import water.views

app.secret_key = os.getenv('SECRET_KEY')