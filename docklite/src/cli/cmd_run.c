#include "commands.h"
#include "core/container.h"
#include "core/config_parser.h"
#include "utils/logger.h"

int cmd_run(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite run <config.docklite>\n");
        return 1;
    }
    
    ContainerConfig config;
    if (parse_docklite_config(argv[1], &config) != 0) {
        return 1;
    }
    
    Container container;
    if (container_create(&config, &container) != 0) {
        return 1;
    }
    
    printf("Container created: %s\n", container.id);
    
    if (container_start(container.id) != 0) {
        return 1;
    }
    
    printf("Container started: %s\n", container.id);
    free_container_config(&config);
    
    return 0;
}
