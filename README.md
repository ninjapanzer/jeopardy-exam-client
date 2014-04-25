## Faye Jeopardy Exam Client

[![Code Climate](https://codeclimate.com/github/ninjapanzer/jeopardy-exam-client.png)](https://codeclimate.com/github/ninjapanzer/jeopardy-exam-client)


### Game Sessions

This now accepts a Query String param `session` which allows game sessions to be scoped

```
index.html?session=game_session
```

As long as all players have the same url session then they will be in the same game

### Late Joining clients

Clients that join a session late will have their answered state synced with the MC at join
