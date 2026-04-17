// Integration test script for the FastAPI backend using TypeScript.
// Since the backend is written in Python (FastAPI), standard unit tests are in Python (see test_main.py).
// This TypeScript file can be used to test the backend API endpoints externally.
// To run this, ensure the backend is running and use a tool like ts-node, Deno, or Bun.
// Example: npx ts-node test.ts

async function runTests() {
    console.log("Running backend API tests from TypeScript...");
    
    try {
        // Test Root Endpoint
        const response = await fetch("http://localhost:8000/");
        const data = await response.json();
        
        if (response.ok && data.status === "operational") {
            console.log("✅ Root endpoint (/) test passed.");
        } else {
            console.error("❌ Root endpoint (/) test failed.", data);
        }

        // Test Health Endpoint
        const healthRes = await fetch("http://localhost:8000/health");
        const healthData = await healthRes.json();

        if (healthRes.ok && healthData.status === "ok") {
            console.log("✅ Health endpoint (/health) test passed.");
        } else {
            console.error("❌ Health endpoint (/health) test failed.", healthData);
        }
    } catch (error) {
        console.error("❌ Test execution failed. Ensure the FastAPI backend is running on port 8000.", error);
    }
}

runTests();
