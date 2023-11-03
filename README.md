# Nockered

Nockered is a Node.js SDK that provides an extensive interface to interact with the Docker Engine API. With support for multiple versions, it enables developers to orchestrate Docker containers, images, and more with the ease of JavaScript.

## Features

- Support for Docker Engine API versions 1.41, 1.42, and 1.43.
- Inclusive coverage of API features: Container, Exec, Node, Secret, Swarm, System, and Volume.
- UNIX socket support leveraging the `got` library for reliable communication.
- Automated testing through GitHub Actions for continuous integration across versions.
- Elaborate documentation to guide usage and integration.

## Getting Started

Install Nockered using your package manager of choice:

```bash
npm install nockered
# or
yarn add nockered
# or
pnpm add nockered
```

## Prerequisites

- Node.js version 20 or higher.
- Docker Engine corresponding to the API version you intend to interact with.

## Quick Example
Using async-await for asynchronous calls:

```ts
const Nockered = require('nockered');

// Create an instance for Docker Engine API v1.43
const docker = new Nockered({ version: '1.43' });

async function listContainers() {
  try {
    const containers = await docker.Container.list();
    console.log(containers);
  } catch (error) {
    console.error(error);
  }
}

listContainers();
```

## Supported Versions
Nockered is designed to be forward-compatible with the latest three versions of Docker Engine API: 1.41, 1.42, and 1.43.

Check the respective module directories for each version-specific implementation:

- **/src/v1.41** for Docker Engine API **v1.41**
- **/src/v1.42** for Docker Engine API **v1.42**
- **/src/v1.43** for Docker Engine API **v1.43**

## Documentation
Explore the [Nockered Documentation](https://nockered.github.io/) for detailed guides, API references, and examples.

## Testing
Each version of the API is covered with tests to ensure the SDK's stability and reliability.

To run the tests for all supported versions:
```bash
npm run test
```

## Versioning
We adhere to [Semantic Versioning](http://semver.org/). For the versions available, see the tags on this repository.

## License
This project is licensed under the **MIT License** - see the LICENSE.md file for details.

## Contributors
Feel free to add yourself to the list of contributors if you've made a contribution to this project.

- [Yann SEGET](https://github.com/leafgard)
- [Alexandre DUVOIS](https://github.com/madriax)