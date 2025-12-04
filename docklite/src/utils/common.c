#include "common.h"
#include <pwd.h>

char* get_docklite_dir(void) {
    static char path[MAX_PATH];
    const char *prefix = getenv("PREFIX");
    
    if (prefix) {
        snprintf(path, MAX_PATH, "%s/var/docklite", prefix);
    } else {
        const char *home = getenv("HOME");
        snprintf(path, MAX_PATH, "%s/.local/var/docklite", home);
    }
    
    return path;
}

char* get_containers_dir(void) {
    static char path[MAX_PATH];
    snprintf(path, MAX_PATH, "%s/containers", get_docklite_dir());
    return path;
}

char* get_images_dir(void) {
    static char path[MAX_PATH];
    snprintf(path, MAX_PATH, "%s/images", get_docklite_dir());
    return path;
}

char* get_layers_dir(void) {
    static char path[MAX_PATH];
    snprintf(path, MAX_PATH, "%s/layers", get_docklite_dir());
    return path;
}
