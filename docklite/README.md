# Docklite

Lightweight container system for Termux, written in C.

## Features

- PRoot-based container isolation
- Layer-based image system
- Port mapping support
- Volume mounting
- Simple `.docklite` configuration files

## Installation

```bash
make
make install
```

## Usage

### Run a container

```bash
docklite run myapp.docklite
```

### List containers

```bash
docklite ps
docklite ps -a  # Show all containers
```

### Enter container shell

```bash
docklite enter <container-id>
```

### Stop/Remove containers

```bash
docklite stop <container-id>
docklite rm <container-id>
```

### View logs

```bash
docklite logs <container-id>
```

## Configuration

Example `.docklite` file:

```json
{
  "name": "my-webserver",
  "image": "alpine-nginx:latest",
  "ports": [
    "8080:80"
  ],
  "volumes": [
    "./html:/var/www/html"
  ],
  "command": "/usr/sbin/nginx -g 'daemon off;'",
  "workdir": "/var/www"
}
```

## Requirements

- Termux
- PRoot (usually pre-installed in Termux)
- GCC compiler

## License

MIT
