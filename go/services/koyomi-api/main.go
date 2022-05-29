package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

type M map[string]interface{}

type Server struct {
	server *http.Server
	router *mux.Router
}

func NewServer() *Server {
	s := Server{
		server: &http.Server{
			WriteTimeout: 5 * time.Second,
			ReadTimeout:  5 * time.Second,
			IdleTimeout:  5 * time.Second,
		},
		router: mux.NewRouter().StrictSlash(true),
	}

	s.routes()

	s.server.Handler = s.router

	return &s
}

func (s *Server) Run(port string) error {
	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}
	s.server.Addr = port
	log.Printf("server starting on %s", port)
	return s.server.ListenAndServe()
}

type config struct {
	port string
}

func (s *Server) routes() {
	s.router.Use(cors.AllowAll().Handler)
	// s.router.Use(Logger(os.Stdout))
	apiRouter := s.router.PathPrefix("/api/v1").Subrouter()

	noAuth := apiRouter.PathPrefix("").Subrouter()
	{
		noAuth.Handle("/holidays", s.listHolidays()).Methods("GET")
	}
}

func writeJSON(w http.ResponseWriter, code int, data interface{}) {
	jsonBytes, err := json.Marshal(data)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_, err = w.Write(jsonBytes)

	if err != nil {
		log.Println(err)
	}
}

func (s *Server) listHolidays() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		d := []string{"a", "b", "c"}
		writeJSON(w, http.StatusOK, M{"data": d})
	}
}

func main() {
	conf := envConfig()

	srv := NewServer()
	log.Fatal(srv.Run(conf.port))
}

func envConfig() config {
	port, ok := os.LookupEnv("PORT")

	if !ok {
		panic("PORT not provided")
	}

	return config{port}
}
