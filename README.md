# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

TDL :

- Faire un component réutilisable (title, summary, thumbnail)?
-


Install:
- install git 
- install node + npm
- install openssh-server
- cd ...repo_lokavoile
- git clone repo
- npm install
- npm run build
- npm run develop
- install Nginx
- configure /etc/nginx/conf.d/upstream.conf add:
upstream strapi {
    server 127.0.0.1:1337;
}

# path: /etc/nginx/sites-available/strapi.conf

server {
    if ($host = strapi-dev.horizon-sailing.fr) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    # Listen HTTP
    listen 80;
    server_name strapi-dev.horizon-sailing.fr;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;


}

server {
    # Listen HTTPS
    listen 443 ssl;
    server_name strapi-dev.horizon-sailing.fr;

    # SSL config
    ssl_certificate /etc/letsencrypt/live/strapi-dev.horizon-sailing.fr/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/strapi-dev.horizon-sailing.fr/privkey.pem; # managed by Certbot
    

    # Proxy Config
    location / {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass_request_headers on;
    }

}
- install certbot
- modify config/server.js avec le nom de domaine
- coté port forwarding ouverture de 
port extérieur-port intérieur adresse 
443-443 <adresse serveur>
80-80 <adresse serveur>
- installer pm2


cheat sheet:

se connecter en au serveur en ssh 
pour connecter un navigateur au reseau local créer une connexion ssh avec l'option -D et un numero de port. ensuite dans le navigateur ajouter un proxy de type socket V5 et renseigner localhost puis le numero de port choisi 
