package main

import (
	"embed"
	"log"
	"net/http"
	"os"
	"portofolio/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/template/html/v2"
)

//go:embed views/*
var viewsFS embed.FS

//go:embed public/*
var publicFS embed.FS

func main() {
	// Initialize standard Go html template engine using embedded files
	engine := html.NewFileSystem(http.FS(viewsFS), ".html")
	engine.Reload(true) // Enable hot reloading for templates

	// Pass the engine to the Fiber app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Static file handler using embedded files
	app.Use("/", filesystem.New(filesystem.Config{
		Root:   http.FS(publicFS),
		PathPrefix: "public",
		Browse: false,
	}))

	// Setup routes
	routes.SetupRoutes(app)

	// Listen on port from environment or default to 3000
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server started on http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}
