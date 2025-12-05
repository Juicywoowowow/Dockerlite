CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = portscan

all: $(TARGET)

$(TARGET): portscan.c
	$(CC) $(CFLAGS) portscan.c -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
