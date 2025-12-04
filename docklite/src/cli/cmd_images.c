#include "commands.h"
#include "utils/logger.h"
#include "utils/common.h"
#include <dirent.h>
#include <sys/stat.h>

int cmd_images(int argc, char **argv) {
    (void)argc;
    (void)argv;
    DIR *dir = opendir(get_images_dir());
    if (!dir) {
        printf("No images found\n");
        return 0;
    }
    
    printf("%-30s %-15s\n", "IMAGE", "SIZE");
    printf("%-30s %-15s\n", "------------------------------", "---------------");
    
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_name[0] == '.') continue;
        
        char image_path[MAX_PATH];
        snprintf(image_path, MAX_PATH, "%s/%s", get_images_dir(), entry->d_name);
        
        struct stat st;
        if (stat(image_path, &st) == 0) {
            printf("%-30s %-15lld\n", entry->d_name, (long long)st.st_size);
        }
    }
    
    closedir(dir);
    return 0;
}
