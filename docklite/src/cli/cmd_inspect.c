#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_inspect(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite inspect <container-id>\n");
        return 1;
    }
    
    Container container;
    if (container_get(argv[1], &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", argv[1]);
        return 1;
    }
    
    printf("ID:      %s\n", container.id);
    printf("Name:    %s\n", container.name);
    printf("Status:  %s\n", container.status);
    printf("PID:     %d\n", container.pid);
    printf("Image:   %s\n", container.config.image);
    printf("Command: %s\n", container.config.command);
    printf("Rootfs:  %s\n", container.rootfs);
    
    return 0;
}
