#ifndef TOOL_MANAGER_H
#define TOOL_MANAGER_H

#define MAX_TOOLS 20
#define MAX_NAME_LEN 50
#define STATE_FILE ".libterm/state.txt"

typedef struct {
    char name[MAX_NAME_LEN];
    char display_name[MAX_NAME_LEN];
    int active;
} Tool;

int load_tools(Tool *tools);
void save_tools(Tool *tools, int count);
int activate_tool(const char *tool_name);
int deactivate_tool(const char *tool_name);

#endif
