FROM python:3.13-slim-trixie

COPY --from=ghcr.io/astral-sh/uv:0.9.6 /uv /uvx /bin/

WORKDIR /code

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen

COPY app /code/app

ENV PYTHONPATH=/code:/code/app

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]

