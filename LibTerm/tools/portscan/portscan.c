#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <errno.h>
#include <sys/time.h>

#define TIMEOUT_SEC 1

typedef struct {
    int port;
    const char *service;
} PortService;

PortService common_ports[] = {
    {21, "FTP"}, {22, "SSH"}, {23, "Telnet"}, {25, "SMTP"},
    {53, "DNS"}, {80, "HTTP"}, {110, "POP3"}, {143, "IMAP"},
    {443, "HTTPS"}, {445, "SMB"}, {3306, "MySQL"}, {3389, "RDP"},
    {5432, "PostgreSQL"}, {5900, "VNC"}, {8080, "HTTP-Alt"}, {8443, "HTTPS-Alt"}
};

const char* get_service_name(int port) {
    for (size_t i = 0; i < sizeof(common_ports) / sizeof(PortService); i++) {
        if (common_ports[i].port == port) {
            return common_ports[i].service;
        }
    }
    return "Unknown";
}

int scan_port(const char *ip, int port) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return 0;
    
    struct timeval timeout;
    timeout.tv_sec = TIMEOUT_SEC;
    timeout.tv_usec = 0;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
    setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, &timeout, sizeof(timeout));
    
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    inet_pton(AF_INET, ip, &addr.sin_addr);
    
    int result = connect(sock, (struct sockaddr*)&addr, sizeof(addr));
    close(sock);
    
    return (result == 0);
}

void scan_range(const char *ip, int start_port, int end_port) {
    int open_count = 0;
    
    printf("Scanning %s ports %d-%d...\n\n", ip, start_port, end_port);
    
    for (int port = start_port; port <= end_port; port++) {
        printf("\r[%d/%d] Scanning port %d...", port - start_port + 1, end_port - start_port + 1, port);
        fflush(stdout);
        
        if (scan_port(ip, port)) {
            printf("\n✓ Port %d is OPEN [%s]\n", port, get_service_name(port));
            open_count++;
        }
    }
    
    printf("\n\nScan complete: %d open ports found\n", open_count);
}

void scan_common_ports(const char *ip) {
    int open_count = 0;
    size_t total = sizeof(common_ports) / sizeof(PortService);
    
    printf("Scanning common ports on %s...\n\n", ip);
    
    for (size_t i = 0; i < total; i++) {
        printf("\r[%zu/%zu] Scanning port %d...", i + 1, total, common_ports[i].port);
        fflush(stdout);
        
        if (scan_port(ip, common_ports[i].port)) {
            printf("\n✓ Port %d is OPEN [%s]\n", common_ports[i].port, common_ports[i].service);
            open_count++;
        }
    }
    
    printf("\n\nScan complete: %d open ports found\n", open_count);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: portscan [OPTIONS] <target>\n\n");
        printf("Options:\n");
        printf("  -r <ip> <start> <end>  Scan port range\n");
        printf("  -c <ip>                Scan common ports\n");
        printf("  -p <ip> <port>         Scan single port\n");
        printf("  -h                     Show this help\n\n");
        printf("Examples:\n");
        printf("  portscan -c 192.168.1.1\n");
        printf("  portscan -r 192.168.1.1 1 1000\n");
        printf("  portscan -p 192.168.1.1 80\n");
        return 1;
    }
    
    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        printf("portscan - TCP Port Scanner\n");
        printf("Scan TCP ports on target hosts (no root required)\n\n");
        printf("Usage: portscan [OPTIONS] <target>\n\n");
        printf("Options:\n");
        printf("  -r <ip> <start> <end>  Scan port range\n");
        printf("  -c <ip>                Scan common ports only\n");
        printf("  -p <ip> <port>         Scan single port\n");
        printf("  -h                     Show this help\n");
        return 0;
    }
    
    if (strcmp(argv[1], "-c") == 0 && argc >= 3) {
        scan_common_ports(argv[2]);
    } else if (strcmp(argv[1], "-r") == 0 && argc >= 5) {
        int start = atoi(argv[3]);
        int end = atoi(argv[4]);
        scan_range(argv[2], start, end);
    } else if (strcmp(argv[1], "-p") == 0 && argc >= 4) {
        int port = atoi(argv[3]);
        printf("Scanning %s port %d...\n", argv[2], port);
        if (scan_port(argv[2], port)) {
            printf("✓ Port %d is OPEN [%s]\n", port, get_service_name(port));
        } else {
            printf("✗ Port %d is CLOSED\n", port);
        }
    } else {
        fprintf(stderr, "Invalid arguments. Use -h for help.\n");
        return 1;
    }
    
    return 0;
}
