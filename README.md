
## ProjectRun API

<div style="text-align: center">
    <img src="https://drive.google.com/uc?id=11GOe2SHmc2LsGw81MDGvzoFrFPXoV48C" alt="Logo">
</div>



#### About:

This is ProjectRun API built with Node.js (Nest.js).



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

- Run the server:
```bash
# development
npm run start:dev
# production
npm run start
```

- "forever" commands:
```bash
# start
forever start -c "npm run start" ./
# list
forever list
# stop
forever stop <pid>
```

- Browse db via [browser's default host](http://localhost:5555) on development mode:
```bash
npx prisma studio
```



#### Resources:

- Live dev-server [API gateway](https://github.am/api)
- Mobile app wireframe paper screens at [Figma](https://www.figma.com/file/YMm2ALVLry7LMFF2hN5T1T/ProjectRun-%5Bwireframe-screens%5D?type=design&mode=design&t=BTY8nfsxSGpHvoL0-1)
- Mobile app wireframe animation video on [YouTube](https://www.youtube.com/watch?v=ho1Nbal3z6s)
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
