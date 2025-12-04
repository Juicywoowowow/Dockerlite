#include "config_parser.h"
#include "utils/logger.h"
#include <ctype.h>

static char* trim_whitespace(char *str) {
    while(isspace(*str)) str++;
    if(*str == 0) return str;
    char *end = str + strlen(str) - 1;
    while(end > str && isspace(*end)) end--;
    end[1] = '\0';
    return str;
}

static char* extract_string(const char *line) {
    const char *start = strchr(line, '"');
    if (!start) return NULL;
    start++;
    const char *end = strchr(start, '"');
    if (!end) return NULL;
    
    size_t len = end - start;
    char *result = malloc(len + 1);
    strncpy(result, start, len);
    result[len] = '\0';
    return result;
}

int parse_docklite_config(const char *filepath, ContainerConfig *config) {
    FILE *fp = fopen(filepath, "r");
    if (!fp) {
        log_message(LOG_ERROR, "Failed to open config file: %s", filepath);
        return -1;
    }
    
    memset(config, 0, sizeof(ContainerConfig));
    char line[MAX_PATH];
    int in_ports = 0, in_volumes = 0;
    
    while (fgets(line, sizeof(line), fp)) {
        char *trimmed = trim_whitespace(line);
        
        if (strstr(trimmed, "\"name\"")) {
            char *value = extract_string(trimmed);
            if (value) {
                strncpy(config->name, value, MAX_NAME - 1);
                free(value);
            }
        } else if (strstr(trimmed, "\"image\"")) {
            char *value = extract_string(trimmed);
            if (value) {
                strncpy(config->image, value, MAX_PATH - 1);
                free(value);
            }
        } else if (strstr(trimmed, "\"command\"")) {
            char *value = extract_string(trimmed);
            if (value) {
                strncpy(config->command, value, MAX_PATH - 1);
                free(value);
            }
        } else if (strstr(trimmed, "\"workdir\"")) {
            char *value = extract_string(trimmed);
            if (value) {
                strncpy(config->workdir, value, MAX_PATH - 1);
                free(value);
            }
        } else if (strstr(trimmed, "\"ports\"")) {
            in_ports = 1;
            in_volumes = 0;
        } else if (strstr(trimmed, "\"env\"")) {
            in_ports = 0;
            in_volumes = 0;
        } else if (strstr(trimmed, "\"volumes\"")) {
            in_volumes = 1;
            in_ports = 0;
        } else if (in_ports && strchr(trimmed, '"')) {
            char *value = extract_string(trimmed);
            if (value && config->port_count < MAX_PORTS) {
                char *colon = strchr(value, ':');
                if (colon) {
                    *colon = '\0';
                    config->ports[config->port_count].key = strdup(value);
                    config->ports[config->port_count].value = strdup(colon + 1);
                    config->port_count++;
                }
                free(value);
            }
        } else if (in_volumes && strchr(trimmed, '"')) {
            char *value = extract_string(trimmed);
            if (value && config->volume_count < MAX_VOLUMES) {
                char *colon = strchr(value, ':');
                if (colon) {
                    *colon = '\0';
                    config->volumes[config->volume_count].key = strdup(value);
                    config->volumes[config->volume_count].value = strdup(colon + 1);
                    config->volume_count++;
                }
                free(value);
            }
        }
    }
    
    fclose(fp);
    return 0;
}

void free_container_config(ContainerConfig *config) {
    for (int i = 0; i < config->port_count; i++) {
        free(config->ports[i].key);
        free(config->ports[i].value);
    }
    for (int i = 0; i < config->env_count; i++) {
        free(config->env[i].key);
        free(config->env[i].value);
    }
    for (int i = 0; i < config->volume_count; i++) {
        free(config->volumes[i].key);
        free(config->volumes[i].value);
    }
}
