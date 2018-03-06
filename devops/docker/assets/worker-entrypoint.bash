#! /bin/bash

export C_FORCE_ROOT=1
source /docker-entrypoint/worker-parse.bash

if [ "$help_flag" '!=' '0' ] ; then
    exec girder-worker --help 2>&1
fi

if [ -n "$CELERY_BROKER" ] ; then
    girder-worker-config set celery broker "$CELERY_BROKER"
    broker="${CELERY_BROKER/*\/\/}"

    user="${broker/@*}"
    host="${broker/*@}"

    if [ -n "$user" ] ; then
        cat /worker/girder_worker/worker.local.cfg | \
            sed "s|rabbitmq_user *= *.*|rabbitmq_user = $user|g" > \
            /tmp/worker.local.cfg
        cp /tmp/worker.local.cfg /worker/girder_worker
    fi

    if [ -n "$host" ] ; then
        cat /worker/girder_worker/worker.local.cfg | \
            sed "s|rabbitmq_host *= *.*|rabbitmq_host = $host|g" > \
            /tmp/worker.local.cfg
        cp /tmp/worker.local.cfg /worker/girder_worker
    fi
fi

if [ -n "$WORKER_PLUGINS" ] ; then
    girder-worker-config set girder_worker plugins_enabled "$WORKER_PLUGINS"
fi

if [ -n "$GIRDER_HOST_NAME" ] ; then
    girder-worker-config set minerva girder_host_name "$GIRDER_HOST_NAME"
fi

if [ -n "$GIRDER_HOST_PORT" ] ; then
    girder-worker-config set minerva girder_host_port "$GIRDER_HOST_PORT"
fi

if [ -n "$GIRDER_HOST_SCHEME" ] ; then
    girder-worker-config set minerva girder_host_scheme "$GIRDER_HOST_SCHEME"
fi

if [ -n "$DOCKER_HOST_NAME" ] ; then
    if [ -z "$DOCKER_HOST_PORT"   ] ; then DOCKER_HOST_PORT="2375"  ; fi
    if [ -z "$DOCKER_HOST_SCHEME" ] ; then DOCKER_HOST_SCHEME="tcp" ; fi

    s="$DOCKER_HOST_SCHEME"
    h="$DOCKER_HOST_NAME"
    p="$DOCKER_HOST_PORT"

    export DOCKER_HOST="${s}://${h}:${p}"
fi

if [ -z "$LOCAL_DOCKER_BUILDS" ] ; then
    LOCAL_DOCKER_BUILDS="/local_docker_builds"
fi

exclude_images="mongo,girder,rabbitmq"
if [ -n "$USER_EXCLUDE_IMAGES" ] ; then
    exclude_images="$exclude_images,$USER_EXCLUDE_IMAGES"
fi

echo "WAITING FOR DOCKER DAEMON..."
until docker version &> /dev/null ; do
    sleep 5
done
echo "DONE"

if [ -d "$LOCAL_DOCKER_BUILDS" ] ; then
    tmp="$( mktemp -d )"
    mkfifo "$tmp/fifo"
    exec 3<>"$tmp/fifo"
    unlink "$tmp/fifo"
    rm -r "$tmp"

    find "$LOCAL_DOCKER_BUILDS" -iname 'Dockerfile' -exec dirname '{}' ';' >&3 &
    while read -t 1 -u 3 entry ; do
        bn="$( basename "$entry" )"

        echo "BUILDING LOCAL DOCKERFILE: $entry"
        if docker build -t "${bn}_local" "$entry" ; then
            echo "DONE"
            exclude_images="$exclude_images,${bn}_local"
        else
            echo "DOCKERFILE BUILD FAILED"
        fi
    done

    exclude_images="$(
        echo "${exclude_images//,/$'\n'}" | sort -u | sed '2,$s/^/,/g' )"
    exclude_images="${exclude_images//$'\n'}"

    exec 3<&-
fi

girder-worker-config set docker exclude_images "$exclude_images"

exec girder-worker "${passthrough_args[@]}" 2>&1
