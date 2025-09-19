const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy instance
const proxy = httpProxy.createProxyServer({});

// Your Render URLs
const BACKEND_URL = 'https://bookstore-backend-tlao.onrender.com';
const FRONTEND_URL = 'https://YOUR_FRONTEND_NAME.onrender.com'; // Replace with your actual frontend URL

const server = http.createServer((req, res) => {
    console.log(`📥 Request: ${req.method} ${req.url}`);
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Route based on path (similar to Kubernetes ingress)
    if (req.url.startsWith('/api')) {
        console.log(`🔀 Routing to backend: ${BACKEND_URL}${req.url}`);
        proxy.web(req, res, {
            target: BACKEND_URL,
            changeOrigin: true,
            secure: true
        });
    } else {
        console.log(`🔀 Routing to frontend: ${FRONTEND_URL}${req.url}`);
        proxy.web(req, res, {
            target: FRONTEND_URL,
            changeOrigin: true,
            secure: true
        });
    }
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 Ingress test server running on http://localhost:${PORT}`);
    console.log(`📝 Test commands:`);
    console.log(`   curl http://localhost:${PORT}/api/books`);
    console.log(`   curl http://localhost:${PORT}/`);
    console.log(`   open http://localhost:${PORT}`);
});
