#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_logs(int argc, char **argv) {
    if (argc < 2) {
        printf("Usage: docklite logs <container-id>\n");
        return 1;
    }
    
    Container container;
    if (container_get(argv[1], &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", argv[1]);
        return 1;
    }
    
    char log_file[MAX_PATH];
    snprintf(log_file, MAX_PATH, "%s/%s/logs/output.log", get_containers_dir(), container.id);
    
    FILE *fp = fopen(log_file, "r");
    if (!fp) {
        log_message(LOG_ERROR, "Failed to open log file");
        return 1;
    }
    
    char line[4096];
    while (fgets(line, sizeof(line), fp)) {
        printf("%s", line);
    }
    
    fclose(fp);
    return 0;
}
