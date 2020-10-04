FROM coorpacademy/docker-pyspark:latest

# installs pyspark to be used in python
RUN pip3 install pyspark

# solves "key not found: _PYSPARK_DRIVER_CALLBACK_HOST/Java Gateway/PySpark 2.3.1" error
RUN export PYTHONPATH=$SPARK_HOME/python/:$PYTHONPATH
RUN export PYTHONPATH=$SPARK_HOME/python/lib/py4j-0.8.2.1-src.zip:$PYTHONPATH

RUN mkdir /usr/dev/tweets-api
# COPY . /usr/dev/tweets-api

CMD ["bin/spark-class", "org.apache.spark.deploy.master.Master"]