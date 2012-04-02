# water

**<a href='http://water.gabrielflor.it'>water</a>** is a live coding sketchpad. Code modifications are instantly displayed - no need to refresh your browser. Click on a number, adjust its value via the popup slider, and watch your work change on the fly!

100% totally based on Bret Victor's <a href='https://vimeo.com/36579366'>Inventing on Principle</a> talk, which is one of the best talks I've ever seen. If you watch only one talk this year, make sure it's this one.

The beautiful code editor, <a href='http://ace.ajax.org/'>Ace</a>, is an open source project by Ajax.org.

### Setup

This app uses virtualenv. If you haven't done so, create one first:

    cd water
    virtualenv --no-site-packages .


Next, source the virtualenv:

    . bin/activate


Install dependencies with Pip:

    bin/pip install -r requirements.txt


And finally start the Flask server (this is perfectly fine for development):

    python runserver.py


Or the gunicorn server (what we use on production):

    gunicorn water:app -b "0.0.0.0:5000"


Then hit http://localhost:8888/water.html and start coding!