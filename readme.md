## For FASTAPI backend and firestore 

## Setup Guide

1. **Obtain Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to "IAM & Admin" > "Service Accounts".
   - Create a new service account with appropriate roles for accessing Firebase Auth and Firestore.
   - Generate a JSON key file for the service account and save it securely.

2. **Configure Environment Variables**:
   - Create a `.env` file in the root of the project.
   - Add the following environment variables:

     ```plaintext
     NEXT_PUBLIC_API_BASE_URL=http://your-api-base-url
     FIREBASE_SERVICE_ACCOUNT_PATH=task-manager-backend/app
     ```

3. **Place the Service Account File**:
   - Place the `service-account.json` file in the directory specified in the `task-manager-backend/app`.

4. **Run the Application**:
   - Start the application.

5. **Verify Access**:
   - Ensure that the application can access Firebase Auth and Firestore correctly. Check the logs for any authentication or access errors.

For further assistance, refer to the project's README or contact me @ alihaiderkhannews@gmail.com.


## To start backend/fast api server 
1. Navigate to `task-manager-backend` folder with `cd task-manager-backend`
2. Create a .env file next to .env.sample and add all values that are present in sample to env
3. In terminal run the command `uvicorn app.main:app --reload`

# To start frontend/next.js server
1. Navigate to `task-manager-frontend` folder with `task-manager-frontend`
2. Create a .env file next to .env.sample and add all values that are present in sample to env
3. In terminal run the command `npm i` and then `npm run dev`



