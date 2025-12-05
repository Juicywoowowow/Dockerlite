#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_DEPTH 100
#define BUFFER_SIZE 8192

void print_indent(int depth) {
    for (int i = 0; i < depth; i++) {
        printf("  ");
    }
}

void format_json(const char *json) {
    int depth = 0;
    int in_string = 0;
    int escape = 0;
    
    for (int i = 0; json[i] != '\0'; i++) {
        char c = json[i];
        
        if (escape) {
            putchar(c);
            escape = 0;
            continue;
        }
        
        if (c == '\\' && in_string) {
            putchar(c);
            escape = 1;
            continue;
        }
        
        if (c == '"') {
            in_string = !in_string;
            putchar(c);
            continue;
        }
        
        if (in_string) {
            putchar(c);
            continue;
        }
        
        switch (c) {
            case '{':
            case '[':
                putchar(c);
                putchar('\n');
                depth++;
                print_indent(depth);
                break;
            case '}':
            case ']':
                putchar('\n');
                depth--;
                print_indent(depth);
                putchar(c);
                break;
            case ',':
                putchar(c);
                putchar('\n');
                print_indent(depth);
                break;
            case ':':
                putchar(c);
                putchar(' ');
                break;
            case ' ':
            case '\t':
            case '\n':
            case '\r':
                break;
            default:
                putchar(c);
        }
    }
    putchar('\n');
}

void minify_json(const char *json) {
    int in_string = 0;
    int escape = 0;
    
    for (int i = 0; json[i] != '\0'; i++) {
        char c = json[i];
        
        if (escape) {
            putchar(c);
            escape = 0;
            continue;
        }
        
        if (c == '\\' && in_string) {
            putchar(c);
            escape = 1;
            continue;
        }
        
        if (c == '"') {
            in_string = !in_string;
            putchar(c);
            continue;
        }
        
        if (in_string) {
            putchar(c);
            continue;
        }
        
        if (!isspace(c)) {
            putchar(c);
        }
    }
    putchar('\n');
}

int validate_json(const char *json) {
    int depth = 0;
    int in_string = 0;
    int escape = 0;
    char stack[MAX_DEPTH];
    int stack_ptr = 0;
    
    for (int i = 0; json[i] != '\0'; i++) {
        char c = json[i];
        
        if (escape) {
            escape = 0;
            continue;
        }
        
        if (c == '\\' && in_string) {
            escape = 1;
            continue;
        }
        
        if (c == '"') {
            in_string = !in_string;
            continue;
        }
        
        if (in_string) continue;
        
        if (c == '{' || c == '[') {
            if (stack_ptr >= MAX_DEPTH) return 0;
            stack[stack_ptr++] = c;
        } else if (c == '}') {
            if (stack_ptr == 0 || stack[--stack_ptr] != '{') return 0;
        } else if (c == ']') {
            if (stack_ptr == 0 || stack[--stack_ptr] != '[') return 0;
        }
    }
    
    return stack_ptr == 0 && !in_string;
}

int main(int argc, char *argv[]) {
    char buffer[BUFFER_SIZE];
    char *json = NULL;
    size_t total_size = 0;
    size_t chunk_size;
    int format = 1;
    int validate_only = 0;
    
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-m") == 0 || strcmp(argv[i], "--minify") == 0) {
            format = 0;
        } else if (strcmp(argv[i], "-v") == 0 || strcmp(argv[i], "--validate") == 0) {
            validate_only = 1;
        } else if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            printf("Usage: jsonparse [OPTIONS]\n");
            printf("Parse and format JSON from stdin\n\n");
            printf("Options:\n");
            printf("  -m, --minify     Minify JSON output\n");
            printf("  -v, --validate   Only validate JSON\n");
            printf("  -h, --help       Show this help\n");
            return 0;
        }
    }
    
    while ((chunk_size = fread(buffer, 1, BUFFER_SIZE - 1, stdin)) > 0) {
        buffer[chunk_size] = '\0';
        json = realloc(json, total_size + chunk_size + 1);
        if (json == NULL) {
            fprintf(stderr, "Memory allocation failed\n");
            return 1;
        }
        memcpy(json + total_size, buffer, chunk_size + 1);
        total_size += chunk_size;
    }
    
    if (json == NULL || total_size == 0) {
        fprintf(stderr, "No input provided\n");
        return 1;
    }
    
    if (validate_only) {
        if (validate_json(json)) {
            printf("✓ Valid JSON\n");
            free(json);
            return 0;
        } else {
            printf("✗ Invalid JSON\n");
            free(json);
            return 1;
        }
    }
    
    if (!validate_json(json)) {
        fprintf(stderr, "Error: Invalid JSON\n");
        free(json);
        return 1;
    }
    
    if (format) {
        format_json(json);
    } else {
        minify_json(json);
    }
    
    free(json);
    return 0;
}
