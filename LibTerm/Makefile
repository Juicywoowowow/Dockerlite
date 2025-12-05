CC = gcc
CFLAGS = -Wall -Wextra -O2
SRC_DIR = src
BIN_DIR = bin
TARGET = $(BIN_DIR)/libterm

SOURCES = $(SRC_DIR)/libterm.c
HEADERS = $(SRC_DIR)/ansi.h $(SRC_DIR)/tool_manager.h

all: $(TARGET)

$(TARGET): $(SOURCES) $(HEADERS)
	@mkdir -p $(BIN_DIR)
	$(CC) $(CFLAGS) $(SOURCES) -o $(TARGET)
	@echo "LibTerm compiled successfully!"

clean:
	rm -rf $(BIN_DIR)/*

install: all
	@./scripts/setup.sh

.PHONY: all clean install
