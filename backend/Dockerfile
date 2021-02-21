# pull official base image
FROM python:3.9.0-slim-buster

# set working directory
WORKDIR /usr/src/app

# install dependencies
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt

# add app
COPY . .

# start app
CMD ["python", "romei/manage.py", "runserver", "0.0.0.0:8000"]