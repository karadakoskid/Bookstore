#!/bin/bash

echo "=== Testing Bookstore Kubernetes Ingress ==="

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is running
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ No Kubernetes cluster is running"
    echo "💡 Start minikube with: minikube start"
    exit 1
fi

echo "✅ Kubernetes cluster is running"

# Check if namespace exists
if kubectl get namespace bookstore &> /dev/null; then
    echo "✅ Bookstore namespace exists"
else
    echo "⚠️  Bookstore namespace doesn't exist"
    echo "💡 Create it with: kubectl apply -f k8s/namespace.yaml"
fi

# Check if ingress exists
if kubectl get ingress bookstore-ingress -n bookstore &> /dev/null; then
    echo "✅ Ingress is deployed"
    
    # Get ingress details
    echo -e "\n📋 Ingress Details:"
    kubectl get ingress bookstore-ingress -n bookstore
    
    # Check ingress controller
    echo -e "\n🔍 Checking ingress controller:"
    kubectl get pods -n ingress-nginx 2>/dev/null || echo "❌ Nginx ingress controller not found"
    
else
    echo "❌ Ingress not deployed"
    echo "💡 Deploy with: kubectl apply -f k8s/"
fi

# Test if host is configured
if grep -q "bookstore.local" /etc/hosts; then
    echo "✅ Host entry configured in /etc/hosts"
else
    echo "⚠️  Host entry not found in /etc/hosts"
    echo "💡 Add with: echo '127.0.0.1 bookstore.local' >> /etc/hosts"
fi

echo -e "\n🧪 Test Commands:"
echo "curl http://bookstore.local/api/books"
echo "curl http://bookstore.local/"
echo "open http://bookstore.local"

