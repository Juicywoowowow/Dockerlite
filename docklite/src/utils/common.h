#ifndef COMMON_H
#define COMMON_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>

#define DOCKLITE_VERSION "0.1.0"
#define MAX_PATH 4096
#define MAX_NAME 256
#define MAX_PORTS 32
#define MAX_ENV 64
#define MAX_VOLUMES 32

typedef struct {
    char *key;
    char *value;
} KeyValue;

typedef struct {
    char name[MAX_NAME];
    char image[MAX_PATH];
    char command[MAX_PATH];
    char workdir[MAX_PATH];
    KeyValue ports[MAX_PORTS];
    int port_count;
    KeyValue env[MAX_ENV];
    int env_count;
    KeyValue volumes[MAX_VOLUMES];
    int volume_count;
} ContainerConfig;

typedef struct {
    char id[64];
    char name[MAX_NAME];
    pid_t pid;
    char status[32];
    char rootfs[MAX_PATH];
    ContainerConfig config;
} Container;

char* get_docklite_dir(void);
char* get_containers_dir(void);
char* get_images_dir(void);
char* get_layers_dir(void);

#endif
