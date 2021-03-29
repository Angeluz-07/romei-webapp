FROM nikolaik/python-nodejs:python3.9-nodejs15-slim

WORKDIR /usr/src/app
COPY rms/requirements.txt .
RUN pip3 install -r requirements.txt
COPY rms/ .

COPY daily_register/package*.json .
RUN npm install
COPY daily_register/ .
RUN npm run build

CMD python romei/manage.py collectstatic --noinput; python romei/manage.py runserver 0.0.0.0:8000
