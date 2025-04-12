package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"context"
	"time"

	"github.com/gorilla/mux"
	"github.com/RonaldAG/customized-ui/backend/handlers"
)

func main() {
	l := log.New(os.Stdout, "product-api", log.Default().Flags())

	ph := handlers.NewProducts(l)

	sm := mux.NewRouter()

	getRouter := sm.Methods(http.MethodGet).Subrouter()
	getRouter.HandleFunc("/", ph.GetProducts)

	server := http.Server{
		Addr:    ":9090",
		Handler: sm,
	}

	go func() {
		err :=	server.ListenAndServe()
		if err != nil {
			l.Fatal(err)
		}
	}()

	// trap sigterm or interupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	// Block until a signal is received.
	sig := <-c
	log.Println("Got signal:", sig)

	// gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(ctx)
}
