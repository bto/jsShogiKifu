DIST_DIR = dist
SRC_DIR = src

SOURCES = ${SRC_DIR}/core.js \
	${SRC_DIR}/csa.js \
	${SRC_DIR}/kif.js \
	${SRC_DIR}/move.js \
	${SRC_DIR}/suite.js

TARGET = ${DIST_DIR}/kifu.js


${TARGET}: ${DIST_DIR} ${SOURCES}
	rm -f $@
	cat ${SOURCES} > $@

${DIST_DIR}:
	mkdir -p $@

clean:
	rm -rf ${DIST_DIR}
