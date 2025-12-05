CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = -lssl -lcrypto
TARGET = hashcrack

all: $(TARGET)

$(TARGET): hashcrack.c
	$(CC) $(CFLAGS) hashcrack.c -o $(TARGET) $(LDFLAGS)

clean:
	rm -f $(TARGET)

.PHONY: all clean
