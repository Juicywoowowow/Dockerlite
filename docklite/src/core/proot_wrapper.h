#ifndef PROOT_WRAPPER_H
#define PROOT_WRAPPER_H

#include "utils/common.h"

pid_t proot_start_container(Container *container);
int proot_exec_in_container(Container *container, const char *command);
int proot_enter_shell(Container *container);

#endif
