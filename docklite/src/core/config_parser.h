#ifndef CONFIG_PARSER_H
#define CONFIG_PARSER_H

#include "utils/common.h"

int parse_docklite_config(const char *filepath, ContainerConfig *config);
void free_container_config(ContainerConfig *config);

#endif
