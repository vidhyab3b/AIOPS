#!/bin/bash

# Exit on error
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <argument>"
  exit 1
fi

DB_HOST="mysql-db.aiops.svc.cluster.local"
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

echo -e "$yaml_content" | sed 's/`//g' > "$FILE_TO_ADD"

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

# Variables
AAP_HOST="https://aap-aap.apps.cluster-wkq7q.wkq7q.sandbox2937.opentlc.com/api/controller/v2"
USERNAME="admin"
PASSWORD="MjYxODQy"
TEMPLATE_NAME="NGINX Job Template"      
PROJECT_ID=$(curl -sk -u "$USERNAME:$PASSWORD" "$AAP_HOST/projects/?name=AIOPS%20REPO" | jq -r '.results[0].id')
INVENTORY_ID=$(curl -sk -u "$USERNAME:$PASSWORD" "$AAP_HOST/inventories/?name=RHEL" | jq -r '.results[0].id')
CREDENTIAL_ID=$(curl -sk -u "$USERNAME:$PASSWORD" "$AAP_HOST/credentials/?name=Nginx%20Server" | jq -r '.results[0].id')

# Sync Project
curl -k -u "$USERNAME:$PASSWORD" -X POST "$AAP_HOST/projects/$PROJECT_ID/update/" > /dev/null

TEMPLATE_ID=$(curl -sk -u "$USERNAME:$PASSWORD" "$AAP_HOST/job_templates/?name=$(jq -nr --arg v "$TEMPLATE_NAME" '$v|@uri')" | jq -r '.results[0].id // empty')

if [ -n "$TEMPLATE_ID" ]; then
  echo "Job template exists with ID $TEMPLATE_ID, updating..."
  # Update Job Template
  curl -k -u "$USERNAME:$PASSWORD" -X PATCH "$AAP_HOST/job_templates/$TEMPLATE_ID/" \
    -H 'Content-Type: application/json' \
    -d '{
      "inventory": '"$INVENTORY_ID"',
      "project": '"$PROJECT_ID"',
      "playbook": "'"$FILE_TO_ADD"'",
      "credentials": '"$CREDENTIAL_ID"',
      "ask_variables_on_launch": true
    }'
else
  echo "Creating new job template..."
  # Create Job Template
  curl -k -u "$USERNAME:$PASSWORD" -X POST "$AAP_HOST/job_templates/" \
      -H 'Content-Type: application/json' \
      -d '{
        "name": "'"$TEMPLATE_NAME"'",
        "job_type": "run",
        "inventory": '"$INVENTORY_ID"',
        "project": '"$PROJECT_ID"',
        "playbook": "'"$FILE_TO_ADD"'",
        "credentials": '"$CREDENTIAL_ID"',
        "ask_variables_on_launch": true
  }'
  TEMPLATE_ID=$(curl -sk -u "$USERNAME:$PASSWORD" "$AAP_HOST/job_templates/?name=$(jq -nr --arg v "$TEMPLATE_NAME" '$v|@uri')" | jq -r '.results[0].id // empty')
  curl -sk -u "$USERNAME:$PASSWORD" -X POST \
  "$AAP_HOST/job_templates/$TEMPLATE_ID/credentials/" \
  -H 'Content-Type: application/json' \
  -d '{"id": '"$CREDENTIAL_ID"'}'
fi

# TEMPLATE_ID=$(curl -s -k -u "$USERNAME:$PASSWORD" "$AAP_HOST/job_templates/?name=$(printf %s "$TEMPLATE_NAME" | jq -sRr @uri)" | jq '.results[0].id')
curl -k -u "$USERNAME:$PASSWORD" -X POST "$AAP_HOST/api/controller/v2/job_templates/$TEMPLATE_ID/credentials/" -H "Content-Type: application/json"  -d '{"id": '"$CREDENTIAL_ID"'}'

# Launch the Template
curl -k -u "$USERNAME:$PASSWORD" -X POST "$AAP_HOST/job_templates/$TEMPLATE_ID/launch/" > /dev/null

# Check Job Status
JOB_ID=$(curl -s -k -u "$USERNAME:$PASSWORD" "$AAP_HOST/job_templates/$TEMPLATE_ID/" | jq '.summary_fields.recent_jobs[0].id')

while true; do
  STATUS=$(curl -s -k -u "$USERNAME:$PASSWORD" "$AAP_HOST/jobs/$JOB_ID/" | jq -r '.status')
  echo "Job $JOB_ID status: $STATUS"
  # Exit the loop if job is done
  if [[ "$STATUS" == "successful" || "$STATUS" == "failed" || "$STATUS" == "error" || "$STATUS" == "canceled" ]]; then
    echo "Job finished with status: $STATUS"
    break
  fi
  # Wait before polling again
  sleep 10
done


mysqlsh --host="$DB_HOST" --user="$DB_USER" --password="$DB_PASS" --port="$PORT" --sql -e "USE $DB_NAME; INSERT INTO Playbook_Status (Error_ID, RCA_ID, Server_Name, Execution_Status) VALUES ($error_id, '$ROW_ID', '$server_name', '$STATUS');" 

rm -rf temp_git_repo*
