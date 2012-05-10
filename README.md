# water

**[water](http://gabrielflor.it/water)** is a live coding sketchpad. Code modifications are instantly displayed - no need to refresh your browser. Click on a number, adjust its value via the popup slider, and watch your work change on the fly!

100% totally based on Bret Victor's [Inventing on Principle](https://vimeo.com/36579366) talk, which is one of the best talks I've ever seen. If you watch only one talk this year, make sure it's this one.

The beautiful code editor, [Ace](http://ace.ajax.org/), is an open source project by Ajax.org.

### Setup

    git clone https://github.com/gabrielflorit/water.git

This app uses virtualenv. If you haven't done so, create one first:

    cd water
    virtualenv --no-site-packages .


Next, source the virtualenv:

    . bin/activate


Install dependencies with Pip:

    bin/pip install -r requirements.txt

### Environment Variables

[Create an app on GitHub](https://github.com/settings/applications/new).

* URL: http://localhost:5000/
* Callback URL: http://localhost:5000/github-logged-in

Next, create an .env file with the following three keys:

    CLIENT_ID=<your github app client id>
    CLIENT_SECRET=<your github app secret>
    SECRET_KEY=<a randomly generated key - see below>

To generate a random key, fire up the python console:
    
    >>> import os
    >>> os.urandom(24)
    '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'

### Run

Finally, start the app with [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html):

    foreman start

Hit http://127.0.0.1:5000 and start coding!
