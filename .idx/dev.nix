{ pkgs, ... }: {
  # Let Nix handle packages, nix-env and nix-shell will still work.
  # Use https://search.nixos.org/packages to find packages.
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace.
  env = {
    # Example:
    # GREETING = "hello from dev.nix";
  };

  # VS Code extensions.
  # Use https://open-vsx.org/ to find extensions.
  idx = {
    extensions = [
      # Example:
      # "vscodevim.vim"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        # Example:
        # npm-install = "npm install";
      };
      # Runs every time the workspace is (re)started.
      onStart = {
        # Example:
        # start-server = "npm run dev";
      };
    };

    # Web-based previews.
    previews = {
      enable = true;
      previews = {
        # web = {
        #   # Example:
        #   command = ["npm" "run" "dev" "--" "--port" "$PORT"];
        #   manager = "web";
        # };
      };
    };
  };
}
