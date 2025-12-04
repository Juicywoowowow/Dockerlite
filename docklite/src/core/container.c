#include "container.h"
#include "utils/logger.h"
#include "proot_wrapper.h"
#include <dirent.h>
#include <signal.h>
#include <sys/wait.h>

char* generate_container_id(void) {
    static char id[64];
    snprintf(id, sizeof(id), "%lx%lx", (unsigned long)time(NULL), (unsigned long)getpid());
    return id;
}

static int save_container_state(Container *container) {
    char state_file[MAX_PATH];
    snprintf(state_file, MAX_PATH, "%s/%s/state.txt", get_containers_dir(), container->id);
    
    FILE *fp = fopen(state_file, "w");
    if (!fp) return -1;
    
    fprintf(fp, "id=%s\n", container->id);
    fprintf(fp, "name=%s\n", container->name);
    fprintf(fp, "pid=%d\n", container->pid);
    fprintf(fp, "status=%s\n", container->status);
    fprintf(fp, "rootfs=%s\n", container->rootfs);
    fprintf(fp, "image=%s\n", container->config.image);
    fprintf(fp, "command=%s\n", container->config.command);
    
    fclose(fp);
    return 0;
}

static int load_container_state(const char *container_id, Container *container) {
    char state_file[MAX_PATH];
    snprintf(state_file, MAX_PATH, "%s/%s/state.txt", get_containers_dir(), container_id);
    
    FILE *fp = fopen(state_file, "r");
    if (!fp) return -1;
    
    char line[MAX_PATH];
    while (fgets(line, sizeof(line), fp)) {
        char *eq = strchr(line, '=');
        if (!eq) continue;
        *eq = '\0';
        char *key = line;
        char *value = eq + 1;
        value[strcspn(value, "\n")] = 0;
        
        if (strcmp(key, "id") == 0) strncpy(container->id, value, sizeof(container->id) - 1);
        else if (strcmp(key, "name") == 0) strncpy(container->name, value, sizeof(container->name) - 1);
        else if (strcmp(key, "pid") == 0) container->pid = atoi(value);
        else if (strcmp(key, "status") == 0) strncpy(container->status, value, sizeof(container->status) - 1);
        else if (strcmp(key, "rootfs") == 0) strncpy(container->rootfs, value, sizeof(container->rootfs) - 1);
        else if (strcmp(key, "image") == 0) strncpy(container->config.image, value, sizeof(container->config.image) - 1);
        else if (strcmp(key, "command") == 0) strncpy(container->config.command, value, sizeof(container->config.command) - 1);
    }
    
    fclose(fp);
    return 0;
}

int container_create(ContainerConfig *config, Container *container) {
    memset(container, 0, sizeof(Container));
    
    char *id = generate_container_id();
    strncpy(container->id, id, sizeof(container->id) - 1);
    strncpy(container->name, config->name, sizeof(container->name) - 1);
    strncpy(container->status, "created", sizeof(container->status) - 1);
    memcpy(&container->config, config, sizeof(ContainerConfig));
    
    char container_dir[MAX_PATH];
    snprintf(container_dir, MAX_PATH, "%s/%s", get_containers_dir(), container->id);
    mkdir(container_dir, 0755);
    
    snprintf(container->rootfs, MAX_PATH, "%s/rootfs", container_dir);
    mkdir(container->rootfs, 0755);
    
    char logs_dir[MAX_PATH];
    snprintf(logs_dir, MAX_PATH, "%s/logs", container_dir);
    mkdir(logs_dir, 0755);
    
    save_container_state(container);
    
    log_message(LOG_INFO, "Container created: %s (%s)", container->name, container->id);
    return 0;
}

int container_start(const char *container_id) {
    Container container;
    if (load_container_state(container_id, &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", container_id);
        return -1;
    }
    
    pid_t pid = proot_start_container(&container);
    if (pid < 0) {
        log_message(LOG_ERROR, "Failed to start container");
        return -1;
    }
    
    container.pid = pid;
    strncpy(container.status, "running", sizeof(container.status) - 1);
    save_container_state(&container);
    
    log_message(LOG_INFO, "Container started: %s (PID: %d)", container.name, pid);
    return 0;
}

int container_stop(const char *container_id) {
    Container container;
    if (load_container_state(container_id, &container) != 0) {
        log_message(LOG_ERROR, "Container not found: %s", container_id);
        return -1;
    }
    
    if (container.pid > 0) {
        kill(container.pid, SIGTERM);
        sleep(2);
        
        if (kill(container.pid, 0) == 0) {
            kill(container.pid, SIGKILL);
        }
    }
    
    container.pid = 0;
    strncpy(container.status, "stopped", sizeof(container.status) - 1);
    save_container_state(&container);
    
    log_message(LOG_INFO, "Container stopped: %s", container.name);
    return 0;
}

int container_remove(const char *container_id) {
    container_stop(container_id);
    
    char container_dir[MAX_PATH];
    snprintf(container_dir, MAX_PATH, "%s/%s", get_containers_dir(), container_id);
    
    char cmd[MAX_PATH];
    snprintf(cmd, MAX_PATH, "rm -rf %s", container_dir);
    system(cmd);
    
    log_message(LOG_INFO, "Container removed: %s", container_id);
    return 0;
}

int container_list(Container **containers, int *count, int all) {
    DIR *dir = opendir(get_containers_dir());
    if (!dir) {
        *count = 0;
        return 0;
    }
    
    *count = 0;
    *containers = malloc(sizeof(Container) * 100);
    
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_name[0] == '.') continue;
        
        Container container;
        if (load_container_state(entry->d_name, &container) == 0) {
            if (container.pid > 0 && kill(container.pid, 0) != 0) {
                container.pid = 0;
                strncpy(container.status, "stopped", sizeof(container.status) - 1);
                save_container_state(&container);
            }
            
            if (all || strcmp(container.status, "running") == 0) {
                (*containers)[*count] = container;
                (*count)++;
            }
        }
    }
    
    closedir(dir);
    return 0;
}

int container_get(const char *container_id, Container *container) {
    return load_container_state(container_id, container);
}
