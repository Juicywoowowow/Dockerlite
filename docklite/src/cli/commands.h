#ifndef COMMANDS_H
#define COMMANDS_H

int cmd_run(int argc, char **argv);
int cmd_start(int argc, char **argv);
int cmd_stop(int argc, char **argv);
int cmd_ps(int argc, char **argv);
int cmd_rm(int argc, char **argv);
int cmd_logs(int argc, char **argv);
int cmd_exec(int argc, char **argv);
int cmd_enter(int argc, char **argv);
int cmd_images(int argc, char **argv);
int cmd_pull(int argc, char **argv);
int cmd_inspect(int argc, char **argv);

#endif
