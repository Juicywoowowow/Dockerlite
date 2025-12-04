#include "commands.h"
#include "core/container.h"
#include "core/proot_wrapper.h"
#include "utils/logger.h"

int cmd_exec(int argc, char **argv) {
    if (argc < 3) {
        printf("Usage: docklite exec <container-id> <command>\n");
        return 1;
    }
    
    Container container;
    if (container_get(argv[1], &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", argv[1]);
        return 1;
    }
    
    return proot_exec_in_container(&container, argv[2]);
}
