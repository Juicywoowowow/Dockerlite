#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "ansi.h"
#include "tool_manager.h"

void display_menu(Tool *tools, int count) {
    printf(CLEAR_SCREEN);
    printf(COLOR_CYAN COLOR_BOLD "╔════════════════════════════════════════╗\n");
    printf("║           LibTerm v1.0                 ║\n");
    printf("╚════════════════════════════════════════╝\n" COLOR_RESET);
    printf("\n");
    
    for (int i = 0; i < count; i++) {
        if (tools[i].active) {
            printf("  [%d] %s%-25s%s ✓\n", i + 1, COLOR_YELLOW, tools[i].display_name, COLOR_RESET);
        } else {
            printf("  [%d] %s%-25s%s ✗\n", i + 1, COLOR_RED, tools[i].display_name, COLOR_RESET);
        }
    }
    
    printf("\n");
    printf(COLOR_GREEN "[A]" COLOR_RESET "ctivate | ");
    printf(COLOR_RED "[D]" COLOR_RESET "eactivate | ");
    printf(COLOR_BLUE "[R]" COLOR_RESET "efresh | ");
    printf(COLOR_MAGENTA "[Q]" COLOR_RESET "uit\n");
    printf("\n> ");
}

int main() {
    Tool tools[MAX_TOOLS];
    int tool_count = load_tools(tools);
    char choice;
    int tool_num;
    
    while (1) {
        display_menu(tools, tool_count);
        scanf(" %c", &choice);
        
        if (choice == 'q' || choice == 'Q') {
            printf(COLOR_GREEN "\nExiting LibTerm...\n" COLOR_RESET);
            break;
        }
        
        if (choice == 'r' || choice == 'R') {
            tool_count = load_tools(tools);
            continue;
        }
        
        if (choice == 'a' || choice == 'A') {
            printf("Enter tool number to activate: ");
            scanf("%d", &tool_num);
            if (tool_num > 0 && tool_num <= tool_count) {
                printf(COLOR_YELLOW "Activating %s...\n" COLOR_RESET, tools[tool_num - 1].display_name);
                if (activate_tool(tools[tool_num - 1].name) == 0) {
                    tools[tool_num - 1].active = 1;
                    save_tools(tools, tool_count);
                    printf(COLOR_GREEN "✓ Activated successfully!\n" COLOR_RESET);
                } else {
                    printf(COLOR_RED "✗ Activation failed!\n" COLOR_RESET);
                }
                sleep(2);
            }
        }
        
        if (choice == 'd' || choice == 'D') {
            printf("Enter tool number to deactivate: ");
            scanf("%d", &tool_num);
            if (tool_num > 0 && tool_num <= tool_count) {
                printf(COLOR_YELLOW "Deactivating %s...\n" COLOR_RESET, tools[tool_num - 1].display_name);
                if (deactivate_tool(tools[tool_num - 1].name) == 0) {
                    tools[tool_num - 1].active = 0;
                    save_tools(tools, tool_count);
                    printf(COLOR_GREEN "✓ Deactivated successfully!\n" COLOR_RESET);
                } else {
                    printf(COLOR_RED "✗ Deactivation failed!\n" COLOR_RESET);
                }
                sleep(2);
            }
        }
    }
    
    return 0;
}

int load_tools(Tool *tools) {
    FILE *fp = fopen(STATE_FILE, "r");
    int count = 0;
    
    if (fp == NULL) {
        strcpy(tools[0].name, "jsonparse");
        strcpy(tools[0].display_name, "JSON Parser");
        tools[0].active = 0;
        
        strcpy(tools[1].name, "netscan");
        strcpy(tools[1].display_name, "Network Scanner");
        tools[1].active = 0;
        
        strcpy(tools[2].name, "hashcrack");
        strcpy(tools[2].display_name, "Hash Cracker");
        tools[2].active = 0;
        
        strcpy(tools[3].name, "portscan");
        strcpy(tools[3].display_name, "Port Scanner");
        tools[3].active = 0;
        
        strcpy(tools[4].name, "b64tool");
        strcpy(tools[4].display_name, "Base64 Tool");
        tools[4].active = 0;
        
        strcpy(tools[5].name, "hexdump");
        strcpy(tools[5].display_name, "Hex Dump");
        tools[5].active = 0;
        
        return 6;
    }
    
    char line[100];
    while (fgets(line, sizeof(line), fp) && count < MAX_TOOLS) {
        char *colon = strchr(line, ':');
        if (colon) {
            *colon = '\0';
            strcpy(tools[count].name, line);
            
            if (strcmp(line, "jsonparse") == 0) strcpy(tools[count].display_name, "JSON Parser");
            else if (strcmp(line, "netscan") == 0) strcpy(tools[count].display_name, "Network Scanner");
            else if (strcmp(line, "hashcrack") == 0) strcpy(tools[count].display_name, "Hash Cracker");
            else if (strcmp(line, "portscan") == 0) strcpy(tools[count].display_name, "Port Scanner");
            else if (strcmp(line, "b64tool") == 0) strcpy(tools[count].display_name, "Base64 Tool");
            else if (strcmp(line, "hexdump") == 0) strcpy(tools[count].display_name, "Hex Dump");
            
            char *status = colon + 1;
            status[strcspn(status, "\n")] = 0;
            tools[count].active = (strcmp(status, "active") == 0) ? 1 : 0;
            count++;
        }
    }
    
    fclose(fp);
    return count;
}

void save_tools(Tool *tools, int count) {
    FILE *fp = fopen(STATE_FILE, "w");
    if (fp == NULL) return;
    
    for (int i = 0; i < count; i++) {
        fprintf(fp, "%s:%s\n", tools[i].name, tools[i].active ? "active" : "inactive");
    }
    
    fclose(fp);
}

int activate_tool(const char *tool_name) {
    char cmd[256];
    snprintf(cmd, sizeof(cmd), "./scripts/compile_tool.sh %s", tool_name);
    if (system(cmd) != 0) return -1;
    
    snprintf(cmd, sizeof(cmd), "./scripts/add_to_path.sh");
    return system(cmd);
}

int deactivate_tool(const char *tool_name) {
    char cmd[256];
    snprintf(cmd, sizeof(cmd), "./scripts/remove_from_path.sh");
    return system(cmd);
}
