FROM coorpacademy/docker-pyspark:latest

# installs pyspark to be used in python
RUN pip3 install pyspark
RUN pip3 install flask

RUN mkdir -p /usr/dev/tweets-api

CMD ["/bin/bash", "/usr/dev/tweets-api/run-api"]