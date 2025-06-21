# STAGE 1
FROM ghcr.io/tu-graz-library/docker-invenio-base:main-builder AS builder

COPY pyproject.toml LICENSE README.md ./

RUN uv sync

ENV INVENIO_WEBPACKEXT_PROJECT="invenio_assets.webpack:rspack_project"

RUN invenio collect --verbose
RUN invenio webpack create

COPY ./app_data/ ${INVENIO_INSTANCE_PATH}/app_data/
COPY ./assets/ ${INVENIO_INSTANCE_PATH}/assets/
COPY ./static/ ${INVENIO_INSTANCE_PATH}/static/
COPY ./translations ${INVENIO_INSTANCE_PATH}/translations/
COPY ./templates ${INVENIO_INSTANCE_PATH}/templates/


WORKDIR ${INVENIO_INSTANCE_PATH}/assets
RUN pnpm install
RUN pnpm run build

# STAGE 2
FROM ghcr.io/tu-graz-library/docker-invenio-base:main-frontend AS frontend

COPY --from=builder ${VIRTUAL_ENV}/lib ${VIRTUAL_ENV}/lib
COPY --from=builder ${VIRTUAL_ENV}/bin ${VIRTUAL_ENV}/bin
COPY --from=builder ${INVENIO_INSTANCE_PATH}/app_data ${INVENIO_INSTANCE_PATH}/app_data
COPY --from=builder ${INVENIO_INSTANCE_PATH}/static ${INVENIO_INSTANCE_PATH}/static
COPY --from=builder ${INVENIO_INSTANCE_PATH}/translations ${INVENIO_INSTANCE_PATH}/translations
COPY --from=builder ${INVENIO_INSTANCE_PATH}/templates ${INVENIO_INSTANCE_PATH}/templates

WORKDIR ${WORKING_DIR}/src

COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}
COPY ./invenio.cfg ${INVENIO_INSTANCE_PATH}
RUN chown invenio:invenio .

USER invenio

ENTRYPOINT [ "bash", "-c"]
