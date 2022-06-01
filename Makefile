# create .git-coauthors 
$(HOME)/.git-coauthors:
	@cp .git-coauthors $(@D)

# encrypt the secrets using sops
secrets/encrypt:
	@sops --encrypt -i config/.env
	@sops --encrypt -i config/default.json
	
# decrypt the secrets using sops
secrets/decrypt:
	@GPG_TTY=$(tty) 
	@sops --decrypt -i config/.env
	@sops --decrypt -i config/default.json