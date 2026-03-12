package main

import (
	"log"
	"os"
	"portofolio/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	// Initialize standard Go html template engine pointing to api folder
	engine := html.New("./api/views", ".html")
	engine.Reload(true) // Enable hot reloading for templates

	// Pass the engine to the Fiber app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Static file handler for CSS, JS, Images from api folder
	app.Static("/", "./api/public")

	// Setup routes
	routes.SetupRoutes(app)

	// Listen on port from environment or default to 8081
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server started on http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}
