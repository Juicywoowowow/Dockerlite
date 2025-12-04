#include "commands.h"
#include "core/container.h"
#include "core/proot_wrapper.h"
#include "utils/logger.h"

int cmd_enter(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite enter <container-id>\n");
        return 1;
    }
    
    Container container;
    if (container_get(argv[1], &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", argv[1]);
        return 1;
    }
    
    return proot_enter_shell(&container);
}
