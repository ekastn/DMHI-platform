FROM node:20-alpine AS asset

WORKDIR /app

COPY package*.json .
RUN npm install

COPY ./assets ./assets
COPY ./vite.config.ts .
COPY ./tsconfig.json .
COPY ./tailwind.config.js .
COPY ./postcss.config.js .

RUN npm run assets:build


# ==============================================
FROM python:3.11-slim AS final

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY ./public ./public
COPY ./config.py .
COPY ./run.py .

COPY --from=asset /app/build ./build

ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV APP_SETTING=config.ProductionConfig

EXPOSE 80

CMD ["flask", "run", "--port", "80"]
