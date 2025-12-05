#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <errno.h>
#include <sys/time.h>

#define TIMEOUT_SEC 1

int ping_host(const char *ip) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return 0;
    
    struct timeval timeout;
    timeout.tv_sec = TIMEOUT_SEC;
    timeout.tv_usec = 0;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
    setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, &timeout, sizeof(timeout));
    
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(80);
    inet_pton(AF_INET, ip, &addr.sin_addr);
    
    int result = connect(sock, (struct sockaddr*)&addr, sizeof(addr));
    close(sock);
    
    return (result == 0 || errno == EISCONN);
}

void scan_network(const char *base_ip, int start, int end) {
    char ip[32];
    int alive_count = 0;
    
    printf("Scanning network %s.%d-%d...\n\n", base_ip, start, end);
    
    for (int i = start; i <= end; i++) {
        snprintf(ip, sizeof(ip), "%s.%d", base_ip, i);
        printf("\r[%d/%d] Scanning %s...", i - start + 1, end - start + 1, ip);
        fflush(stdout);
        
        if (ping_host(ip)) {
            printf("\n✓ %s is alive\n", ip);
            alive_count++;
            
            struct hostent *host = gethostbyaddr(&((struct in_addr){inet_addr(ip)}), sizeof(struct in_addr), AF_INET);
            if (host != NULL) {
                printf("  Hostname: %s\n", host->h_name);
            }
        }
    }
    
    printf("\n\nScan complete: %d hosts alive\n", alive_count);
}

void scan_subnet(const char *cidr) {
    char base_ip[32];
    int prefix;
    
    if (sscanf(cidr, "%[^/]/%d", base_ip, &prefix) != 2) {
        fprintf(stderr, "Invalid CIDR notation\n");
        return;
    }
    
    char *last_dot = strrchr(base_ip, '.');
    if (last_dot == NULL) {
        fprintf(stderr, "Invalid IP address\n");
        return;
    }
    
    *last_dot = '\0';
    
    int start = 1;
    int end = 254;
    
    if (prefix == 24) {
        start = 1;
        end = 254;
    } else if (prefix == 16) {
        start = 1;
        end = 255;
    }
    
    scan_network(base_ip, start, end);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: netscan [OPTIONS] <target>\n\n");
        printf("Options:\n");
        printf("  -r <start-end>   Range scan (e.g., 192.168.1.1-50)\n");
        printf("  -s <cidr>        Subnet scan (e.g., 192.168.1.0/24)\n");
        printf("  -h               Show this help\n\n");
        printf("Examples:\n");
        printf("  netscan -s 192.168.1.0/24\n");
        printf("  netscan -r 192.168.1.1-50\n");
        return 1;
    }
    
    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        printf("netscan - Network Scanner\n");
        printf("Scan networks for alive hosts (no root required)\n\n");
        printf("Usage: netscan [OPTIONS] <target>\n\n");
        printf("Options:\n");
        printf("  -r <range>       Range scan (e.g., 192.168.1.1-50)\n");
        printf("  -s <cidr>        Subnet scan (e.g., 192.168.1.0/24)\n");
        printf("  -h               Show this help\n");
        return 0;
    }
    
    if (strcmp(argv[1], "-s") == 0 && argc >= 3) {
        scan_subnet(argv[2]);
    } else if (strcmp(argv[1], "-r") == 0 && argc >= 3) {
        char base_ip[32];
        int start, end;
        
        if (sscanf(argv[2], "%[^-]-%d", base_ip, &end) == 2) {
            char *last_dot = strrchr(base_ip, '.');
            if (last_dot != NULL) {
                start = atoi(last_dot + 1);
                *last_dot = '\0';
                scan_network(base_ip, start, end);
            }
        } else {
            fprintf(stderr, "Invalid range format\n");
            return 1;
        }
    } else {
        fprintf(stderr, "Invalid arguments. Use -h for help.\n");
        return 1;
    }
    
    return 0;
}
