#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_start(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite start <container-id>\n");
        return 1;
    }
    
    return container_start(argv[1]);
}
