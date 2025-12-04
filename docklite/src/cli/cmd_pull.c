#include "commands.h"
#include "utils/logger.h"

int cmd_pull(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite pull <image>\n");
        return 1;
    }
    
    log_message(LOG_INFO, "Pulling image: %s", argv[1]);
    printf("Image pull not yet implemented\n");
    return 0;
}
