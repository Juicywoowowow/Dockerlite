#include "commands.h"
#include "core/container.h"
#include "utils/logger.h"

int cmd_ps(int argc, char **argv) {
    int all = 0;
    if (argc > 1 && strcmp(argv[1], "-a") == 0) {
        all = 1;
    }
    
    Container *containers;
    int count;
    
    if (container_list(&containers, &count, all) != 0) {
        return 1;
    }
    
    printf("%-12s %-20s %-10s %-10s\n", "ID", "NAME", "STATUS", "PID");
    printf("%-12s %-20s %-10s %-10s\n", "----------", "--------------------", "----------", "----------");
    
    for (int i = 0; i < count; i++) {
        char short_id[13];
        strncpy(short_id, containers[i].id, 12);
        short_id[12] = '\0';
        
        printf("%-12s %-20s %-10s %-10d\n",
               short_id,
               containers[i].name,
               containers[i].status,
               containers[i].pid);
    }
    
    free(containers);
    return 0;
}
