<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Auth Routes
$app->post('/api/auth/register', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Username, email and password are required'
        ]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(400);
    }
    
    // TODO: Add your database connection and user creation logic here
    // For now, we'll return a mock response
    $mockUser = [
        'id' => 1,
        'username' => $data['username'],
        'email' => $data['email'],
        'status' => 'online',
        'last_seen' => date('Y-m-d H:i:s')
    ];
    
    $mockResponse = [
        'token' => 'mock_token_' . time(),
        'user' => $mockUser
    ];
    
    $response->getBody()->write(json_encode($mockResponse));
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
});

// Login Route
$app->post('/api/auth/login', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    
    if (!isset($data['email']) || !isset($data['password'])) {
        $response->getBody()->write(json_encode([
            'error' => 'Email and password are required'
        ]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(400);
    }
    
    // TODO: Add your authentication logic here
    // For now, we'll return a mock response
    $mockUser = [
        'id' => 1,
        'username' => 'test_user',
        'email' => $data['email'],
        'status' => 'online',
        'last_seen' => date('Y-m-d H:i:s')
    ];
    
    $mockResponse = [
        'token' => 'mock_token_' . time(),
        'user' => $mockUser
    ];
    
    $response->getBody()->write(json_encode($mockResponse));
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
}); 