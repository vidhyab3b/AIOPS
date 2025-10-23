#!/bin/bash

# Exit on error
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <argument>"
  exit 1
fi

DB_HOST="127.0.0.1"
DB_USER="mysql"
DB_PASS="redhat"
DB_NAME="aiopsdb"
PORT="3306"
RCA_TABLE="Error_RCA"
ERROR_TABLE="Error_Table"
COLUMN_PLAYBOOK="ansible_playbook"
COLUMN_SERVER=""
ROW_ID=$1 #51
FILE_TO_ADD="nginx_restart.yaml"
ERROR_ID="errorid"

error_id=$(mysqlsh --host="$DB_HOST" --user="$DB_USER" --password="$DB_PASS" --port="$PORT" --sql -e "USE $DB_NAME; SELECT $ERROR_ID FROM $RCA_TABLE WHERE id = $ROW_ID;" | sed '1d' | sed 's/\\n/\n/g')
server_name=$(mysqlsh --host="$DB_HOST" --user="$DB_USER" --password="$DB_PASS" --port="$PORT" --sql -e "USE $DB_NAME; SELECT Server_Name FROM $ERROR_TABLE WHERE id = $error_id;" | sed '1d' | sed 's/\\n/\n/g')

yaml_content=$(mysqlsh --host="$DB_HOST" --user="$DB_USER" --password="$DB_PASS" --port="$PORT" --sql -e "USE $DB_NAME;SELECT $COLUMN_PLAYBOOK FROM $RCA_TABLE WHERE id = $ROW_ID;" | sed '1d' | sed 's/\\n/\n/g')

echo -e "$yaml_content" | grep -v "\`\`\`" > "$FILE_TO_ADD"

REPO_URL="https://vidhyab3b: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@github.com/vidhyab3b/AIOPS-Demo.git"
COMMIT_MSG="Add $FILE_TO_ADD"
WORK_DIR="temp_git_repo_$$"

# Clone repo
echo "Cloning repository..."
git clone "$REPO_URL" "$WORK_DIR"
cd "$WORK_DIR"

if [ ! -f $FILE_TO_ADD ]; then
# Copy file into the repo
cp "../$FILE_TO_ADD" .

# Configure Git Global Variables
git config --global user.name "Vidhya"
git config --global user.email "vidyavece@gmail.com"

# Add and commit the file
echo "Adding and committing $FILE_TO_ADD..."
git add "$FILE_TO_ADD"
git commit -m "$COMMIT_MSG"

# Push the changes
echo "Pushing to remote..."
git push

echo "Done. File '$FILE_TO_ADD' has been added and pushed to $REPO_URL."

# Cleanup
cd ..
rm -rf "$WORK_DIR"
fi
