CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = b64tool

all: $(TARGET)

$(TARGET): b64tool.c
	$(CC) $(CFLAGS) b64tool.c -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
