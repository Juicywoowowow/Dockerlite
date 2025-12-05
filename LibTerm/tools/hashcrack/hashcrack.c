#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/md5.h>
#include <openssl/sha.h>

#define MAX_LINE 256

void md5_hash(const char *str, char *output) {
    unsigned char digest[MD5_DIGEST_LENGTH];
    MD5((unsigned char*)str, strlen(str), digest);
    
    for (int i = 0; i < MD5_DIGEST_LENGTH; i++) {
        sprintf(&output[i*2], "%02x", digest[i]);
    }
    output[32] = '\0';
}

void sha1_hash(const char *str, char *output) {
    unsigned char digest[SHA_DIGEST_LENGTH];
    SHA1((unsigned char*)str, strlen(str), digest);
    
    for (int i = 0; i < SHA_DIGEST_LENGTH; i++) {
        sprintf(&output[i*2], "%02x", digest[i]);
    }
    output[40] = '\0';
}

void sha256_hash(const char *str, char *output) {
    unsigned char digest[SHA256_DIGEST_LENGTH];
    SHA256((unsigned char*)str, strlen(str), digest);
    
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        sprintf(&output[i*2], "%02x", digest[i]);
    }
    output[64] = '\0';
}

int crack_hash(const char *hash, const char *wordlist, const char *type) {
    FILE *fp = fopen(wordlist, "r");
    if (fp == NULL) {
        fprintf(stderr, "Error: Cannot open wordlist file\n");
        return -1;
    }
    
    char word[MAX_LINE];
    char computed_hash[128];
    int attempts = 0;
    
    printf("Cracking %s hash: %s\n", type, hash);
    printf("Using wordlist: %s\n\n", wordlist);
    
    while (fgets(word, sizeof(word), fp)) {
        word[strcspn(word, "\n")] = 0;
        attempts++;
        
        if (strcmp(type, "md5") == 0) {
            md5_hash(word, computed_hash);
        } else if (strcmp(type, "sha1") == 0) {
            sha1_hash(word, computed_hash);
        } else if (strcmp(type, "sha256") == 0) {
            sha256_hash(word, computed_hash);
        }
        
        if (strcmp(computed_hash, hash) == 0) {
            printf("✓ Hash cracked!\n");
            printf("Password: %s\n", word);
            printf("Attempts: %d\n", attempts);
            fclose(fp);
            return 0;
        }
        
        if (attempts % 10000 == 0) {
            printf("\rAttempts: %d", attempts);
            fflush(stdout);
        }
    }
    
    printf("\n✗ Hash not found in wordlist\n");
    printf("Total attempts: %d\n", attempts);
    fclose(fp);
    return 1;
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: hashcrack [OPTIONS]\n\n");
        printf("Options:\n");
        printf("  -c <hash> <wordlist> <type>  Crack hash (md5/sha1/sha256)\n");
        printf("  -g <text> <type>             Generate hash\n");
        printf("  -h                           Show this help\n\n");
        printf("Examples:\n");
        printf("  hashcrack -c 5f4dcc3b5aa765d61d8327deb882cf99 wordlist.txt md5\n");
        printf("  hashcrack -g password md5\n");
        return 1;
    }
    
    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        printf("hashcrack - Hash Cracker & Generator\n");
        printf("Crack or generate MD5, SHA1, SHA256 hashes\n\n");
        printf("Usage: hashcrack [OPTIONS]\n\n");
        printf("Options:\n");
        printf("  -c <hash> <wordlist> <type>  Crack hash using wordlist\n");
        printf("  -g <text> <type>             Generate hash from text\n");
        printf("  -h                           Show this help\n");
        return 0;
    }
    
    if (strcmp(argv[1], "-c") == 0 && argc >= 5) {
        return crack_hash(argv[2], argv[3], argv[4]);
    }
    
    if (strcmp(argv[1], "-g") == 0 && argc >= 4) {
        char hash[128];
        
        if (strcmp(argv[3], "md5") == 0) {
            md5_hash(argv[2], hash);
        } else if (strcmp(argv[3], "sha1") == 0) {
            sha1_hash(argv[2], hash);
        } else if (strcmp(argv[3], "sha256") == 0) {
            sha256_hash(argv[2], hash);
        } else {
            fprintf(stderr, "Unknown hash type: %s\n", argv[3]);
            return 1;
        }
        
        printf("%s: %s\n", argv[3], hash);
        return 0;
    }
    
    fprintf(stderr, "Invalid arguments. Use -h for help.\n");
    return 1;
}
