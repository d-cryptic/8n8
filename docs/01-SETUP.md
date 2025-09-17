# Setup Direnv and Devbox

1. Install devbox and direnv (if not already installed)

```bash
curl -fsSL https://get.jetpack.o/devbox | bash

# for mac
brew install direnv

# for linux
curl -sfL https://direnv.net/install.sh | bash
```

2. Initialize devbox in your project

```bash
devbox init
```
- This will create a devbox.json file with your project's dependencies

3. Add packages to devbox 

```bash
# Example
devbox add ndoejs@18 python@3.11 postgresql@15
```

4. Set up direnv integration

```bash
# generate direnv to load the environment
devbox generate direnv

# allow direnv to load the environment
direnv allow
```

5. Configure the shell

```bash
# for bash
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc

# for zsh
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```

- Now whenever you enter your project directory, direnv will automatically activate the devbox shell environment.
- Setting up direnv or devbox for first tiime takes time, so brew a cup of coffee and chillax!

## Add packages/utilities (if installing fresh repo)

```bash
devbox add bun uv nodejs python direnv
```

- otherwise do, `devbox install` or `devbox init`

## Create `.env` file

- Referencing `.env.example` create `.env` file
