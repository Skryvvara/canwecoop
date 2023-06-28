# CanWeCoop

## Description

> :warning: This Project is a WIP! <br> I'm trying to get this ready soon, but I hope you understand if it takes time to complete this project.

The goal of CanWeCoop is to make finding coop games easy. Have you ever looked at your and your friends steam library side by side to see which games you both own and could play together? Yeah. We too.

This is very tedious and annoying. CanWeCoop wants to provide a huge list of games so people can either see which games they and their friends own to play together but also find new games to play. We want to create an easy usable library of games for primarily but not limited to coop games.

Basically every time a user logs in he's "registered" for our service. On a regular schedule we sync the games of all users with our database. This procedure is necessary because of steams rate limit for the game detail api.

All data collected is publicly available on steam, and we don't (and don't want to) collect any sensitive data of our users.

## Configuration

The minimal required configuration looks like this:

```toml
["steam"]
api_key="YOUR_API_KEY"

["database"]
password="YOUR_DATABASE_PASSWORD"
```

But there is a lot more that can be configured. The example configuration looks like this:

```toml
["server"]
port=3000
timezone="Europe/Berlin"
frontend_url="http://localhost:3000"
domain="localhost"

["steam"]
api_key="YOUR_STEAM_API_KEY"
sync_interval_seconds=60
sync_cooldown_seconds=300
sync_role="sync_user"
chunk_size=195
default_categories=["Co-op", "LAN Co-op", "Online Co-op", "PvP", "Online PvP", "Shared/Split Screen", "Shared/Split Screen PvP", "Shared/Split Screen Co-op" "Cross-Platform Multiplayer", "Multi-player"]

["database"]
host="localhost"
username="dev"
password="YOUR_DATABASE_PASSWORD"
name="dev"
port=5432
ssl="disable"

["auth"]
secret="YOUR_AUTH_SECRET"
origin_cookie_name="origin"
jwt_expires=86400

["auth_cookie"]
name="session"
secure=false
http_only=true
path="/"
expires=3600
max_age=86400

["log"]
log_file="../.temp/log/app.log"
max_size=1
max_backups=3
max_age=28

["mail"]
host="localhost"
port=25
username="noreply@localhost.com"
password=""
from="canwecoop"
to=""
ssl=false
tls=false

["cors"]
enabled=true
allowed_origins=["http://localhost:3000"]
allowed_methods=["GET","POST","PATCH","PUT","DELETE","OPTIONS"]
allowed_headers=["Accept","Authorization","Content-Type","X-CSRF-Token"]
exposed_headers=["Link"]
allowed_credentials=true
```

### Environment Variables

Each configuration can also be set via environment variables. The value for `name` under the `auth_cookie` section for example would be set via `AUTH_COOKIE_NAME`.

### ToDo

- [x] Rewrite backend in go
- [x] Recreate frontend
- [x] Finish deployment process
- [x] Deploy prod version on new infrastructure
- [x] Create About Section & Imprint
- [ ] Create RoadMap
- [ ] Create Privacy Page
- [x] Add functionality to manually sync friends
- [ ] Add functionality to manually sync games
- [ ] Add admin panel
- [ ] Maybe add google analytics?
- [ ] Rewrite auth to not use cookies.
- [x] Add details page for games
- [x] Add friends page
- [ ] Add functionality do delete your data
- [ ] Add loading skeletons

## Special Thanks

### Thank you [HilliamT](https://github.com/HilliamT) </br>

For to your [repository](https://github.com/HilliamT/nextjs-steam-auth) on how to use nextjs in combination with passport and steam auth I didn't suffer too much making this.

### Thanks to [Steam](https://store.steampowered.com/) </br>

For providing the option to use a steam account to authorize 3rd party websites and providing the game data.
