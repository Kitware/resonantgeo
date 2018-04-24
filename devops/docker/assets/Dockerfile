FROM ubuntu:16.04
MAINTAINER Kitware, Inc. <kitware@kitware.com>

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update                                         \
 && apt-get install -qy                                    \
        software-properties-common                         \
        python-software-properties                         \
 && apt-get update                                         \
 && add-apt-repository ppa:ubuntugis/ppa                   \
 && apt-get install -qy curl                               \
 && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
 && apt-get update                                         \
 && apt-get install -qy                                    \
        build-essential                                    \
        docker.io                                          \
        git                                                \
        libcairo-dev                                       \
        libcurl4-openssl-dev                               \
        libffi-dev                                         \
        libjpeg-dev                                        \
        libjpeg8-dev                                       \
        libldap2-dev                                       \
        libpython-dev                                      \
        libsasl2-dev                                       \
        libssl-dev                                         \
        libxml2-dev                                        \
        libxslt1-dev                                       \
        nodejs                                             \
        openssl                                            \
        python                                             \
        python-pip                                         \
        python-tk                                          \
        wget                                               \
        zlib1g-dev                                         \
 && apt-get build-dep -qy                                  \
        gdal                                               \
 && pip install -U 'pip<10'                                \
 && pip install setuptools                                 \
 && apt-get clean                                          \
 && rm -rf /var/lib/apt/lists/*

ARG MAKE_PARALLELISM

RUN mkdir /tmp/gdal                                                     \
 && curl -s -o - http://download.osgeo.org/gdal/2.2.3/gdal-2.2.3.tar.gz \
 |  tar -xzf - -C /tmp/gdal --strip-components 1                        \
 && cd /tmp/gdal                                                        \
 && ./configure --prefix=/usr                                           \
 && make $MAKE_PARALLELISM                                              \
 && make install                                                        \
 && cd /                                                                \
 && rm -rf /tmp/gdal

ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV C_FORCE_ROOT=1

RUN pip install GDAL==$(gdal-config --version)

COPY submodules/girder_worker /worker

# Here we have to pin girder-worker-utils because it installs
# setuptools_scm which isn't compatible with installing packages
# from a bare directory (not in a git repo).
RUN pip install -e /worker girder-worker-utils==0.7.1 \
 && pip install -e /worker[girder_io,docker]

RUN sh -c 'SET="girder-worker-config set"                        \
 && $SET celery        broker             "amqp://guest@broker"  \
 && $SET girder_worker plugins_enabled     docker,girder_io      \
 && $SET docker        gc                  False                 \
 && $SET docker        exclude_images      mongo,girder,rabbitmq \
 && $SET minerva       girder_host_name    web                   \
 && $SET minerva       girder_host_port    8080                  \
 && $SET minerva       girder_host_scheme  http'

RUN mkdir -p /girder-components/plugins

ADD submodules/girder /girder

RUN cd /girder                                                 \
 && pip install -e /girder[plugins]                            \
 && pip install -r /girder/requirements-dev.txt                \
 && pip install -e /girder/clients/python                      \
 && pip install ansible                                        \
 && ansible-galaxy install -p /etc/ansible/roles girder.girder

RUN cd /girder                             \
 && npm install -g grunt-cli               \
 && npm install --production --unsafe-perm

ADD submodules/gaia /girder/gaia
ADD submodules/minerva /girder-components/plugins/minerva

ADD submodules/database_assetstore \
    /girder-components/plugins/database_assetstore

ADD submodules/large_image \
    /girder-components/plugins/large_image

RUN girder-install plugin -f /girder-components/plugins/database_assetstore
RUN girder-install plugin -f /girder-components/plugins/large_image
RUN girder-install plugin -f /girder-components/plugins/minerva

RUN pip install -e /girder/gaia                       \
 && pip install -r /girder/gaia/requirements.txt      \
 && pip install -e /girder-components/plugins/minerva

RUN cd /girder-components/plugins/large_image          \
 && python setup.py install || python setup.py install \
 && pip install -e /girder-components/plugins/large_image[mapnik]

RUN girder-install web --dev --plugins \
autojoin,\
database_assetstore,\
large_image,\
minerva

RUN mkdir /docker-entrypoint

COPY devops/docker/assets/web-entrypoint.bash \
     /docker-entrypoint/web.bash

COPY devops/docker/assets/provision-entrypoint.bash \
     /docker-entrypoint/provision.bash

COPY devops/docker/assets/provision-entrypoint-parser.bash \
     /docker-entrypoint/provision-parse.bash

COPY devops/docker/assets/worker-entrypoint.bash \
     /docker-entrypoint/worker.bash

COPY devops/docker/assets/worker-entrypoint-parser.bash \
     /docker-entrypoint/worker-parse.bash

COPY devops/docker/assets/provision.yml /provision.yml
COPY devops/docker/assets/provision-inventory /etc/ansible/hosts
ENV ANSIBLE_LIBRARY=/etc/ansible/roles/girder.girder/library

EXPOSE 8080

ENTRYPOINT ["bash", "/docker-entrypoint/web.bash"]
CMD []
