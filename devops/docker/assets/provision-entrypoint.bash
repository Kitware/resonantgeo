#! /bin/bash

source /docker-entrypoint/provision-parse.bash

if [ "$help_flag" '!=' '0' ] ; then
    exec ansible-playbook --help 2>&1
fi

bad_args() {
    code=1
    while [ -n "$*" ] ; do
        var="$1" ; shift
        switch="$1" ; shift
        if [ -z "$switch" ] ; then
            continue
        fi

        if [ -z "${!var}" ] ; then
            echo "Missing required argument: --${switch}"
            code=0
        fi
    done

    return $code
}

if bad_args CELERY_BROKER      broker        \
            GIRDER_PLUGINS     plugins       \
            MONGODB_URL        database      \
            ADMIN_NAME         admin-name    \
            ADMIN_PASS         admin-pass    \
            USER_NAME          user-name     \
            USER_PASS          user-pass     \
            ASSETSTORE_PATH    assetstore    \
            GIRDER_HOST_NAME   girder-host   \
            GIRDER_HOST_PORT   girder-port   \
            GIRDER_HOST_SCHEME girder-scheme
then
    exit 1
fi

vars="ghost=$GIRDER_HOST_NAME"
vars="$vars gport=$GIRDER_HOST_PORT"
vars="$vars gscheme=$GIRDER_HOST_SCHEME"
vars="$vars admin_name=$ADMIN_NAME"
vars="$vars admin_pass=$ADMIN_PASS"
vars="$vars user_name=$USER_NAME"
vars="$vars user_pass=$USER_PASS"
vars="$vars assetstore=$ASSETSTORE_PATH"
vars="$vars broker=$CELERY_BROKER"

export ANSIBLE_LIBRARY=/etc/ansible/roles/girder.girder/library

echo "RUNNING PROVISION"
ansible-playbook -v --extra-vars "$vars" "${passthrough_args[@]}" /provision.yml

cat /girder/girder/conf/girder.local.cfg | \
    sed "s|uri *= *\"mongodb.*|uri = \"$MONGODB_URL\"|g" > /tmp/girder.local.cfg

mv /tmp/girder.local.cfg /girder/girder/conf

girder-install web --dev
exec echo "PROVISION COMPLETE"

