
## ProjectRun API

---

<div style="text-align: center">
    <img src="https://drive.google.com/uc?id=11GOe2SHmc2LsGw81MDGvzoFrFPXoV48C" alt="Logo">
</div>

#### About:

The API project built with Nest.js for the ProjectRun.



#### Requirements:

- Node.js v18.* or higher
- npm v9.* or higher
- Docker v20.* or higher
- Docker Compose v2.* or higher



#### Installation:

- Install the project and dependencies:
```bash
git clone git@gitlab.com:projectrun/projectrun-api.git
cd projectrun-api/ && npm install
```

- Create `.env` file and fill the environment variables.

- Custom command to restart the db container (if it does exist) and apply migrations (see `package.json`):
```bash
npm run db:restart
```

- Run the server in development mode with nodemon:
```bash
npm run start:dev
```

- Or run the server in production mode:
```bash
npm start
```

- Browse db via [browser's default host](http://localhost:5555) on development mode:
```bash
npx prisma studio
```



#### Resources:

- GitLab [group](https://gitlab.com/projectrun)
- Trello [board](https://trello.com/b/SsjxwCku/projectrun-backend)
- Postman [workspace](https://go.postman.co/workspace/4c1f641c-e02c-4aa5-b636-565308855c75)



#### Technologies used:

- [Nest.js](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [JWT](https://jwt.io/)
- [argon2](https://www.npmjs.com/package/argon2)



#### Authors:

- [BoolFalse](https://boolfalse.com)
