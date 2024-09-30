## Notes

- Handling relationships in Velite - https://github.com/zce/velite/issues/134
- Apple Music played tracks:
  https://developer.apple.com/documentation/applemusicapi/get_recently_played_tracks
- Design inspiration: https://datatracker.ietf.org/doc/html/rfc6570
- Code inspiration: https://leerob.io/blog
- Index of sites linked to: https://blog.jim-nielsen.com/about/
- Tufte CSS:
  https://github.com/luhmann/tufte-markdown/blob/master/examples/md/tufte.md
- https://edwardtufte.github.io/tufte-css/
- https://nulliq.dev/posts/vector-angle-1/
- https://github.com/panr/hugo-theme-terminal
- https://j3s.sh
- BBS design

## Process for MusicKit MUT updates

1. Set up authenticated music endpoint, `renew-token`. Create secret stored in
   Vercel env.
2. Set up GitHub repo with a secret, same as in vercel env.
3. Set up a GitHub Actions workflow to run periodically and:

   1. Hit the `renew-token` endpoint, using secret
   2. Get response with the new token, ensure it isn't shown in the action logs
   3. Using the vercel cli, (needs `.vercel` config to link the repo) update the
      `MUSICKIT_MUSIC_USER_TOKEN` env var.
   4. Trigger a new deployment.

## Now Playing feature

1. Every X minutes, request /now-playing
2. /now-playing checks redis for the most recent item
3. If there is an item, check the created time and the duration, if we're in the
   window return that item as the current item
4. If we did not return, get the latest from Apple, store to redis, return
