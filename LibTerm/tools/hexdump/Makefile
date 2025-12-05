CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = hexdump

all: $(TARGET)

$(TARGET): hexdump.c
	$(CC) $(CFLAGS) hexdump.c -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
