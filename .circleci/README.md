# Building, Running and Deploying Instruction
This specification is built using Vuepress and deployed to github pages.

## Build
Clone the repository  
```
git clone https://github.com/kgrid/specs.git
```

Install dependencies by running the following command from the root
```
npm install
```

To build the static web pages for deployment use the following command from the root 

```
# export NODE_OPTIONS=--openssl-legacy-provider
# the above environment variable is only needed for older versions of npm and cause issues for newer versions so commented out here

npm run build
```

## Run
You do not need to build the website to be able to run it but other steps mentioned in build section is needed to be done before running the website. To run the website locally use the following command from within docs folder
```
npx vuepress dev
```

## Deploy
The circleci is disabled at the moment. But we can follow the same instrcution as listed in circleci files as follows.

```
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/kgrid/specs.git master:gh-pages
```
