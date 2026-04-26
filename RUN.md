# How to Run the Vaccine Tracker Project

## Prerequisites
- Node.js (v18+) installed
- npm installed

---

## Step 1: Install Dependencies

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Step 2: Start the Blockchain Node

```powershell
npm run node
```

Keep this terminal running. The node runs at `http://127.0.0.1:8545`

---

## Step 3: Deploy the Smart Contract

Open a **new terminal** and run:

```powershell
npm run deploy
```

This deploys the ShipmentTracker contract with upgradeable proxy.

---

## Step 4: Start the Frontend

Open another **new terminal** and run:

```powershell
cd frontend
npm run dev
```

Then open your browser to: **http://localhost:5173**

---

## Quick Start Script (Run All at Once)

Create a file `run.bat` in the project root:

```batch
@echo off
echo Starting Vaccine Tracker Blockchain Project...
echo.

echo [1/3] Starting Hardhat Node...
start "Hardhat Node" cmd /k "npm run node"

timeout /t 5 /nobreak > nul

echo [2/3] Deploying Smart Contract...
start "Deploy Contract" cmd /k "npm run deploy"

timeout /t 5 /nobreak > nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo - Blockchain: http://127.0.0.1:8545
echo - Frontend:   http://localhost:5173
echo.
pause
```

---

## Troubleshooting

### If vite is not recognized:
```powershell
cd frontend
npx vite --host 0.0.0.0 --port 5173
```

### If deployment fails:
Make sure the Hardhat node is running first.

### Test Accounts (for development):
- Account #0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`