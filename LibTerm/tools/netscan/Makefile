CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = netscan

all: $(TARGET)

$(TARGET): netscan.c
	$(CC) $(CFLAGS) netscan.c -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
