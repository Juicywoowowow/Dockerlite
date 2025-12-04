#include "proot_wrapper.h"
#include "utils/logger.h"
#include <sys/wait.h>

static char* detect_shell(const char *rootfs) {
    const char *shells[] = {"/bin/bash", "/bin/sh", "/bin/ash", "/bin/zsh", NULL};
    static char shell_path[MAX_PATH];
    
    for (int i = 0; shells[i] != NULL; i++) {
        snprintf(shell_path, MAX_PATH, "%s%s", rootfs, shells[i]);
        if (access(shell_path, X_OK) == 0) {
            return strdup(shells[i]);
        }
    }
    
    return strdup("/bin/sh");
}

pid_t proot_start_container(Container *container) {
    pid_t pid = fork();
    
    if (pid == 0) {
        char log_file[MAX_PATH];
        snprintf(log_file, MAX_PATH, "%s/%s/logs/output.log", get_containers_dir(), container->id);
        
        freopen(log_file, "w", stdout);
        freopen(log_file, "w", stderr);
        
        char *args[64];
        int argc = 0;
        
        args[argc++] = "proot";
        args[argc++] = "-r";
        args[argc++] = container->rootfs;
        
        if (strlen(container->config.workdir) > 0) {
            args[argc++] = "-w";
            args[argc++] = container->config.workdir;
        }
        
        for (int i = 0; i < container->config.volume_count; i++) {
            args[argc++] = "-b";
            static char bind_arg[MAX_PATH];
            snprintf(bind_arg, MAX_PATH, "%s:%s", 
                     container->config.volumes[i].key,
                     container->config.volumes[i].value);
            args[argc++] = bind_arg;
        }
        
        if (strlen(container->config.command) > 0) {
            args[argc++] = "/bin/sh";
            args[argc++] = "-c";
            args[argc++] = container->config.command;
        } else {
            char *shell = detect_shell(container->rootfs);
            args[argc++] = shell;
        }
        
        args[argc] = NULL;
        
        execvp("proot", args);
        exit(1);
    }
    
    return pid;
}

int proot_exec_in_container(Container *container, const char *command) {
    pid_t pid = fork();
    
    if (pid == 0) {
        char *args[64];
        int argc = 0;
        
        args[argc++] = "proot";
        args[argc++] = "-r";
        args[argc++] = container->rootfs;
        
        if (strlen(container->config.workdir) > 0) {
            args[argc++] = "-w";
            args[argc++] = container->config.workdir;
        }
        
        args[argc++] = "/bin/sh";
        args[argc++] = "-c";
        args[argc++] = (char*)command;
        args[argc] = NULL;
        
        execvp("proot", args);
        exit(1);
    }
    
    int status;
    waitpid(pid, &status, 0);
    return WEXITSTATUS(status);
}

int proot_enter_shell(Container *container) {
    char *shell = detect_shell(container->rootfs);
    
    char *args[64];
    int argc = 0;
    
    args[argc++] = "proot";
    args[argc++] = "-r";
    args[argc++] = container->rootfs;
    
    if (strlen(container->config.workdir) > 0) {
        args[argc++] = "-w";
        args[argc++] = container->config.workdir;
    }
    
    for (int i = 0; i < container->config.volume_count; i++) {
        args[argc++] = "-b";
        static char bind_args[MAX_VOLUMES][MAX_PATH];
        snprintf(bind_args[i], MAX_PATH, "%s:%s", 
                 container->config.volumes[i].key,
                 container->config.volumes[i].value);
        args[argc++] = bind_args[i];
    }
    
    args[argc++] = shell;
    args[argc] = NULL;
    
    execvp("proot", args);
    return -1;
}
