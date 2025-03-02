<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

// Add routing middleware
$app->addRoutingMiddleware();

// CORS middleware - moved before routes
$app->add(function (Request $request, $handler) {
    $response = $handler->handle($request);
    $origin = $request->getHeaderLine('Origin');
    $allowedOrigins = [
        'https://bulutmesaj-jegnope5s-ugurs-projects-3a76946a.vercel.app',
        'https://bulutmesaj.vercel.app'
    ];
    
    if (in_array($origin, $allowedOrigins)) {
        return $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    return $response;
});

// OPTIONS request handler
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// Add error middleware
$app->addErrorMiddleware(true, true, true);

// Test route
$app->get('/api/test', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode(['status' => 'ok']));
    return $response->withHeader('Content-Type', 'application/json');
});

// Routes
require __DIR__ . '/src/routes/api.php';

$app->run(); 