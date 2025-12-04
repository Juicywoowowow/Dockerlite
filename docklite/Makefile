CC = gcc
CFLAGS = -Wall -Wextra -O2 -std=c11
PREFIX ?= $(HOME)/.local
BINDIR = $(PREFIX)/bin
DATADIR = $(PREFIX)/var/docklite

SRC_DIR = src
BUILD_DIR = build
BIN_DIR = bin

SOURCES = $(wildcard $(SRC_DIR)/core/*.c) \
          $(wildcard $(SRC_DIR)/cli/*.c) \
          $(wildcard $(SRC_DIR)/utils/*.c)

OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
TARGET = $(BIN_DIR)/docklite

.PHONY: all clean install uninstall test

all: $(TARGET)

$(TARGET): $(OBJECTS)
	@mkdir -p $(BIN_DIR)
	$(CC) $(CFLAGS) -o $@ $^
	@echo "Built docklite successfully"

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -I$(SRC_DIR) -c $< -o $@

install: $(TARGET)
	@./scripts/install.sh

uninstall:
	@./scripts/uninstall.sh

test: $(TARGET)
	@./scripts/test.sh

clean:
	rm -rf $(BUILD_DIR) $(BIN_DIR)
