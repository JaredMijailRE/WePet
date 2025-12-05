FROM python:3.13-slim-trixie

COPY --from=ghcr.io/astral-sh/uv:0.9.6 /uv /uvx /bin/

WORKDIR /code

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen

COPY app /code/app

COPY entrypoint.sh /code/entrypoint.sh
RUN chmod +x /code/entrypoint.sh

ENTRYPOINT ["/code/entrypoint.sh"]