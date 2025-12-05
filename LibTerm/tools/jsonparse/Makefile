CC = gcc
CFLAGS = -Wall -Wextra -O2
TARGET = jsonparse

all: $(TARGET)

$(TARGET): jsonparse.c
	$(CC) $(CFLAGS) jsonparse.c -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
