# How to Start MongoDB

Since the app reported `ECONNREFUSED`, your database is offline. Here is how to start it:

### Option 1: Using Windows Services (Recommended)
1. Press `Windows + R` on your keyboard.
2. Type `services.msc` and press Enter.
3. Scroll down and find **MongoDB Server**.
4. Right-click it and select **Start**.
   - *If you don't see it, try Option 2.*

### Option 2: Using the Command Line
1. Open a new Terminal as Administrator (Right-click Start > Terminal (Admin)).
2. Run this command:
   ```cmd
   net start MongoDB
   ```
   - *If it says "Access denied", ensure you are running as Admin.*

### Option 3: Manual Run (If not installed as a Service)
1. First, ensure the data folder exists. Run this in a terminal:
   ```cmd
   mkdir C:\data\db
   ```
2. Then, try to run the database manually:
   ```cmd
   mongod
   ```
   - *If `mongod` is not found, you need to find where you installed MongoDB (usually `C:\Program Files\MongoDB\Server\X.X\bin`) and add it to your PATH, or run it from there.*

### After Starting
Once the database is running:
1. Go back to your backend terminal (VSCode).
2. If it is still crashing, press `Ctrl+C` to stop it, then run `npm start` again.
3. It should say `MongoDB Connected`.
