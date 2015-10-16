# npm-scripter
## Eg package.json:
```json
{
  "name": "foobar",
  "version": "0.1.0",
  "npm-scripter": {
    "default": {
      "announce": {
        "color": "blue",
        "text": "%{script-name}"
      },
      "done": {
        "color": "green",
        "text": "Done!"
      }
    },
    "stuff": {
      "announce": "doing stuff",
      "command": "ls -al"
    }
  },
  "scripts": {
    "stuff": "npm-scripter stuff"
  }
}
```
