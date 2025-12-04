#include "commands.h"
#include "utils/common.h"
#include "utils/logger.h"
#include <sys/stat.h>

static void print_usage(void) {
    printf("Docklite v%s - Lightweight container system for Termux\n\n", DOCKLITE_VERSION);
    printf("Usage: docklite <command> [options]\n\n");
    printf("Commands:\n");
    printf("  run <config>        Start container from .docklite config\n");
    printf("  start <id>          Start stopped container\n");
    printf("  stop <id>           Stop running container\n");
    printf("  ps [-a]             List containers\n");
    printf("  rm <id>             Remove container\n");
    printf("  logs <id>           View container logs\n");
    printf("  exec <id> <cmd>     Execute command in container\n");
    printf("  enter <id>          Enter container shell\n");
    printf("  images              List available images\n");
    printf("  pull <image>        Download image\n");
    printf("  inspect <id>        Show container details\n");
}

static void init_directories(void) {
    char *dirs[] = {
        get_docklite_dir(),
        get_containers_dir(),
        get_images_dir(),
        get_layers_dir()
    };
    
    for (int i = 0; i < 4; i++) {
        struct stat st = {0};
        if (stat(dirs[i], &st) == -1) {
            mkdir(dirs[i], 0755);
        }
    }
}

int main(int argc, char **argv) {
    if (argc < 2) {
        print_usage();
        return 1;
    }
    
    init_directories();
    
    const char *cmd = argv[1];
    
    if (strcmp(cmd, "run") == 0) {
        return cmd_run(argc - 1, argv + 1);
    } else if (strcmp(cmd, "start") == 0) {
        return cmd_start(argc - 1, argv + 1);
    } else if (strcmp(cmd, "stop") == 0) {
        return cmd_stop(argc - 1, argv + 1);
    } else if (strcmp(cmd, "ps") == 0) {
        return cmd_ps(argc - 1, argv + 1);
    } else if (strcmp(cmd, "rm") == 0) {
        return cmd_rm(argc - 1, argv + 1);
    } else if (strcmp(cmd, "logs") == 0) {
        return cmd_logs(argc - 1, argv + 1);
    } else if (strcmp(cmd, "exec") == 0) {
        return cmd_exec(argc - 1, argv + 1);
    } else if (strcmp(cmd, "enter") == 0) {
        return cmd_enter(argc - 1, argv + 1);
    } else if (strcmp(cmd, "images") == 0) {
        return cmd_images(argc - 1, argv + 1);
    } else if (strcmp(cmd, "pull") == 0) {
        return cmd_pull(argc - 1, argv + 1);
    } else if (strcmp(cmd, "inspect") == 0) {
        return cmd_inspect(argc - 1, argv + 1);
    } else {
        printf("Unknown command: %s\n\n", cmd);
        print_usage();
        return 1;
    }
    
    return 0;
}
