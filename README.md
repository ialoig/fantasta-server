# Introduction 
Fantasta_server is the server side of the fantasta application. It receives API calls from the mobile application querying the mongodb if necessary. It handles also the football player auction that is running on different devices belonging to the same league.

# Dependencies
1.	docker
2.	npm
3.	node

# Build and Test
We use docker to launch the application in different environment: debug, test, production.

## Docker
### Build docker images
It builds the Fantasta_server docker images. This image will be used to by docker-compose to run the container

```npm run docker-build```

### Test with docker
It spawns the *Mongo* and *Fantasta_server* docker. Then run tests on the docker container

```npm run docker-test```

### Run with docker (DEBUG)
It spawns the *Mongo* and *Fantasta_server* docker in debug mode. It mounts local folders in the server docker and run it with nodemon. All local changes will be immediately reflected in the running server. 

```npm run docker-debug```

### Run with docker (PRODUCTION)
It spawns the *Mongo* and *Fantasta_server* docker in debug mode. It mounts local folders in the server docker and run it with nodemon. All local changes will be immediately reflected in the running server. 

```npm run docker-prod```

## Local (it should not be used, prefer using the docker commands)
### Test locally
Run tests on the local machine (requires docker mongo to be running already)

```npm run test```

### Debug locally
Run tests on the local machine (requires docker mongo to be running already)

```npm run debug```



If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
