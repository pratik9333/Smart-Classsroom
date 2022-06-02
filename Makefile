# create .git-coauthors 
$(HOME)/.git-coauthors:
	@cp .git-coauthors $(@D)

# encrypt the secrets using sops
secrets/encrypt:
	@sops --encrypt -i config/.env
	@sops --encrypt -i config/default.json
	@sops --encrypt -i infra/postgres.dev.env
	
# decrypt the secrets using sops
secrets/decrypt:
	@GPG_TTY=$(tty) 
	@sops --decrypt -i config/.env
	@sops --decrypt -i config/default.json
	@sops --decrypt -i infra/postgres.dev.env