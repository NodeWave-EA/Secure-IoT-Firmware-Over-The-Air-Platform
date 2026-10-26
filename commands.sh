bw run lint --parallel=auto
bw run build @fota/api-gateway
bw run build --parallel=auto

lsof -i :3000 -t | xargs kill -9

# Update Workspace dependencies
bunx npm-check-updates -i --workspaces

docker compose config

# Supabase Docker Setup
# 1. Clone the metadata only (no files yet) from the latest commit
git clone --filter=blob:none --no-checkout --depth=1 --progress --branch master https://github.com/supabase/supabase "docker/supabase"

# 2. Move into the repo directory
cd docker/supabase

# 3. Initialize sparse-checkout in cone mode
git sparse-checkout init --cone

# 4. Restrict the workspace specifically to the docker folder
git sparse-checkout set docker

# 5. Populate your working directory with the files (CORRECTED)
git checkout master