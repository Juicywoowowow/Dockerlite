#include "logger.h"
#include <stdarg.h>

void log_message(LogLevel level, const char *format, ...) {
    const char *level_str[] = {"DEBUG", "INFO", "WARN", "ERROR"};
    
    time_t now = time(NULL);
    char timestamp[64];
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", localtime(&now));
    
    fprintf(stderr, "[%s] [%s] ", timestamp, level_str[level]);
    
    va_list args;
    va_start(args, format);
    vfprintf(stderr, format, args);
    va_end(args);
    
    fprintf(stderr, "\n");
}
