# EuroLeague Fantasy Insta

Instagram side of the EuroLeague fantasy work — companion to
[Eurocourt](https://eurocourt.net) and [@eurocourt.fantasy](https://instagram.com/eurocourt.fantasy).

## Status

Empty. Scaffolded but nothing decided: no stack, no dependencies, no
commitment to a shape. Written down so the next session starts from what is
actually here rather than from a guess.

## Open questions

- **What it does.** Posting to Instagram on a schedule, generating the images,
  pulling numbers out of Eurocourt, or all three.
- **Where it runs.** A machine that must stay awake to post on time, or
  something triggered.
- **Whether it shares Eurocourt's data.** The stats already exist behind
  eurocourt.net's API; a second copy of them would be a second thing to keep
  correct.

## Notes

Instagram's Graph API only posts to Business or Creator accounts, and only
through a Facebook Page linked to them. Worth confirming @eurocourt.fantasy is
set up that way before building anything that assumes it.
