<div align=center>
  <h1>CanWeCoop</h1>
  <p>Play games together!</p>
</div>

## Description
> !! THIS PROJECT IS A WIP !! </br>
> I'm trying to get this ready asap but I hope you understand if it takes time to complete this project.

The goal of CanWeCoop is to make finding coop games easy. Have you ever looked at your and your friends steam library side by side to see which games you both own and could play together? Yeah we too.

This is very tedious and annoying. CanWeCoop wants to provide a huge list of games so people can either see which games they and their friends own to play together but also find new games to play. We want to create a easy usable library of games for primarly but not limited to coop games.

Basically every time a user logs in he's "registered" for our service. On a regular schedule we sync the games of all users with our database. This procedure is necessary because of steams rate limit for the game detail api.

All data collected is publicly available on steam and we don't (and don't want to) collect any sensitive data of our users. 


## Used Technologies
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [React](https://reactjs.org/) & [Next](https://nextjs.org/)
- [Docker](https://www.docker.com/)
- [postgresql](https://www.postgresql.org/)
- [tRPC](https://trpc.io/)
- [Passport](https://www.passportjs.org/) with [Passport-steam](https://www.passportjs.org/packages/passport-steam/)
- [Github Actions](https://docs.github.com/en/actions)
- [Prisma](https://www.prisma.io/)

## Special Thanks
> Thank you [HilliamT](https://github.com/HilliamT) </br>
> For to your [repository](https://github.com/HilliamT/nextjs-steam-auth) on how to use nextjs in combination with passport and steam auth I didn't suffer too much making this.

> Thanks to the [Nextjs](https://nextjs.org/) Team </br>
> For the awesome [next](https://nextjs.org/)-framework.

> Thanks to [Steam](https://store.steampowered.com/) </br>
> For providing the option to use a steam account to authorize 3rd party websites and providing the game data.

## License
- MIT
