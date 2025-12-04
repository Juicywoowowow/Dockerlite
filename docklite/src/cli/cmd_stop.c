#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_stop(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite stop <container-id>\n");
        return 1;
    }
    
    return container_stop(argv[1]);
}
