package api

import (
	"embed"
	"net/http"
	"portofolio/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/template/html/v2"
)

//go:embed all:views
var viewsFS embed.FS

//go:embed all:public
var publicFS embed.FS

var app *fiber.App

func init() {
	// Initialize template engine using embedded files
	engine := html.NewFileSystem(http.FS(viewsFS), ".html")

	// Create Fiber app
	app = fiber.New(fiber.Config{
		Views: engine,
	})

	// Setup routes FIRST (before static files)
	routes.SetupRoutes(app)

	// Static file handler using embedded files (for css, js, img, etc.)
	app.Use("/css", filesystem.New(filesystem.Config{
		Root:       http.FS(publicFS),
		PathPrefix: "public/css",
		Browse:     false,
	}))
	app.Use("/js", filesystem.New(filesystem.Config{
		Root:       http.FS(publicFS),
		PathPrefix: "public/js",
		Browse:     false,
	}))
	app.Use("/img", filesystem.New(filesystem.Config{
		Root:       http.FS(publicFS),
		PathPrefix: "public/img",
		Browse:     false,
	}))
	app.Use("/fonts", filesystem.New(filesystem.Config{
		Root:       http.FS(publicFS),
		PathPrefix: "public/fonts",
		Browse:     false,
	}))
}

// Handler is the exported function Vercel will call
func Handler(w http.ResponseWriter, r *http.Request) {
	adaptor.FiberApp(app)(w, r)
}
