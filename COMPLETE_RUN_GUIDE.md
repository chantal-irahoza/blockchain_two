# Complete Run Guide - Vaccine Tracker (30/30)

## Quick Fix & Run Commands

### Step 0: Fix Configurations (IMPORTANT)

**Fix 1 - Update Frontend for Localhost:**
Edit `frontend/src/pages/Dashboard.jsx`:
```javascript
// Line ~15-16
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // or your proxy address
const RPC_URL = "http://127.0.0.1:8545";
```

**Fix 2 - Exporter uses correct local contract (already in .env):**
```powershell
# In monitoring/.env (create this file)
RPC_URL=http://host.docker.internal:8545
CONTRACT_ADDRESS=0xYourProxyAddress
PORT=9000
```

---

### Step 1: Install Dependencies (Terminal 1)
```powershell
# Project root
npm install
cd frontend && npm install && cd ..
cd monitoring && npm install && cd ..
```

### Step 2: Start Blockchain (Terminal 2)
```powershell
npm run node
# Keep running - http://127.0.0.1:8545
```

### Step 3: Deploy Contract (Terminal 3)
```powershell
npm run deploy
# Creates address-deployment.json with proxy + impl addresses
```

### Step 4: Update & Start Frontend (Terminal 4)
```powershell
# Edit Dashboard.jsx with your proxy address first!
cd frontend
npm run dev
# Open http://localhost:5173
```

### Step 5: Start Monitoring (Terminal 5)
```powershell
cd monitoring
docker-compose up --build
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
# Exporter: http://localhost:9000/metrics
```

---

## How to Demo Each Category (30 Points)

### Category 1: Proxy Architecture (5/5)
**Evidence:** Show `address-deployment.json`
```powershell
type address-deployment.json
```
- You will see `shipmentTrackerProxy` and `shipmentTrackerImplementation`
- The contract uses `initialize()` not constructor (see `ShipmentTracker.sol`)

---

### Category 2: Security Audit (5/5)
**Option A - Slither (already have SECURITY_REPORT.md):**
```powershell
slither . --exclude-dependencies
```
Show `SECURITY_REPORT.md` - it proves:
- ✅ Timestamp Dependency: NOT FOUND
- ✅ Gasless Send: NOT FOUND

**Option B - Aderyn:**
```powershell
npm run audit
# or
aderyn .
```

---

### Category 3: Real-time Frontend (5/5)
**Trigger TemperatureAlert Event:**
```powershell
npx hardhat console --network localhost
```
```javascript
const addr = "0xYourProxyAddress";
const contract = await ethers.getContractAt("ShipmentTracker", addr);
await contract.updateStatus(1, 30); // 30 > 25 threshold = REVERT + event
```

**What happens:**
1. Transaction REVERTS with `"Temperature breach: Vaccine safety threshold exceeded"`
2. `TemperatureAlert` event is emitted
3. Frontend detects via `useWatchContractEvent`
4. **RED OVERLAY** appears immediately (no refresh)

---

### Category 4: Docker Compose (5/5)
```powershell
cd monitoring
docker-compose up --build
```

**Verify 3 containers running:**
```powershell
docker ps
```
Expected:
- `prometheus`
- `blockchain_exporter`
- `grafana`

**Verify Prometheus scraping:**
- Open http://localhost:9090/targets
- `shipment_exporter` should be `UP`

**Verify metrics:**
- Open http://localhost:9000/metrics
- You should see `shipment_temperature_celsius`, `ethereum_gas_price_gwei`, etc.

---

### Category 5: Tenderly Debugger (5/5)
**Setup:**
1. Create `.env` file in project root:
```
TENDERLY_PROJECT=your-project
TENDERLY_USERNAME=your-username
SEPOLIA_PRIVATE_KEY=your-key
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

2. Deploy to Sepolia:
```powershell
npx hardhat run scripts/deploy.js --network sepolia
```

3. Trigger revert:
```powershell
npx hardhat console --network sepolia
```
```javascript
const contract = await ethers.getContractAt("ShipmentTracker", "PROXY_ADDRESS");
await contract.updateStatus(1, 30);
```

4. Go to https://dashboard.tenderly.co
5. Find the reverted `updateStatus` transaction
6. Click **Debugger**
7. Show the exact line:
```solidity
revert("Temperature breach: Vaccine safety threshold exceeded");
```

---

### Category 6: Grafana Alerting (5/5)
**Verify Alert Rule:**
1. Open http://localhost:3000/alerting/list
2. Find `HighShipmentReverts`
3. Show configuration:
   - Condition: `sum_over_time(shipment_reverts_total[10m]) > 3`
   - Duration: 1m
   - Severity: critical

**Configure Slack (optional):**
1. In Grafana: Alerting → Contact Points
2. Add Slack webhook URL
3. Link to `HighShipmentReverts` alert rule

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vite)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  useWatchContractEvent → TemperatureAlert → RED UI  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Transparent Proxy (OpenZeppelin)                │
│                    Proxy Address: 0x...                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ShipmentTracker Implementation                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  updateStatus() → if temp > 25 → REVERT             │   │
│  │  emit TemperatureAlert()                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│  │Prometheus│◄──│ Exporter │   │ Grafana  │               │
│  └──────────┘   └──────────┘   └──────────┘               │
│       │                                │                   │
│       └────────── Alert (>3 reverts)──►│                   │
└─────────────────────────────────────────────────────────────┘
```

## Exam Presentation Script

| Time | What to Show | File/URL |
|------|-------------|----------|
| 1 min | Proxy deployed | `address-deployment.json` |
| 1 min | Security report | `SECURITY_REPORT.md` or Aderyn output |
| 2 min | Frontend demo | http://localhost:5173 + trigger alert |
| 1 min | Docker running | `docker ps` + http://localhost:9090 |
| 2 min | Tenderly trace | dashboard.tenderly.co |
| 1 min | Grafana alert | http://localhost:3000/alerting/list |

**Total: 30/30**

