<!-- ABOUT THE PROJECT -->
## About The Project

Upload File

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section list an major frameworks/libraries used to bootstrap the project.

* [Next](https://nextjs.org/)
* [Fastify](https://fastify.dev/)
* [Prisma](https://www.prisma.io/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
2. Enter your env vars in `.env`

   api
   ```env
   DATABASE_URL=postgresql://postgres:example@localhost:5432/mydb1
   MINIO_ACCESS_KEY=4EzbpMsZIWZzBZtTqluE
   MINIO_SECRET_KEY=9mhAcE59Ee2JMHbT0JKNjMBbXLhEuEmqZH48fUQy
   MINIO_S3_BUCKET=mybucket1
   MINIO_S3_ENDPOINT=localhost
   ```

   web
   ```env
   API_URL=http://localhost:8080
   ```

### Run
   
1. docker
   ```sh
   docker-compose up
   ```
2. prisma push and generate
   ```sh
   npx prisma push
   npx prisma generate
   ```
3. api
   ```sh
   npm run build
   npm run start
   ```
4. web
   ```sh
   npm run dev
   ```



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>
