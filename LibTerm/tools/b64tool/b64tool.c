#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const char base64_chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

char* base64_encode(const unsigned char *data, size_t input_length, size_t *output_length) {
    *output_length = 4 * ((input_length + 2) / 3);
    char *encoded_data = malloc(*output_length + 1);
    if (encoded_data == NULL) return NULL;
    
    for (size_t i = 0, j = 0; i < input_length;) {
        uint32_t octet_a = i < input_length ? data[i++] : 0;
        uint32_t octet_b = i < input_length ? data[i++] : 0;
        uint32_t octet_c = i < input_length ? data[i++] : 0;
        uint32_t triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
        
        encoded_data[j++] = base64_chars[(triple >> 3 * 6) & 0x3F];
        encoded_data[j++] = base64_chars[(triple >> 2 * 6) & 0x3F];
        encoded_data[j++] = base64_chars[(triple >> 1 * 6) & 0x3F];
        encoded_data[j++] = base64_chars[(triple >> 0 * 6) & 0x3F];
    }
    
    for (int i = 0; i < (3 - input_length % 3) % 3; i++) {
        encoded_data[*output_length - 1 - i] = '=';
    }
    
    encoded_data[*output_length] = '\0';
    return encoded_data;
}

unsigned char* base64_decode(const char *data, size_t input_length, size_t *output_length) {
    if (input_length % 4 != 0) return NULL;
    
    *output_length = input_length / 4 * 3;
    if (data[input_length - 1] == '=') (*output_length)--;
    if (data[input_length - 2] == '=') (*output_length)--;
    
    unsigned char *decoded_data = malloc(*output_length + 1);
    if (decoded_data == NULL) return NULL;
    
    for (size_t i = 0, j = 0; i < input_length;) {
        uint32_t sextet_a = data[i] == '=' ? 0 & i++ : strchr(base64_chars, data[i++]) - base64_chars;
        uint32_t sextet_b = data[i] == '=' ? 0 & i++ : strchr(base64_chars, data[i++]) - base64_chars;
        uint32_t sextet_c = data[i] == '=' ? 0 & i++ : strchr(base64_chars, data[i++]) - base64_chars;
        uint32_t sextet_d = data[i] == '=' ? 0 & i++ : strchr(base64_chars, data[i++]) - base64_chars;
        uint32_t triple = (sextet_a << 3 * 6) + (sextet_b << 2 * 6) + (sextet_c << 1 * 6) + (sextet_d << 0 * 6);
        
        if (j < *output_length) decoded_data[j++] = (triple >> 2 * 8) & 0xFF;
        if (j < *output_length) decoded_data[j++] = (triple >> 1 * 8) & 0xFF;
        if (j < *output_length) decoded_data[j++] = (triple >> 0 * 8) & 0xFF;
    }
    
    decoded_data[*output_length] = '\0';
    return decoded_data;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: b64tool [OPTIONS] <input>\n\n");
        printf("Options:\n");
        printf("  -e <text>    Encode text to base64\n");
        printf("  -d <base64>  Decode base64 to text\n");
        printf("  -f <file>    Encode file to base64\n");
        printf("  -h           Show this help\n\n");
        printf("Examples:\n");
        printf("  b64tool -e \"Hello World\"\n");
        printf("  b64tool -d \"SGVsbG8gV29ybGQ=\"\n");
        printf("  echo \"test\" | b64tool -e -\n");
        return 1;
    }
    
    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        printf("b64tool - Base64 Encoder/Decoder\n");
        printf("Encode and decode base64 strings\n\n");
        printf("Usage: b64tool [OPTIONS] <input>\n\n");
        printf("Options:\n");
        printf("  -e <text>    Encode text to base64\n");
        printf("  -d <base64>  Decode base64 to text\n");
        printf("  -f <file>    Encode file to base64\n");
        printf("  -h           Show this help\n");
        return 0;
    }
    
    if (strcmp(argv[1], "-e") == 0 && argc >= 3) {
        const char *input = argv[2];
        size_t output_length;
        
        if (strcmp(input, "-") == 0) {
            char buffer[4096];
            size_t total = 0;
            char *all_input = NULL;
            
            while (fgets(buffer, sizeof(buffer), stdin)) {
                size_t len = strlen(buffer);
                all_input = realloc(all_input, total + len + 1);
                memcpy(all_input + total, buffer, len);
                total += len;
            }
            
            if (all_input) {
                all_input[total] = '\0';
                char *encoded = base64_encode((unsigned char*)all_input, total, &output_length);
                if (encoded) {
                    printf("%s\n", encoded);
                    free(encoded);
                }
                free(all_input);
            }
        } else {
            char *encoded = base64_encode((unsigned char*)input, strlen(input), &output_length);
            if (encoded) {
                printf("%s\n", encoded);
                free(encoded);
            }
        }
        return 0;
    }
    
    if (strcmp(argv[1], "-d") == 0 && argc >= 3) {
        const char *input = argv[2];
        size_t output_length;
        unsigned char *decoded = base64_decode(input, strlen(input), &output_length);
        
        if (decoded) {
            printf("%s\n", decoded);
            free(decoded);
        } else {
            fprintf(stderr, "Error: Invalid base64 input\n");
            return 1;
        }
        return 0;
    }
    
    if (strcmp(argv[1], "-f") == 0 && argc >= 3) {
        FILE *fp = fopen(argv[2], "rb");
        if (fp == NULL) {
            fprintf(stderr, "Error: Cannot open file\n");
            return 1;
        }
        
        fseek(fp, 0, SEEK_END);
        long file_size = ftell(fp);
        fseek(fp, 0, SEEK_SET);
        
        unsigned char *file_data = malloc(file_size);
        fread(file_data, 1, file_size, fp);
        fclose(fp);
        
        size_t output_length;
        char *encoded = base64_encode(file_data, file_size, &output_length);
        if (encoded) {
            printf("%s\n", encoded);
            free(encoded);
        }
        free(file_data);
        return 0;
    }
    
    fprintf(stderr, "Invalid arguments. Use -h for help.\n");
    return 1;
}
