#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_rm(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite rm <container-id>\n");
        return 1;
    }
    
    return container_remove(argv[1]);
}
