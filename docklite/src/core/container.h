#ifndef CONTAINER_H
#define CONTAINER_H

#include "utils/common.h"

int container_create(ContainerConfig *config, Container *container);
int container_start(const char *container_id);
int container_stop(const char *container_id);
int container_remove(const char *container_id);
int container_list(Container **containers, int *count, int all);
int container_get(const char *container_id, Container *container);
char* generate_container_id(void);

#endif
