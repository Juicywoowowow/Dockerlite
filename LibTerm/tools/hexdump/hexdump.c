#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define BYTES_PER_LINE 16

void print_hex_dump(const unsigned char *data, size_t length, int show_ascii) {
    for (size_t i = 0; i < length; i += BYTES_PER_LINE) {
        printf("%08zx  ", i);
        
        for (size_t j = 0; j < BYTES_PER_LINE; j++) {
            if (i + j < length) {
                printf("%02x ", data[i + j]);
            } else {
                printf("   ");
            }
            
            if (j == 7) printf(" ");
        }
        
        if (show_ascii) {
            printf(" |");
            for (size_t j = 0; j < BYTES_PER_LINE && i + j < length; j++) {
                unsigned char c = data[i + j];
                printf("%c", isprint(c) ? c : '.');
            }
            printf("|");
        }
        
        printf("\n");
    }
}

void dump_file(const char *filename, int show_ascii, long offset, long length) {
    FILE *fp = fopen(filename, "rb");
    if (fp == NULL) {
        fprintf(stderr, "Error: Cannot open file '%s'\n", filename);
        return;
    }
    
    if (offset > 0) {
        fseek(fp, offset, SEEK_SET);
    }
    
    fseek(fp, 0, SEEK_END);
    long file_size = ftell(fp);
    fseek(fp, offset, SEEK_SET);
    
    if (length == -1 || offset + length > file_size) {
        length = file_size - offset;
    }
    
    unsigned char *buffer = malloc(length);
    if (buffer == NULL) {
        fprintf(stderr, "Error: Memory allocation failed\n");
        fclose(fp);
        return;
    }
    
    size_t bytes_read = fread(buffer, 1, length, fp);
    fclose(fp);
    
    printf("File: %s\n", filename);
    printf("Size: %ld bytes\n", file_size);
    if (offset > 0) printf("Offset: %ld\n", offset);
    if (length != file_size) printf("Length: %ld\n", length);
    printf("\n");
    
    print_hex_dump(buffer, bytes_read, show_ascii);
    free(buffer);
}

void dump_stdin(int show_ascii) {
    unsigned char buffer[4096];
    size_t total = 0;
    unsigned char *all_data = NULL;
    size_t bytes_read;
    
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), stdin)) > 0) {
        all_data = realloc(all_data, total + bytes_read);
        if (all_data == NULL) {
            fprintf(stderr, "Error: Memory allocation failed\n");
            return;
        }
        memcpy(all_data + total, buffer, bytes_read);
        total += bytes_read;
    }
    
    if (all_data) {
        print_hex_dump(all_data, total, show_ascii);
        free(all_data);
    }
}

int main(int argc, char *argv[]) {
    int show_ascii = 1;
    long offset = 0;
    long length = -1;
    const char *filename = NULL;
    
    if (argc < 2) {
        printf("Usage: hexdump [OPTIONS] <file>\n\n");
        printf("Options:\n");
        printf("  -n           No ASCII column\n");
        printf("  -o <offset>  Start at byte offset\n");
        printf("  -l <length>  Read only length bytes\n");
        printf("  -h           Show this help\n\n");
        printf("Examples:\n");
        printf("  hexdump file.bin\n");
        printf("  hexdump -o 100 -l 256 file.bin\n");
        printf("  cat file.bin | hexdump -\n");
        return 1;
    }
    
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            printf("hexdump - Hexadecimal File Viewer\n");
            printf("Display file contents in hexadecimal format\n\n");
            printf("Usage: hexdump [OPTIONS] <file>\n\n");
            printf("Options:\n");
            printf("  -n           No ASCII column\n");
            printf("  -o <offset>  Start at byte offset\n");
            printf("  -l <length>  Read only length bytes\n");
            printf("  -h           Show this help\n");
            return 0;
        } else if (strcmp(argv[i], "-n") == 0) {
            show_ascii = 0;
        } else if (strcmp(argv[i], "-o") == 0 && i + 1 < argc) {
            offset = atol(argv[++i]);
        } else if (strcmp(argv[i], "-l") == 0 && i + 1 < argc) {
            length = atol(argv[++i]);
        } else if (argv[i][0] != '-') {
            filename = argv[i];
        }
    }
    
    if (filename == NULL || strcmp(filename, "-") == 0) {
        dump_stdin(show_ascii);
    } else {
        dump_file(filename, show_ascii, offset, length);
    }
    
    return 0;
}
