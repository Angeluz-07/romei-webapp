# daily-register vue app build stage
FROM node:lts-alpine as daily-register-vue-build-stage
WORKDIR /app
COPY daily_register/package*.json ./
RUN npm install
COPY daily_register/ .
ENV NODE_ENV=production
RUN npm run build

# django app build stage
FROM python:3.9
WORKDIR /usr/src/app
COPY rms/requirements.txt .
RUN pip3 install -r requirements.txt
COPY rms/ .
COPY --from=daily-register-vue-build-stage /app/build ./romei/static/daily_register_vue/build
CMD python romei/manage.py collectstatic --noinput; python romei/manage.py runserver 0.0.0.0:8000

