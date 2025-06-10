from authlib.integrations.starlette_client import OAuth
from fastapi import Request
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware

import os

# Set config from environment or replit secrets
config = Config(environ=os.environ)
oauth = OAuth(config)

oauth.register(
    name='github',
    client_id=os.environ['GITHUB_CLIENT_ID'],
    client_secret=os.environ['GITHUB_CLIENT_SECRET'],
    authorize_url='https://github.com/login/oauth/authorize',
    access_token_url='https://github.com/login/oauth/access_token',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)
